import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
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

  const getStatusStyle = (status: OrderStatus) => {
    return (
      statusStyles[status] || { chipColor: "default", borderColor: "#BDBDBD" }
    );
  };

  const latestStatusStyle = getStatusStyle(latestStatus);

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
            <Typography fontWeight={700} variant="subtitle1">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </Typography>
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
            <OrderStatusLogView log={order.status_log} />
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
      </CardContent>
    </Card>
  );
};

export default OrderCard;
