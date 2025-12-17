import { Box, Typography, Divider, Paper, useMediaQuery } from "@mui/material";
import type { Order } from "../../types/order";
import { useTheme } from "@mui/material/styles";

const Row = ({ label, value, bold, error }: any) => (
  <Box
    display="flex"
    justifyContent="space-between"
    mb={1}
    sx={{ opacity: error ? 0.8 : 1 }}
  >
    <Typography fontWeight={bold ? 700 : 500} color={error ? "error" : "text.primary"}>
      {label}
    </Typography>
    <Typography fontWeight={bold ? 700 : 500} color={error ? "error" : "text.primary"}>
      Rs {value}
    </Typography>
  </Box>
);

const OrderPriceBreakdown: React.FC<{ order: Order }> = ({ order }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: "grey.50",
        // width: isDesktop ? "100%" : "360px",
        ml: isDesktop ? 0 : "auto",
        boxShadow: 1,
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        Price Breakdown
      </Typography>

      <Row label="Subtotal" value={order.subtotal.toLocaleString()} />
      <Row label="Discount" value={`- ${order.discount.toLocaleString()}`} error />
      <Row label="Discounted Subtotal" value={order.discounted_subtotal.toLocaleString()} />
      <Row label="Shipping" value={order.shipping.toLocaleString()} />

      <Divider sx={{ my: 2 }} />

      <Row label="Total" value={order.total.toLocaleString()} bold />
    </Paper>
  );
};

export default OrderPriceBreakdown;
