// import { serve } from "https://deno.land/std/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// interface CartItem {
//   product_id: string;
//   qty: number;
// }

// interface Customer {
//   name: string;
//   address: string;
//   district: string;
//   phone1: string;
//   phone2: string;
// }

// // Allowed origins for CORS
// const ALLOWED_ORIGINS = [
//   "http://localhost:5173", // local dev
//   "https://pasindu-promodh.github.io", // production frontend
// ];

// serve(async (req) => {
//   const origin = req.headers.get("origin") || "";
//   const corsHeaders = {
//     "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin)
//       ? origin
//       : "",
//     "Access-Control-Allow-Methods": "POST, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   };

//   // Handle preflight requests
//   if (req.method === "OPTIONS") {
//     return new Response(null, {
//       status: 204,
//       headers: corsHeaders,
//     });
//   }

//   const supabase = createClient(
//     Deno.env.get("SUPABASE_URL")!,
//     Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
//   );

//   try {
//     const { user_id, items, customer, payment_method } = (await req.json()) as {
//       user_id?: string;
//       items: CartItem[];
//       customer: Customer;
//       payment_method: string;
//     };

//     if (!items || items.length === 0) {
//       return new Response(JSON.stringify({ error: "Cart empty" }), {
//         status: 400,
//         headers: corsHeaders,
//       });
//     }

//     // Fetch product data
//     const productIds = items.map((i) => i.product_id);
//     const { data: products, error } = await supabase
//       .from("products")
//       .select("id, price, discount")
//       .in("id", productIds);

//     if (error || !products) {
//       return new Response(JSON.stringify({ error: "Invalid products" }), {
//         status: 400,
//         headers: corsHeaders,
//       });
//     }

//     let subtotal = 0;
//     let discountedSubtotal = 0;

//     const verifiedItems = items.map((item) => {
//       const product = products.find((p: any) => p.id === item.product_id);
//       if (!product) throw new Error(`Invalid product ${item.product_id}`);

//       const price = Number(product.price);
//       subtotal += price * item.qty;

//       const discountedPrice = Math.round(
//         price * (1 - (product.discount ?? 0) / 100)
//       );
//       discountedSubtotal += discountedPrice * item.qty;

//       return {
//         product_id: item.product_id,
//         qty: item.qty,
//         price,
//         discount: product.discount,
//       };
//     });

//     const discount = subtotal - discountedSubtotal;
//     const shipping = 350;
//     const total = subtotal + shipping - discount;

//     // Insert order
//     const { data: order, error: insertErr } = await supabase
//       .from("orders")
//       .insert({
//         user_id: user_id || null,
//         items: verifiedItems,
//         subtotal,
//         discount,
//         discounted_subtotal: discountedSubtotal,
//         shipping,
//         total,
//         customer_name: customer.name,
//         address: customer.address,
//         district: customer.district,
//         phone1: customer.phone1,
//         phone2: customer.phone2,
//         payment_method,
//       })
//       .select("id")
//       .single();

//     if (insertErr) {
//       return new Response(JSON.stringify({ error: insertErr.message }), {
//         status: 400,
//         headers: corsHeaders,
//       });
//     }

//     return new Response(
//       JSON.stringify({ success: true, order_id: order.id }),
//       { status: 200, headers: corsHeaders }
//     );
//   } catch (err) {
//     return new Response(JSON.stringify({ error: (err as Error).message }), {
//       status: 500,
//       headers: corsHeaders,
//     });
//   }
// });






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

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "http://localhost:5173", // local dev
  "https://pasindu-promodh.github.io", // production frontend
];

serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin)
      ? origin
      : "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
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
        headers: corsHeaders,
      });
    }

    // Fetch product data
    const productIds = items.map((i) => i.product_id);
    const { data: products, error } = await supabase
      .from("products")
      .select("id, price, original_price, discount")
      .in("id", productIds);

    if (error || !products) {
      return new Response(JSON.stringify({ error: "Invalid products" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    let subtotal = 0;
    let discountedSubtotal = 0;
    let profit = 0;

    const verifiedItems = items.map((item) => {
      const product = products.find((p: any) => p.id === item.product_id);
      if (!product) throw new Error(`Invalid product ${item.product_id}`);

      const price = Number(product.price);
      const originalPrice = Number(product.original_price);

      subtotal += price * item.qty;

      const discountedPrice = Math.round(
        price * (1 - (product.discount ?? 0) / 100)
      );

      discountedSubtotal += discountedPrice * item.qty;

      const itemProfit = (discountedPrice - originalPrice) * item.qty;
      profit += itemProfit;

      return {
        product_id: item.product_id,
        qty: item.qty,
        price,
        original_price: originalPrice,
        discount: product.discount,
        profit: itemProfit, // optional but smart
      };
    });

    const discount = subtotal - discountedSubtotal;
    const shipping = 350;
    const total = subtotal + shipping - discount;

    // Insert order
    const { data: order, error: insertErr } = await supabase
      .from("orders")
      .insert({
        user_id: user_id || null,
        items: verifiedItems,
        subtotal,
        discount,
        discounted_subtotal: discountedSubtotal,
        shipping,
        total,
        profit, // ✅ NEW
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
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({ success: true, order_id: order.id }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
