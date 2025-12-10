// src/data/products.ts

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number; // current price
  originalPrice?: number; // if present and > price, show discount
  images: string[];
  inStock: boolean;
  onSale: boolean;
  description: string;
  longDescription?: string;

  // ⭐ NEW FIELDS
  featured: boolean; // highlight on homepage
  soldCount: number; // number of units sold
  addedDate: string; // ISO date for sorting "new arrivals"
};

export const ALL_PRODUCTS: Product[] = Array.from({ length: 50 }).map(
  (_, i) => {
    const id = i + 1;

    const categories = ["Electronics", "Accessories", "Home"];
    const category = categories[i % 3];

    const basePrice = 10 + ((i * 7) % 90);

    const onSale = id % 5 === 0 || id % 7 === 0;
    const inStock = id % 4 !== 0;

    const originalPrice = onSale
      ? Math.round(basePrice * (1 + (i % 3) * 0.25 + 0.15))
      : undefined;

    const price = originalPrice ? Math.round(originalPrice * 0.75) : basePrice;

    const name = `${category} Item ${id}`;

    const images = Array.from({ length: 3 }).map(
      (_, idx) =>
        `https://placehold.co/400x300?text=${encodeURIComponent(
          name + " #" + (idx + 1)
        )}&bg=eee&fg=333`
    );

    const description = `This is a high-quality ${category.toLowerCase()} item named "${name}". It is ${
      inStock ? "available in stock" : "currently out of stock"
    } and ${
      onSale ? "on sale now!" : "priced at regular rate."
    } Perfect for everyday use and gifting.`;

    // ⭐ NEW FIELDS
    const featured = id % 6 === 0 || id % 9 === 0; //  roughly 20% featured
    const soldCount = Math.floor(Math.random() * 500) + 10; // between 10–510 units
    const addedDate = new Date(Date.now() - i * 86400000).toISOString(); // each item 1 day older

    return {
      id,
      name,
      category,
      price,
      originalPrice,
      images,
      inStock,
      onSale,
      description,
      featured,
      soldCount,
      addedDate,
    };
  }
);
