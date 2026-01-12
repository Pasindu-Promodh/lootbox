
// src/data/fetchProducts.ts
import { supabase } from "../supabase";
import type { Product } from "./products";

// Fetch products with optional filters, limits, and offset
export async function getProducts({
  limit = 12,
  offset = 0,
  featured,
  orderBy,
}: {
  limit?: number;
  offset?: number;
  featured?: boolean;
  orderBy?: { column: string; ascending?: boolean };
} = {}): Promise<Product[]> {
  let query = supabase.from("products_public").select("*").range(offset, offset + limit - 1);

  if (featured !== undefined) query = query.eq("featured", featured);

  if (orderBy) query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    images: p.images || [],
    category: p.category,
    price: Number(p.price),
    discount: Number(p.discount),
    featured: p.featured,
    in_stock: p.in_stock,
    on_sale: p.on_sale,
    sold_count: p.sold_count,
    added_date: p.added_date,
  }));
}

// Fetch products by category
export async function getProductsByCategory(
  category: string,
  limit?: number
): Promise<Product[]> {
  let query = supabase
    .from("products_public")
    .select("*")
    .eq("category", category)
    .order("added_date", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error loading products in category "${category}":`, error);
    return [];
  }

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    images: p.images || [],
    category: p.category,
    price: Number(p.price),
    discount: Number(p.discount),
    featured: p.featured,
    in_stock: p.in_stock,
    on_sale: p.on_sale,
    sold_count: p.sold_count,
    added_date: p.added_date,
  }));
}


// Fetch a single product by ID
export async function getProductById(id: string | undefined): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products_public")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    //console.error(`Error loading product ${id}:`, error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    images: data.images || [],
    category: data.category,
    price: Number(data.price),
    discount: Number(data.discount),
    featured: data.featured,
    in_stock: data.in_stock,
    on_sale: data.on_sale,
    sold_count: data.sold_count,
    added_date: data.added_date,
  };
}

// Lightweight product lookup for orders
export async function getProductsByIds(ids: string[]) {
  if (!ids.length) return {};

  const { data, error } = await supabase
    .from("products_public")
    .select("id, name, images")
    .in("id", ids);

  if (error) {
    console.error("Error loading order products", error);
    return {};
  }

  const map: Record<string, any> = {};
  data?.forEach((p) => {
    map[p.id] = p;
  });

  return map;
}

export async function searchProducts(
  keyword: string,
  limit = 12
): Promise<Product[]> {
  if (!keyword.trim()) return [];

  const { data, error } = await supabase
    .from("products_public")
    .select("*")
    .or(
      `name.ilike.%${keyword}%,description.ilike.%${keyword}%,category.ilike.%${keyword}%`
    )
    .order("added_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error searching products:", error);
    return [];
  }

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    images: p.images || [],
    category: p.category,
    price: Number(p.price),
    discount: Number(p.discount),
    featured: p.featured,
    in_stock: p.in_stock,
    on_sale: p.on_sale,
    sold_count: p.sold_count,
    added_date: p.added_date,
  }));
}
