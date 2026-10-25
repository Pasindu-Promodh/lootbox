import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  type ProductRow,
  ValidationError,
  parseOrderRequest,
  plain,
  priceOrder,
} from "./order.ts";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://pickio.lk",
  "https://www.pickio.lk",
  "https://pasindu-promodh.github.io",
];

// The store owner's WhatsApp number (digits only, country code, no "+").
const OWNER_WHATSAPP_NUMBER = "94757007562";

// Anti-spam: max orders per phone number within the window.
const RATE_LIMIT_ORDERS = 3;
const RATE_LIMIT_WINDOW_MINUTES = 10;

// PostgREST error code for "function not found" — lets this function run
// before supabase-sql/stock_and_orders.sql has been applied.
const FUNCTION_NOT_FOUND = "PGRST202";

// Sends a silent order notification to the owner's WhatsApp via Green-API.
// Never throws — a failure here must never fail the order itself.
async function notifyOwnerOnWhatsApp(message: string) {
  const apiUrl = Deno.env.get("GREEN_API_URL");
  const idInstance = Deno.env.get("GREEN_API_ID_INSTANCE");
  const apiTokenInstance = Deno.env.get("GREEN_API_TOKEN");

  if (!apiUrl || !idInstance || !apiTokenInstance) {
    console.warn("Green-API secrets not configured; skipping WhatsApp notification.");
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: `${OWNER_WHATSAPP_NUMBER}@c.us`,
          message,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!res.ok) {
      console.error("Green-API notification failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Green-API notification error:", (err as Error).message);
  }
}

serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";
  const corsHeaders: Record<string, string> = ALLOWED_ORIGINS.includes(origin)
    ? {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
        Vary: "Origin",
      }
    : {};

  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { items, customer, paymentMethod } = parseOrderRequest(await req.json());

    // The order belongs to whoever the JWT says, never to a user_id sent in
    // the body. Guests send the anon key, which isn't a user token, so
    // getUser fails and the order is stored without a user.
    const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    const { data: authData } = await supabase.auth.getUser(token);
    const userId = authData?.user?.id ?? null;

    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString();
    const { count: recentOrders } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("phone1", customer.phone1)
      .gte("created_at", since);

    if ((recentOrders ?? 0) >= RATE_LIMIT_ORDERS) {
      return json(
        { error: "Too many orders in a short time. Please try again later or contact us on WhatsApp." },
        429
      );
    }

    // select("*") so the optional stock column is picked up when it exists.
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .in("id", items.map((i) => i.product_id));

    if (error || !products) {
      console.error("Product lookup failed:", error);
      return json({ error: "Could not load products" }, 500);
    }

    const priced = priceOrder(items, products as ProductRow[]);

    // Atomically take tracked stock and bump sold_count. Raises (and changes
    // nothing) if another order took the last units in the meantime.
    const stockItems = items.map((i) => ({ product_id: i.product_id, qty: i.qty }));
    const { error: reserveErr } = await supabase.rpc("reserve_stock", { p_items: stockItems });
    const stockReserved = !reserveErr;

    if (reserveErr && reserveErr.code !== FUNCTION_NOT_FOUND) {
      if (reserveErr.message.includes("insufficient_stock")) {
        return json({ error: "Sorry, an item in your cart just sold out." }, 409);
      }
      console.error("Stock reservation failed:", reserveErr);
      return json({ error: "Could not place order" }, 500);
    }

    const { data: order, error: insertErr } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        items: priced.verifiedItems,
        pre_discount_subtotal: priced.preDiscountSubtotal,
        subtotal: priced.subtotal,
        discount: priced.discount,
        shipping: priced.shipping,
        total: priced.total,
        profit: priced.profit,
        customer_name: customer.name,
        address: customer.address,
        district: customer.district,
        phone1: customer.phone1,
        phone2: customer.phone2,
        payment_method: paymentMethod,
        // Only sent when reserve_stock ran, which means the SQL that adds
        // this column has been applied. Lets cancellation return the stock.
        ...(stockReserved ? { stock_reserved: true } : {}),
      })
      .select("id")
      .single();

    if (insertErr || !order) {
      console.error("Order insert failed:", insertErr);
      if (stockReserved) {
        const { error: releaseErr } = await supabase.rpc("release_stock", { p_items: stockItems });
        if (releaseErr) console.error("Stock release failed:", releaseErr);
      }
      return json({ error: "Could not place order" }, 500);
    }

    // Notify the owner on WhatsApp. Best-effort: never blocks or fails the order.
    const itemLines = priced.verifiedItems
      .map((i) => `• ${i.qty} x ${plain(i.product_name)} — Rs ${i.price.toLocaleString()}`)
      .join("\n");

    await notifyOwnerOnWhatsApp(
      `🛒 *New Order*\n\n` +
        `Order ID: ${order.id.slice(0, 8).toUpperCase()}\n` +
        `Customer: ${plain(customer.name)}\n` +
        `Phone: ${customer.phone1} / ${customer.phone2}\n` +
        `Address: ${plain(customer.address)}, ${customer.district}\n` +
        `Payment: ${paymentMethod}\n\n` +
        `Items:\n${itemLines}\n\n` +
        `Subtotal: Rs ${priced.preDiscountSubtotal.toLocaleString()}\n` +
        `Discount: Rs ${priced.discount.toLocaleString()}\n` +
        `Shipping: Rs ${priced.shipping.toLocaleString()}\n` +
        `*Total: Rs ${priced.total.toLocaleString()}*`
    );

    return json({ success: true, order_id: order.id }, 200);
  } catch (err) {
    if (err instanceof ValidationError) {
      return json({ error: err.message }, 400);
    }
    if (err instanceof SyntaxError) {
      return json({ error: "Invalid request body" }, 400);
    }
    console.error("create-order failed:", err);
    return json({ error: "Could not place order" }, 500);
  }
});
