export interface OrderItem {
  product_id: string;
  qty: number;
  pre_discount_price: number;
  price: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderStatusLog {
  status: OrderStatus;
  at?: string;
  note?: string;
}

export interface Order {
  id: string;
  created_at: string;

  pre_discount_subtotal: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status_log: OrderStatusLog[];
  items: OrderItem[];

  customer_name: string;
  address: string;
  district: string;
  phone1: string;
  phone2: string;
  payment_method: string;
}