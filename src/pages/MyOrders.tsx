import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import OrderCard from "../components/orders/OrderCard";
import type { Order, OrderStatus } from "../types/order";
import { getUserOrders } from "../data/fetchOrders";
import { getProductsByIds } from "../data/fetchProducts";

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [userId, setUserId] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [productMap, setProductMap] = useState<Record<string, any>>({});
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateSort, setDateSort] = useState<"newest" | "oldest">("newest");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

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

      setUserId(session.user.id);

      const orders = await getUserOrders(session.user.id);
      setOrders(orders);

      const productIds = Array.from(
        new Set(
          orders.flatMap((o) =>
            o.items.map((i: { product_id: string }) => i.product_id)
          )
        )
      );

      setProductMap(await getProductsByIds(productIds));
    } catch {
      showNotification("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const visibleOrders = orders
    .filter((order) => {
      if (statusFilter === "all") return true;
      const currentStatus = order.status_log.at(-1)?.status;
      return currentStatus === statusFilter;
    })
    .sort((a, b) => {
      if (dateSort === "oldest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }

      // newest first (default)
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

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
        <Box
          textAlign="center"
          sx={{
            py: 10,
            px: 2,
            borderRadius: 3,
            backgroundColor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Box sx={{ fontSize: 64, mb: 2 }}>📦</Box>

          <Typography variant="h5" fontWeight={600} gutterBottom>
            No orders yet
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven’t placed any orders yet. Once you do, they’ll
            show up here.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/shop")}
          >
            Browse Products
          </Button>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
            {/* DATE SORT */}
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Date</InputLabel>
              <Select
                value={dateSort}
                label="Date"
                onChange={(e) =>
                  setDateSort(e.target.value as "newest" | "oldest")
                }
              >
                <MenuItem value="newest">Newest → Oldest</MenuItem>
                <MenuItem value="oldest">Oldest → Newest</MenuItem>
              </Select>
            </FormControl>

            {/* STATUS FILTER */}
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) =>
                  setStatusFilter(e.target.value as OrderStatus | "all")
                }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              productMap={productMap}
              userId={userId!}
              onOrderUpdated={loadOrders}
              expanded={expandedOrderId === order.id}
              onToggle={() =>
                setExpandedOrderId(
                  expandedOrderId === order.id ? null : order.id
                )
              }
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MyOrders;
