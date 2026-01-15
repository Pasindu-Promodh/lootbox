export interface WishList {
  id: string;
  name: string;
  price: number;
  discount: number;
  image?: string;
}

export interface WishListStorageItem {
  id: string;
}