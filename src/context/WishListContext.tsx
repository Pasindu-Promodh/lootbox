import React, { createContext, useContext, useState, useEffect } from "react";
import { useNotification } from "./NotificationContext";
import { getProductById } from "../data/fetchProducts";
import type { WishList, WishListStorageItem } from "../types/wishlist";

interface WishListContextType {
  wishList: WishList[];
  addToWishList: (id: string) => Promise<void>;
  removeFromWishList: (id: string) => void;
  isInWishList: (id: string) => boolean;
  totalWishList: number;
}

const WishListContext = createContext<WishListContextType | null>(null);

export const useWishList = () => {
  const context = useContext(WishListContext);
  if (!context)
    throw new Error("useWishList must be used within WishListProvider");
  return context;
};

export const WishListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishList, setWishList] = useState<WishList[]>([]);
  const { showNotification } = useNotification();

  // --- Load wishlist from localStorage and fetch fresh product data ---
  useEffect(() => {
    const loadWishList = async () => {
      const saved = localStorage.getItem("wishlist");
      if (!saved) return;

      const savedItems: WishListStorageItem[] = JSON.parse(saved);
      const products: WishList[] = [];

      for (const item of savedItems) {
        const product = await getProductById(item.id);
        if (product) {
          products.push({
            id: product.id,
            name: product.name,
            price: product.price,
            discount: product.discount,
            image: product.images[0]?.thumb,
          });
        }
      }

      setWishList(products);
    };

    loadWishList();
  }, []);

  // --- Sync wishlist IDs to localStorage ---
  useEffect(() => {
    const storageData: WishListStorageItem[] = wishList.map((i) => ({ id: i.id }));
    localStorage.setItem("wishlist", JSON.stringify(storageData));
  }, [wishList]);

  // --- Add product to wishlist ---
  const addToWishList = async (id: string) => {
    try {
      if (wishList.some((i) => i.id === id)) {
        showNotification("Already in wishlist!", "info");
        return;
      }

      const product = await getProductById(id);
      if (!product) {
        showNotification("Product not found!", "error");
        return;
      }

      const newItem: WishList = {
        id: product.id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        image: product.images[0]?.thumb,
      };

      setWishList((prev) => [...prev, newItem]);
      showNotification(`${product.name} added to wishlist!`, "success");
    } catch (err) {
      console.error("Error adding product to wishlist:", err);
      showNotification("Failed to add product to wishlist", "error");
    }
  };

  // --- Remove product from wishlist ---
  const removeFromWishList = (id: string) => {
    const item = wishList.find((i) => i.id === id);
    if (item) showNotification(`${item.name} removed from wishlist`, "error");
    setWishList((prev) => prev.filter((i) => i.id !== id));
  };

  // --- Check if product is in wishlist ---
  const isInWishList = (id: string) => wishList.some((i) => i.id === id);

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
