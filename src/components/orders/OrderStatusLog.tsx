import { Box, Typography, Stepper, Step, StepLabel, StepContent, useMediaQuery, type StepIconProps } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import type { OrderStatusLog } from "../../types/order";
import { useTheme } from "@mui/material/styles";

const defaultStatuses = ["pending", "processing", "shipped", "delivered"];

const statusColors: Record<string, string> = {
  pending: "#FFB300",
  processing: "#2196F3",
  shipped: "#1976D2",
  delivered: "#4CAF50",
  cancelled: "#F44336",
};

interface Props {
  log: OrderStatusLog[];
}

// Custom step icon to show cross for cancelled
const CustomStepIcon = (props: StepIconProps & { statusName: string }) => {
  const { completed, statusName } = props;

  if (statusName === "cancelled") {
    return <Cancel sx={{ color: statusColors.cancelled }} />;
  }

  return completed ? <CheckCircle sx={{ color: statusColors[statusName] || "grey" }} /> : <Box sx={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${statusColors[statusName] || "grey"}` }} />;
};

const OrderStatusLogView: React.FC<Props> = ({ log }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const latestStatusLog = log.length ? log[log.length - 1] : { status: "pending" };
  const latestStatus = latestStatusLog.status.toLowerCase();

  // Build step sequence dynamically
  let steps = [...defaultStatuses];

  const cancelledLog = log.find((l) => l.status.toLowerCase() === "cancelled");
  if (cancelledLog) {
    const lastActiveIndex = defaultStatuses.indexOf(latestStatus) > -1 ? defaultStatuses.indexOf(latestStatus) : 0;
    steps = [
      ...defaultStatuses.slice(0, lastActiveIndex + 1),
      "cancelled",
      ...defaultStatuses.slice(lastActiveIndex + 1),
    ];
  }

  return (
    <Box>
      <Typography fontWeight={600} mb={2}>
        Order Status
      </Typography>

      <Stepper
        orientation={isDesktop ? "horizontal" : "vertical"}
        activeStep={steps.indexOf(latestStatus)}
        alternativeLabel={isDesktop}
      >
        {steps.map((status, i) => {
          const stepLog = log.find((l) => l.status.toLowerCase() === status);
          const latestIndex = steps.indexOf(latestStatus);

          return (
            <Step
              key={status}
              completed={i <= latestIndex || (status === "cancelled" && i <= latestIndex)}
            >
              <StepLabel StepIconComponent={(props) => <CustomStepIcon {...props} statusName={status} />}>
                <Typography fontWeight={600} sx={{ fontSize: 12 }}>
                  {status.toUpperCase()}
                </Typography>
              </StepLabel>

              {stepLog && (
                <StepContent sx={{ border: isDesktop ? 0 : null }}>
                  {stepLog.at && (
                    <Typography variant="body2" color="text.secondary">
                      {new Date(stepLog.at).toLocaleString()}
                    </Typography>
                  )}
                  {stepLog.note && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {stepLog.note}
                    </Typography>
                  )}
                </StepContent>
              )}
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default OrderStatusLogView;