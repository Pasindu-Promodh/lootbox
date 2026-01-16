export interface Cart {
  id: string;
  name: string;
  pre_discount_price: number; 
  price: number;
  quantity: number;
  image?: string;
}

export interface CartStorageItem {
  id: string;
  quantity: number;
}