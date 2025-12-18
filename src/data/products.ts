// src/data/products.ts

export type Product = {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  price: number;
  discount: number;
  featured: boolean;
  in_stock: boolean;
  on_sale: boolean;
  sold_count: number;
  added_date: string;
};

// export const ALL_PRODUCTS: Product[] = Array.from({ length: 50 }).map(
//   (_, i) => {
//     const id = i + 1;

//     const categories = ["Electronics", "Accessories", "Home"];
//     const category = categories[i % 3];

//     const basePrice = 10 + ((i * 7) % 90);

//     const onSale = id % 5 === 0 || id % 7 === 0;
//     const inStock = id % 4 !== 0;

//     const originalPrice = onSale
//       ? Math.round(basePrice * (1 + (i % 3) * 0.25 + 0.15))
//       : undefined;

//     const price = originalPrice ? Math.round(originalPrice * 0.75) : basePrice;

//     const name = `${category} Item ${id}`;

//     const images = Array.from({ length: 3 }).map(
//       (_, idx) =>
//         `https://placehold.co/400x300?text=${encodeURIComponent(
//           name + " #" + (idx + 1)
//         )}&bg=eee&fg=333`
//     );

//     const description = `This is a high-quality ${category.toLowerCase()} item named "${name}". It is ${
//       inStock ? "available in stock" : "currently out of stock"
//     } and ${
//       onSale ? "on sale now!" : "priced at regular rate."
//     } Perfect for everyday use and gifting.`;

//     // ⭐ NEW FIELDS
//     const featured = id % 6 === 0 || id % 9 === 0; //  roughly 20% featured
//     const sold_count = Math.floor(Math.random() * 500) + 10; // between 10–510 units
//     const added_date = new Date(Date.now() - i * 86400000).toISOString(); // each item 1 day older
// const discount = 0;
// const in_stock = true;
// const on_sale = true;

//     return {
//       id,
//   name,
//   description,
//   images,
//   category,
//   price,
//   discount,
//   featured,
//   in_stock,
//   on_sale,
//   sold_count,
//   added_date,
//     };
//   }
// );
