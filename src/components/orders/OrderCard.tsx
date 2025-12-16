// components/orders/OrderCard.tsx
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Order } from "../../pages/MyOrders";
import OrderItems from "./OrderItems";
import OrderPriceBreakdown from "./OrderPriceBreakdown";

interface Props {
  order: Order;
  productMap: Record<string, any>;
  expanded: boolean;
  onToggle: () => void;
}

const OrderCard: React.FC<Props> = ({
  order,
  productMap,
  expanded,
  onToggle,
}) => {
  const navigate = useNavigate();

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

  return (
    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        {/* BASIC INFO */}
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography fontWeight={600}>
              Order #{order.id.slice(0, 8).toUpperCase()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(order.created_at).toLocaleDateString()}
            </Typography>
          </Box>

          <Box textAlign="right">
            <Chip
              label={order.status.toUpperCase()}
              color={getStatusColor(order.status) as any}
            />
            <Typography fontWeight={700} sx={{mt:1}}>
              Rs {order.total.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button size="small" onClick={onToggle}>
          {expanded ? "Hide details" : "View details"}
        </Button>

        {expanded && (
          <>
            <Divider sx={{ my: 2 }} />
            <OrderItems
              items={order.items}
              productMap={productMap}
              onClickProduct={(id: string) => navigate(`/product/${id}`)}
            />
            <Divider sx={{ my: 2 }} />
            <OrderPriceBreakdown order={order} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
