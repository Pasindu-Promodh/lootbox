export interface Cart {
  id: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  image?: string;
}

export interface CartStorageItem {
  id: string;
  quantity: number;
}