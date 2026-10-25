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
  // Tie-breaker so paged results (range) never repeat or skip rows.
  query = query.order("id", { ascending: true });

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
  if (!id) return null;

  const { data, error } = await supabase
    .from("products_public")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error loading product", error);
    return null;
  }

  return data;
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
  // The keyword is embedded in a PostgREST filter string, where , ( ) and
  // . are syntax and % _ * are wildcards — strip them so input can't add
  // filter conditions or break the query.
  const term = keyword.replace(/[,().%_*\\:"']/g, " ").trim();
  if (!term) return [];

  const { data, error } = await supabase
    .from("products_public")
    .select("id, name, images, pre_discount_price, price")
    .or(
      `name.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%,sub_category.ilike.%${term}%`
    )
    .order("added_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error searching products:", error);
    return [];
  }

  return data ?? [];
}
