import { Box, Typography, Divider, Paper } from "@mui/material";
import type { Order } from "../../types/order";

const OrderDetails = ({ order }: { order: Order }) => {
  const LabelValue = ({ label, value }: { label: string; value: string }) => (
    <Box mb={1}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={500}>{value}</Typography>
    </Box>
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "grey.50",
      }}
    >
      <Typography fontWeight={700} variant="subtitle1" gutterBottom>
        Delivery Details
      </Typography>

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        {/* Left Column */}
        <Box flex={1}>
          <LabelValue label="Name" value={order?.customer_name} />
          <LabelValue label="District" value={order?.district} />
          <LabelValue label="Address" value={order?.address} />
        </Box>

        {/* Right Column */}
        <Box flex={1}>
          <LabelValue label="Phone 1" value={order?.phone1} />
          {order?.phone2 && <LabelValue label="Phone 2" value={order?.phone2} />}
          <Divider sx={{ my: 1 }} />
          <LabelValue label="Payment Method" value={order?.payment_method} />
        </Box>
      </Box>
    </Paper>
  );
};

export default OrderDetails;

