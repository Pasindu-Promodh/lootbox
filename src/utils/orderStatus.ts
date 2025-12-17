import type { Order, OrderStatus } from "../types/order";

export const getLatestOrderStatus = (order: Order): OrderStatus => {
  return order.status_log[order.status_log.length - 1].status;
};
