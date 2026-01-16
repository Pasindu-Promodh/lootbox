import { supabase } from "../supabase";
import type { Product } from "../types/product";

export async function getProducts({
  limit = 12,
  offset = 0,
  featured,
  category,
  sub_category,
  in_stock,
  on_sale,
  orderBy,
}: {
  limit?: number;
  offset?: number;
  featured?: boolean;
  category?: string;
  sub_category?: string;
  in_stock?: boolean;
  on_sale?: boolean;
  orderBy?: { column: string; ascending?: boolean };
} = {}): Promise<Product[]> {
  let query = supabase
    .from("products_public")
    .select("id, name, images, pre_discount_price, price, in_stock, on_sale")
    // .select("*")
    .range(offset, offset + limit - 1);

  if (featured !== undefined) query = query.eq("featured", featured);
  if (category) query = query.eq("category", category);
  if (sub_category) query = query.eq("sub_category", sub_category);
  if (in_stock !== undefined) query = query.eq("in_stock", in_stock);
  if (on_sale !== undefined) query = query.eq("on_sale", on_sale);

  if (orderBy)
    query = query.order(orderBy.column, {
      ascending: orderBy.ascending ?? false,
    });

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data ?? [];
}

// Fetch a single product by ID
export async function getProductById(
  id: string | undefined
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products_public")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error loading order products", error);
    return null;
  }

  return data ?? [];
}

export async function getProductsByIds(
  ids: string[]
): Promise<Record<string, Product>> {
  if (!ids.length) return {};

  const { data, error } = await supabase
    .from("products_public")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("Error loading order products", error);
    return {};
  }

  const map: Record<string, Product> = {};
  data?.forEach((p) => {
    map[p.id] = {
      id: p.id,
      name: p.name,
      description: p.description,
      images: p.images || [],
      category: p.category,
      sub_category: p.sub_category,
      pre_discount_price: Number(p.pre_discount_price),
      price: Number(p.price),
      featured: p.featured,
      in_stock: p.in_stock,
      on_sale: p.on_sale,
      sold_count: p.sold_count,
      added_date: p.added_date,
    };
  });

  return map;
}

// Search products by keyword
export async function searchProducts(
  keyword: string,
  limit = 12
): Promise<Product[]> {
  if (!keyword.trim()) return [];

  const { data, error } = await supabase
    .from("products_public")
    .select("id, name, images, pre_discount_price, price")
    .or(
      `name.ilike.%${keyword}%,description.ilike.%${keyword}%,category.ilike.%${keyword}%,sub_category.ilike.%${keyword}%`
    )
    .order("added_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error searching products:", error);
    return [];
  }

  return data ?? [];
}
