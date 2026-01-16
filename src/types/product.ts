export type ProductImage = {
  main: string;
  thumb: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  images: ProductImage[];
  category?: string;
  sub_category?: string;
  pre_discount_price: number;
  price: number;
  featured?: boolean;
  in_stock?: boolean;
  on_sale?: boolean;
  sold_count?: number;
  added_date?: string;
};