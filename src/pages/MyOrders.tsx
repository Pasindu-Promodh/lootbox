// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Container,
//   Typography,
//   CircularProgress,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   Button,
// } from "@mui/material";
// import { supabase } from "../supabase";
// import { useNavigate } from "react-router-dom";
// import { useNotification } from "../context/NotificationContext";

// interface Order {
//   id: string;
//   created_at: string;
//   total: number;
//   status: string;
//   items: OrderItem[];
//   subtotal: number;
//   discount: number;
//   discounted_subtotal: number;
//   shipping: number;
//   payment_method: string;
// }

// interface OrderItem {
//   product_id: string;
//   qty: number;
//   price: number;
//   discount: number;
// }

// const MyOrders: React.FC = () => {
//   const navigate = useNavigate();
//   const { showNotification } = useNotification();

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [productMap, setProductMap] = useState<Record<string, any>>({});

//   const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   const loadOrders = async () => {
//     try {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (!session) {
//         showNotification("Please login to view orders", "error");
//         navigate("/");
//         return;
//       }

//       const { data, error } = await supabase
//         .from("orders")
//         .select("*")
//         .eq("user_id", session.user.id)
//         .order("created_at", { ascending: false });

//       if (error) throw error;

//       setOrders(data || []);

//       const productIds = Array.from(
//         new Set(
//           data?.flatMap((o) =>
//             o.items.map((i: { product_id: any }) => i.product_id)
//           )
//         )
//       );

//       if (productIds.length > 0) {
//         const { data: products } = await supabase
//           .from("products")
//           .select("id, name, images")
//           .in("id", productIds);

//         const map: Record<string, any> = {};
//         products?.forEach((p) => (map[p.id] = p));
//         setProductMap(map);
//       }
//     } catch (err) {
//       console.error(err);
//       showNotification("Failed to load orders", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleOrder = (orderId: string) => {
//     setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
//   };

//   const getPaymentLabel = (method: string, total: number, shipping: number) => {
//     switch (method) {
//       case "full":
//         return "Paid full amount online (5% discount)";
//       case "partial":
//         return `Paid shipping only (Rs ${shipping})`;
//       case "cod":
//         return `Cash on delivery (Rs ${total})`;
//       default:
//         return "Payment method";
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "pending":
//         return "warning";
//       case "processing":
//         return "info";
//       case "shipped":
//         return "primary";
//       case "delivered":
//         return "success";
//       case "cancelled":
//         return "error";
//       default:
//         return "default";
//     }
//   };

//   const Row = ({ label, value, bold, primary, error }: any) => (
//     <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//       <Typography fontWeight={bold ? 700 : 400}>{label}</Typography>
//       <Typography
//         fontWeight={bold ? 700 : 400}
//         color={error ? "error" : primary ? "primary" : "inherit"}
//       >
//         Rs {value}
//       </Typography>
//     </Box>
//   );

//   if (loading) {
//     return (
//       <Container sx={{ py: 8, textAlign: "center" }}>
//         <CircularProgress />
//       </Container>
//     );
//   }

//   return (
//     <div>
//       {/* Hero */}
//       <Box
//         sx={{
//           backgroundImage:
//             "url(https://placehold.co/1200x400?text=My+Orders&bg=555&fg=fff)",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           color: "#fff",
//           py: { xs: 6, md: 10 },
//           textAlign: "center",
//         }}
//       >
//         <Typography variant="h3" fontWeight="bold" mb={1}>
//           My Orders
//         </Typography>
//         <Typography variant="h6">
//           Track and review your past purchases
//         </Typography>
//       </Box>

//       <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", px: 2 }}>
//         {orders.length === 0 ? (
//           <Box sx={{ textAlign: "center", py: 8 }}>
//             <Typography variant="h6" color="text.secondary" mb={2}>
//               You haven’t placed any orders yet
//             </Typography>
//             <Button variant="contained" onClick={() => navigate("/shop")}>
//               Start Shopping
//             </Button>
//           </Box>
//         ) : (
//           <Box sx={{ my: 6 }}>
//             {orders.map((order) => (
//               <Card
//                 key={order.id}
//                 sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}
//               >
//                 <CardContent>
//                   {/* BASIC INFO */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       flexWrap: "wrap",
//                       gap: 2,
//                     }}
//                   >
//                     <Box>
//                       <Typography fontWeight={600}>
//                         Order #{order.id.slice(0, 8).toUpperCase()}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {new Date(order.created_at).toLocaleDateString()}
//                       </Typography>
//                     </Box>

//                     <Box sx={{ textAlign: "right" }}>
//                       <Chip
//                         label={order.status.toUpperCase()}
//                         color={getStatusColor(order.status) as any}
//                         sx={{ mb: 0.5 }}
//                       />
//                       <Typography fontWeight={700}>
//                         Rs {order.total.toLocaleString()}
//                       </Typography>
//                     </Box>
//                   </Box>

//                   <Divider sx={{ my: 2 }} />

//                   <Button size="small" onClick={() => toggleOrder(order.id)}>
//                     {expandedOrderId === order.id
//                       ? "Hide details"
//                       : "View details"}
//                   </Button>

//                   {/* DETAILS */}
//                   {expandedOrderId === order.id && (
//                     <>
//                       <Divider sx={{ my: 2 }} />

//                       {/* ITEMS */}
//                       {order.items.map((item, idx) => {
//                         const product = productMap[item.product_id];
//                         return (
//                           <Box
//                             key={`${order.id}-${idx}`}
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 2,
//                               mb: 2,
//                               pr: 1.5,
//                               borderRadius: 2,
//                               boxShadow: 1,
//                               cursor: "pointer",
//                             }}
//                             onClick={() =>
//                               product && navigate(`/product/${product.id}`)
//                             }
//                           >
//                             {product?.images?.[0] && (
//                               <Box
//                                 component="img"
//                                 src={product.images[0]}
//                                 sx={{
//                                   width: 80,
//                                   height: 80,
//                                   borderRadius: 1,
//                                   objectFit: "cover",
//                                 }}
//                               />
//                             )}

//                             <Box sx={{ flex: 1 }}>
//                               <Typography fontWeight={600}>
//                                 {product?.name ?? "Product"}
//                               </Typography>
//                               <Typography
//                                 variant="body2"
//                                 color="text.secondary"
//                               >
//                                 Qty: {item.qty} × Rs {item.price}
//                               </Typography>
//                             </Box>

//                             <Typography fontWeight={600}>
//                               Rs {(item.qty * item.price).toLocaleString()}
//                             </Typography>
//                           </Box>
//                         );
//                       })}

//                       <Divider sx={{ my: 2 }} />

//                       {/* PRICE BREAKDOWN */}
//                       <Box sx={{ maxWidth: 360, ml: "auto" }}>
//                         <Row label="Subtotal" value={order.subtotal} />
//                         <Row
//                           label="Discount"
//                           value={`- ${order.discount}`}
//                           error
//                         />
//                         <Row
//                           label="Discounted Subtotal"
//                           value={order.discounted_subtotal}
//                         />
//                         <Row label="Shipping" value={order.shipping} />

//                         <Divider sx={{ my: 1 }} />

//                         <Row label="Total" value={order.total} bold primary />

//                         <Typography
//                           variant="body2"
//                           color="text.secondary"
//                           sx={{ mt: 1 }}
//                         >
//                           {getPaymentLabel(
//                             order.payment_method,
//                             order.total,
//                             order.shipping
//                           )}
//                         </Typography>
//                       </Box>
//                     </>
//                   )}
//                 </CardContent>
//               </Card>
//             ))}
//           </Box>
//         )}
//       </Box>
//     </div>
//   );
// };

// export default MyOrders;




// pages/MyOrders.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import OrderCard from "../components/orders/OrderCard";

export interface OrderItem {
  product_id: string;
  qty: number;
  price: number;
  discount: number;
}

export interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discounted_subtotal: number;
  shipping: number;
  payment_method: string;
}

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [orders, setOrders] = useState<Order[]>([]);
  const [productMap, setProductMap] = useState<Record<string, any>>({});
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        showNotification("Please login to view orders", "error");
        navigate("/");
        return;
      }

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setOrders(data || []);

      const productIds = Array.from(
        new Set(data?.flatMap((o) => o.items.map((i: { product_id: string; }) => i.product_id)))
      );

      if (productIds.length) {
        const { data: products } = await supabase
          .from("products")
          .select("id, name, images")
          .in("id", productIds);

        const map: Record<string, any> = {};
        products?.forEach((p) => (map[p.id] = p));
        setProductMap(map);
      }
    } catch {
      showNotification("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, my: 6 }}>
      {orders.length === 0 ? (
        <Box textAlign="center">
          <Typography>No orders yet</Typography>
          <Button variant="contained" onClick={() => navigate("/shop")}>
            Start Shopping
          </Button>
        </Box>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            productMap={productMap}
            expanded={expandedOrderId === order.id}
            onToggle={() =>
              setExpandedOrderId(
                expandedOrderId === order.id ? null : order.id
              )
            }
          />
        ))
      )}
    </Box>
  );
};

export default MyOrders;
