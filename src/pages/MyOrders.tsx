import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
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

      // Load orders from Supabase
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        showNotification("Failed to load orders", "error");
        console.error(error);
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      showNotification("An error occurred", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          My Orders
        </Typography>

        {orders.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start shopping to see your orders here
            </Typography>
            <Button variant="contained" onClick={() => navigate("/shop")}>
              Browse Products
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 3 }}>
            {orders.map((order) => (
              <Card
                key={order.id}
                sx={{ mb: 3, border: "1px solid", borderColor: "divider" }}
              >
                <CardContent>
                  {/* Order Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Order ID
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {order.id.slice(0, 8).toUpperCase()}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        Rs. {order.total.toLocaleString()}
                      </Typography>
                    </Box>

                    <Chip
                      label={order.status.toUpperCase()}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Order Items */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Items
                  </Typography>
                  {order.items?.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      {item.image && (
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 1,
                          }}
                        />
                      )}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={500}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default MyOrders;