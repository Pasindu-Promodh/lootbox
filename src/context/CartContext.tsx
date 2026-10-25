import React, { createContext, useCallback, useContext, useState, useEffect } from "react";
import { useNotification } from "./NotificationContext";
import { getProductById, getProductsByIds } from "../data/fetchProducts";
import type { Cart, CartStorageItem } from "../types/cart";
import { MAX_CART_ITEMS, MAX_QTY_PER_ITEM, SHIPPING_FEE } from "../utils/checkout";

interface CartContextType {
  cart: Cart[];
  addToCart: (id: string, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  total: number;
  shipping: number;
  totalCart: number;
  lastAddedCart: Cart | null;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

function readSavedCart(): CartStorageItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem("cart") ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// Saved cart with fresh prices (one request for all items); null if empty.
async function loadSavedCart(): Promise<Cart[] | null> {
  const savedItems = readSavedCart();
  if (!savedItems.length) return null;

  const products = await getProductsByIds(savedItems.map((i) => i.id));

  return savedItems.flatMap((item) => {
    const product = products[item.id];
    if (!product) return [];
    return [
      {
        id: product.id,
        name: product.name,
        pre_discount_price: product.pre_discount_price,
        price: product.price,
        image: product.images[0]?.thumb,
        quantity: item.quantity,
      },
    ];
  });
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart[]>([]);
  const [lastAddedCart, setLastAddedCart] = useState<Cart | null>(null);
  const { showNotification } = useNotification();

  // --- Refresh cart with latest product data ---
  const refreshCart = useCallback(async () => {
    const saved = await loadSavedCart();
    if (saved) setCart(saved);
  }, []);

  // --- Load cart from localStorage and fetch fresh product data ---
  useEffect(() => {
    let cancelled = false;
    loadSavedCart().then((saved) => {
      if (!cancelled && saved) setCart(saved);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // --- Sync cart quantities (only ID + qty) to localStorage ---
  useEffect(() => {
    const storageData: CartStorageItem[] = cart.map((i) => ({
      id: i.id,
      quantity: i.quantity,
    }));
    localStorage.setItem("cart", JSON.stringify(storageData));
  }, [cart]);

  // --- Add item to cart ---
  const addToCart = async (id: string, quantity: number = 1) => {
    const existing = cart.find((i) => i.id === id);

    if (existing) {
      if (existing.quantity + quantity > MAX_QTY_PER_ITEM) {
        showNotification(`Maximum ${MAX_QTY_PER_ITEM} per item`, "error");
        return;
      }
      setCart((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + quantity } : i
        )
      );
      showNotification("Quantity updated!", "info");
      return;
    }

    if (cart.length >= MAX_CART_ITEMS) {
      showNotification(
        `You can order up to ${MAX_CART_ITEMS} product${MAX_CART_ITEMS > 1 ? "s" : ""} at a time`,
        "error"
      );
      return;
    }

    try {
      const product = await getProductById(id);
      if (!product) {
        showNotification("Product not found!", "error");
        return;
      }

      const newItem: Cart = {
        id: product.id,
        name: product.name,
        pre_discount_price: product.pre_discount_price,
        price: product.price,
        image: product.images[0]?.thumb,
        quantity,
      };
      setCart((prev) => [...prev, newItem]);
      setLastAddedCart(newItem);
      showNotification(`${product.name} added to cart!`, "success");
    } catch (err) {
      console.error("Error adding product to cart:", err);
      showNotification("Failed to add product to cart", "error");
    }
  };

  // --- Remove item from cart ---
  const removeFromCart = (id: string) => {
    const item = cart.find((i) => i.id === id);
    setCart((prev) => prev.filter((i) => i.id !== id));
    if (item) showNotification(`${item.name} removed from cart`, "error");
  };

  // --- Update item quantity ---
  const updateQty = (id: string, qty: number) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }
    qty = Math.min(qty, MAX_QTY_PER_ITEM);

    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
    showNotification("Quantity updated!", "info");
  };

  // --- Clear cart ---
  const clearCart = () => {
    setCart([]);
    setLastAddedCart(null);
  };

  // --- Compute totals ---
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = cart.length > 0 ? SHIPPING_FEE : 0;
  const totalCart = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        refreshCart,
        total,
        shipping,
        totalCart,
        lastAddedCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
