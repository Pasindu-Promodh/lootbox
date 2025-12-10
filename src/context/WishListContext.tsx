import React, { createContext, useContext, useState, useEffect } from "react";
import { ALL_PRODUCTS } from "../data/products";

export interface WishListItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
}

interface WishListContextType {
  wishList: WishListItem[];
  addToWishList: (id: number) => void;
  removeFromWishList: (id: number) => void;
  totalWishList: number;
  lastAddedWishList: WishListItem | null;
}

const WishListContext = createContext<WishListContextType | null>(null);

export const useWishList = () => {
  const context = useContext(WishListContext);
  if (!context)
    throw new Error("useWishList must be used within WishListProvider");
  return context;
};

export const WishListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishList, setWishList] = useState<WishListItem[]>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [lastAddedWishList, setLastAddedWishList] =
    useState<WishListItem | null>(null);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  const addToWishList = (id: number) => {
    const product = ALL_PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    const existing = wishList.find((i) => i.id === id);
    if (existing) return; // ignore duplicates

    const newItem: WishListItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
    };

    setWishList((prev) => [...prev, newItem]);
    setLastAddedWishList(newItem);
  };

  const removeFromWishList = (id: number) =>
    setWishList((prev) => prev.filter((i) => i.id !== id));

  const totalWishList = wishList.length;

  return (
    <WishListContext.Provider
      value={{
        wishList,
        addToWishList,
        removeFromWishList,
        totalWishList,
        lastAddedWishList,
      }}
    >
      {children}
    </WishListContext.Provider>
  );
};
