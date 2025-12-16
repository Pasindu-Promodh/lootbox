import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface CartItem {
  product_id: string;
  qty: number;
}

interface Customer {
  name: string;
  address: string;
  district: string;
  phone1: string;
  phone2: string;
}

serve(async (req) => {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173", // replace with your frontend origin in prod
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { user_id, items, customer, payment_method } = (await req.json()) as {
      user_id?: string;
      items: CartItem[];
      customer: Customer;
      payment_method: string;
    };

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart empty" }), {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "http://localhost:5173" },
      });
    }

    const productIds = items.map((i: any) => i.product_id);

    const { data: products, error } = await supabase
      .from("products")
      .select("id, price, discount, in_stock")
      .in("id", productIds);

    if (error || !products) {
      return new Response(JSON.stringify({ error: "Invalid products" }), {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "http://localhost:5173" },
      });
    }

    let subtotal = 0;
    let discounted_subtotal = 0;

    const verifiedItems = items.map((item: CartItem) => {
      const product = products.find((p: any) => p.id === item.product_id);

      if (!product) {
        throw new Error(`Invalid product ${item.product_id}`);
      }

      if (!product.in_stock) {
        throw new Error(`Product ${item.product_id} is out of stock`);
      }

      const price = Number(product.price);
      subtotal += price * item.qty;
      const discountedPrice = Math.round(
        price * (1 - (product.discount ?? 0) / 100)
      );
      discounted_subtotal += discountedPrice * item.qty;

      return {
        product_id: item.product_id,
        qty: item.qty,
        price,
        discount: product.discount,
      };
    });

    const discount = subtotal - discounted_subtotal;
    const shipping = 350;
    const total = subtotal + shipping - discount;

    const { data: order, error: insertErr } = await supabase
      .from("orders")
      .insert({
        user_id: user_id || null,
        items: verifiedItems,
        subtotal,
        discount,
        discounted_subtotal,
        shipping,
        total,
        customer_name: customer.name,
        address: customer.address,
        district: customer.district,
        phone1: customer.phone1,
        phone2: customer.phone2,
        payment_method,
      })
      .select("id")
      .single();

    if (insertErr) {
      return new Response(JSON.stringify({ error: insertErr.message }), {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "http://localhost:5173" },
      });
    }

    return new Response(JSON.stringify({ success: true, order_id: order.id }), {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "http://localhost:5173" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "http://localhost:5173" },
    });
  }
});
