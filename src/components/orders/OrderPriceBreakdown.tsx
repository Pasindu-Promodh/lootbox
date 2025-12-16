import { Box, Typography, Divider } from "@mui/material";
import type { Order } from "../../pages/MyOrders";

const Row = ({ label, value, bold, error }: any) => (
  <Box display="flex" justifyContent="space-between">
    <Typography fontWeight={bold ? 700 : 400}>{label}</Typography>
    <Typography
      fontWeight={bold ? 700 : 400}
      color={error ? "error" : "inherit"}
    >
      Rs {value}
    </Typography>
  </Box>
);

const OrderPriceBreakdown: React.FC<{ order: Order }> = ({ order }) => (
  <Box maxWidth={360} ml="auto">
    <Row label="Subtotal" value={order.subtotal} />
    <Row label="Discount" value={`- ${order.discount}`} error />
    <Row label="Discounted Subtotal" value={order.discounted_subtotal} />
    <Row label="Shipping" value={order.shipping} />

    <Divider sx={{ my: 1 }} />

    <Row label="Total" value={order.total} bold />
  </Box>
);

export default OrderPriceBreakdown;
