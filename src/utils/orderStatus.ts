import type { Order, OrderStatus } from "../types/order";

/** Latest status of an order; "pending" if the log is empty or missing. */
export const getLatestOrderStatus = (order: Order): OrderStatus => {
  return order.status_log?.at(-1)?.status ?? "pending";
};
