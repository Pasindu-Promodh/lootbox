import React, { createContext, useContext, useState, useEffect } from "react";
import { type Product } from "../data/products";
import { useNotification } from "./NotificationContext";
import { getProductById } from "../data/fetchProducts";

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
  isInWishList: (id: number) => boolean;
  totalWishList: number;
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

  const { showNotification } = useNotification();

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  const addToWishList = async (id: number) => {
    try {
      const product: Product | null = await getProductById(String(id));

      if (!product) {
        showNotification("Product not found!", "error");
        return;
      }

      const newItem: WishListItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
      };

      const existing = wishList.find((i) => i.id === id);

      if (existing) {
        showNotification("Already in wishlist!", "info");
        return;
      }
      setWishList((prev) => [...prev, newItem]);
      showNotification(`${product.name} added to wishlist!`, "success");
    } catch (err) {
      console.error("Error adding product to wishlist:", err);
      showNotification("Failed to add product to wishlist", "error");
    }
  };

  const removeFromWishList = (id: number) => {
    const item = wishList.find((i) => i.id === id);
    if (item) {
      showNotification(`${item.name} removed from wishlist`, "error");
    }
    setWishList((prev) => prev.filter((i) => i.id !== id));
  };

  const isInWishList = (id: number) => {
    return wishList.some((i) => i.id === id);
  };

  const totalWishList = wishList.length;

  return (
    <WishListContext.Provider
      value={{
        wishList,
        addToWishList,
        removeFromWishList,
        isInWishList,
        totalWishList,
      }}
    >
      {children}
    </WishListContext.Provider>
  );
};
