import { supabase } from "../supabase";
import type { Order } from "../types/order";

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load orders", error);
    return [];
  }

  return data || [];
}
