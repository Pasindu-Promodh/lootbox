export interface WishList {
  id: string;
  name: string;
  pre_discount_price: number;
  price: number;
  image?: string;
}

export interface WishListStorageItem {
  id: string;
}