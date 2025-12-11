// import { supabase } from "../supabase";
// import type { Product } from "./products";

// export async function getProducts(): Promise<Product[]> {
//   const { data, error } = await supabase
//     .from("products")
//     .select("*")
//     .order("addedDate", { ascending: false }); // newest first

//   if (error) {
//     console.error("Error loading products:", error);
//     return [];
//   }

//   // map DB → your Product type
//   return data.map((p) => ({
//     id: p.id,
//     name: p.name,
//     category: p.category,
//     price: Number(p.price),
//     originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
//     images: p.images || [],
//     inStock: p.inStock,
//     onSale: p.onSale,
//     description: p.description,
//     longDescription: p.longDescription,
//     featured: p.featured,
//     soldCount: p.soldCount,
//     addedDate: p.addedDate,
//   }));
// }


// src/data/getProducts.ts
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
  let query = supabase.from("products").select("*").range(offset, offset + limit - 1);

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
    category: p.category,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    images: p.images || [],
    inStock: p.inStock,
    onSale: p.onSale,
    description: p.description,
    longDescription: p.longDescription,
    featured: p.featured,
    soldCount: p.soldCount,
    addedDate: p.addedDate,
  }));
}

// Fetch products by category
export async function getProductsByCategory(
  category: string,
  limit?: number
): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("addedDate", { ascending: false });

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
    category: p.category,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    images: p.images || [],
    inStock: p.inStock,
    onSale: p.onSale,
    description: p.description,
    longDescription: p.longDescription,
    featured: p.featured,
    soldCount: p.soldCount,
    addedDate: p.addedDate,
  }));
}


// Fetch a single product by ID
export async function getProductById(id: string | undefined): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error loading product ${id}:`, error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    price: Number(data.price),
    originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
    images: data.images || [],
    inStock: data.inStock,
    onSale: data.onSale,
    description: data.description,
    longDescription: data.longDescription,
    featured: data.featured,
    soldCount: data.soldCount,
    addedDate: data.addedDate,
  };
}
