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
import type { Order } from "../types/order";

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
