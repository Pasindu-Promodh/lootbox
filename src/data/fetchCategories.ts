import { supabase } from "../supabase";

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("name");

  if (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }

  const categories = Array.from(
    new Set(data?.map((c) => c.name) ?? [])
  );

  return ["All", ...categories];
}
