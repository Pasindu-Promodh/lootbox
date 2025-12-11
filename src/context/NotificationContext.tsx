import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import NotificationToast from "../components/NotificationToast";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: NotificationType;
    duration: number;
  }>({
    open: false,
    message: "",
    type: "success",
    duration: 1000,
  });

  const showNotification = useCallback(
    (message: string, type: NotificationType = "success", duration: number = 1000) => {
      // Show new notification
      setNotification({
        open: true,
        message,
        type,
        duration,
      });
    },
    []
  );

  // Auto-hide notification after duration
  useEffect(() => {
    if (notification.open) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, open: false }));
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.open, notification.duration]);

  const handleClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationToast
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={handleClose}
        duration={notification.duration}
      />
    </NotificationContext.Provider>
  );
};