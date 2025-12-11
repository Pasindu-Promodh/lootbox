import React from "react";
import { Box, Grow } from "@mui/material";

interface NotificationToastProps {
  open: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
  duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  open,
  message,
  type,
}) => {
  if (!open) return null;

  const getBackground = () => {
    switch (type) {
      case "success":
        return "#4caf50"; // Green
      case "error":
        return "#f44336"; // Red
      case "warning":
        return "#ff9800"; // Orange
      case "info":
        return "#2196f3"; // Blue
      default:
        return "#4caf50";
    }
  };

  return (
    <Grow in={open}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 1500,
        }}
      >
        <Box
          sx={{
            bgcolor: getBackground(),
            color: "white",
            px: { xs: 3, sm: 4 },
            py: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            boxShadow: 6,
            textAlign: "center",
            fontSize: { xs: 16, sm: 20, md: 24 },
            fontWeight: 500,
            maxWidth: "90%",
          }}
        >
          {message}
        </Box>
      </Box>
    </Grow>
  );
};

export default NotificationToast;