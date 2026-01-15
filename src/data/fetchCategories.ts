import { supabase } from "../supabase";
import type { Category } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("name, subs")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }

  return data ?? [];
}