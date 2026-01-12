import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  type StepIconProps,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import type { OrderStatus, OrderStatusLog } from "../../types/order";

const DEFAULT_STATUSES = ["pending", "processing", "shipped", "delivered"];

const STATUS_COLORS: Record<string, string> = {
  pending: "#FFB300",
  processing: "#2196F3",
  shipped: "#1976D2",
  delivered: "#4CAF50",
  cancelled: "#F44336",
};

interface Props {
  log: OrderStatusLog[];
}

/* ---------- Step Icon ---------- */
const CustomStepIcon = ({
  completed,
  statusName,
}: StepIconProps & { statusName: string }) => {
  if (statusName === "cancelled") {
    return <Cancel sx={{ color: STATUS_COLORS.cancelled }} />;
  }

  return completed ? (
    <CheckCircle sx={{ color: STATUS_COLORS[statusName] || "grey" }} />
  ) : (
    <Box
      sx={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        border: `2px solid ${STATUS_COLORS[statusName] || "grey"}`,
      }}
    />
  );
};

/* ---------- Component ---------- */
const OrderStatusLogView: React.FC<Props> = ({ log }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));


  /* Normalize log:
     - Ensure pending exists
     - Use earliest timestamp as order created time
  */

  const normalizedLog = useMemo<OrderStatusLog[]>(() => {
  if (!log?.length) return [];

  return log.map((l) => ({
    ...l,
    status: l.status.toLowerCase() as OrderStatus, // normalize
  }));
}, [log]);



  const latestStatus =
    normalizedLog[normalizedLog.length - 1]?.status ?? "pending";

  /* Build step sequence */
  const cancelledExists = normalizedLog.some(
    (l) => l.status.toLowerCase() === "cancelled"
  );

  const steps = cancelledExists
    ? [
        ...DEFAULT_STATUSES.filter((s) =>
          normalizedLog.some((l) => l.status === s)
        ),
        "cancelled",
      ]
    : DEFAULT_STATUSES;

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
        {steps.map((status, index) => {
          const stepLogs = normalizedLog.filter(
            (l) => l.status.toLowerCase() === status
          );

          const latestIndex = steps.indexOf(latestStatus);

          return (
            <Step
              key={status}
              completed={index <= latestIndex || status === "cancelled"}
            >
              <StepLabel
                StepIconComponent={(props) => (
                  <CustomStepIcon {...props} statusName={status} />
                )}
              >
                <Typography fontWeight={600} sx={{ fontSize: 12 }}>
                  {status.toUpperCase()}
                </Typography>
              </StepLabel>

              {stepLogs.length > 0 &&
                (isDesktop ? (
                  // Horizontal: just show notes below step label
                  <Box sx={{ mt: 1, textAlign: "center" }}>
                    {stepLogs.map((entry, idx) => (
                      <Box key={idx} sx={{ mb: 0.5 }}>
                        {entry.at && (
                          <Typography variant="body2" color="text.secondary">
                            {new Date(entry.at).toLocaleString()}
                          </Typography>
                        )}
                        {entry.note && (
                          <Typography variant="body2">{entry.note}</Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  // Vertical: use StepContent
                  <Box sx={{ mt: 1, textAlign: "left" }}>
                    {stepLogs.map((entry, idx) => (
                      <Box key={idx} sx={{ mb: 1 }}>
                        {entry.at && (
                          <Typography variant="body2" color="text.secondary">
                            {new Date(entry.at).toLocaleString()}
                          </Typography>
                        )}
                        {entry.note && (
                          <Typography variant="body2" sx={{ mt: 0.25 }}>
                            {entry.note}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                ))}
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default OrderStatusLogView;
