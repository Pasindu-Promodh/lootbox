import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import OrderItems from "./OrderItems";
import OrderPriceBreakdown from "./OrderPriceBreakdown";
import type { Order, OrderStatus } from "../../types/order";
import OrderDetails from "./OrderDetails";
import OrderStatusLogView from "./OrderStatusLog";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getLatestOrderStatus } from "../../utils/orderStatus";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import { supabase } from "../../supabase";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDialog from "../common/ConfirmDialog";

interface Props {
  order: Order;
  productMap: Record<string, any>;
  userId: string;
  expanded: boolean;
  onToggle: () => void;
  onOrderUpdated: () => void;
}

const OrderCard: React.FC<Props> = ({
  order,
  productMap,
  userId,
  expanded,
  onToggle,
  onOrderUpdated,
}) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const latestStatus = getLatestOrderStatus(order);

  const statusStyles: Record<
    OrderStatus,
    {
      chipColor:
        | "warning"
        | "info"
        | "primary"
        | "success"
        | "error"
        | "default";
      borderColor: string;
    }
  > = {
    pending: { chipColor: "warning", borderColor: "#FFB300" },
    processing: { chipColor: "info", borderColor: "#2196F3" },
    shipped: { chipColor: "primary", borderColor: "#1976D2" },
    delivered: { chipColor: "success", borderColor: "#4CAF50" },
    cancelled: { chipColor: "error", borderColor: "#F44336" },
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isMarkingDelivered, setIsMarkingDelivered] = useState(false);

  const getStatusStyle = (status: OrderStatus) => {
    return (
      statusStyles[status] || { chipColor: "default", borderColor: "#BDBDBD" }
    );
  };

  const latestStatusStyle = getStatusStyle(latestStatus);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const handleConfirmDelivered = async () => {
    setIsMarkingDelivered(true);

    try {
      const { error } = await supabase.rpc("mark_order_delivered", {
        p_order_id: order.id,
        p_user_id: userId,
      });

      if (error) throw error;

      setConfirmOpen(false);
      showNotification("Order marked as delivered", "success");

      onOrderUpdated(); // refresh parent data
    } catch (err) {
      console.error(err);
      showNotification("Failed to mark order as delivered", "error");
    } finally {
      setIsMarkingDelivered(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        border: 2,
        borderColor: latestStatusStyle.borderColor,
        transition: "0.3s",
        "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
      }}
    >
      <CardContent>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Box>
            <Box display="flex" alignItems="center">
              <Typography fontWeight={700} variant="subtitle1">
                #{order.id.slice(0, 8).toUpperCase()}
              </Typography>
              <Tooltip title="Copy order ID">
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(order.id)}
                >
                  <ContentCopyIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {new Date(order.created_at).toLocaleString()}
            </Typography>
          </Box>

          <Box textAlign="right">
            <Chip
              label={latestStatus.toUpperCase()}
              sx={{
                fontWeight: 600,
                px: 2,
                py: 0.5,
                borderRadius: 2,
                textTransform: "uppercase",
                backgroundColor: latestStatusStyle.borderColor,
                color: "#fff",
              }}
            />
            <Typography fontWeight={700} variant="h6" sx={{ mt: 0.5 }}>
              Rs {order.total.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Accordion for details */}
        <Accordion
          expanded={expanded}
          onChange={onToggle}
          disableGutters
          elevation={0}
          sx={{
            backgroundColor: "grey.50",
            borderRadius: 2,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600} color="text.primary">
              Order Details
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ px: 2, py: 1 }}>
            <Divider sx={{ mb: 2 }} />
            <OrderDetails order={order} />
            <Divider sx={{ my: 2 }} />
            <OrderStatusLogView
              log={order.status_log}
            />
            <Divider sx={{ my: 2 }} />
            <OrderItems
              items={order.items}
              productMap={productMap}
              onClickProduct={(id: string) => navigate(`/product/${id}`)}
            />
            <Divider sx={{ my: 2 }} />
            <OrderPriceBreakdown order={order} />
          </AccordionDetails>
        </Accordion>
        {latestStatus !== "delivered" && latestStatus !== "cancelled" && (
          <Button
            variant="contained"
            color="success"
            onClick={() => setConfirmOpen(true)}
            disabled={isMarkingDelivered}
            sx={{ mt: 2 }}
          >
            {isMarkingDelivered ? "Confirming..." : "Mark as Delivered"}
          </Button>
        )}
      </CardContent>
      <ConfirmDialog
        open={confirmOpen}
        title="Confirm delivery"
        description="Please confirm that you have received this order. This action cannot be undone."
        confirmText="Yes, I received it"
        loading={isMarkingDelivered}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelivered}
      />
    </Card>
  );
};

export default OrderCard;
