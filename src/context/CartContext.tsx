import React, { createContext, useContext, useState, useEffect } from "react";
import { useNotification } from "./NotificationContext";
import { getProductById } from "../data/fetchProducts";
import type { Product } from "../data/products";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (id: number, quantity?: number) => Promise<void>;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  total: number;
  shipping: number;
  totalCart: number;
  lastAddedCart: CartItem | null;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [lastAddedCart, setLastAddedCart] = useState<CartItem | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = async (id: number, quantity: number = 1) => {
    try {
      const product: Product | null = await getProductById(String(id));

      if (!product) {
        showNotification("Product not found!", "error");
        return;
      }

      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        quantity,
      };

      const existing = cart.find((i) => i.id === id);

      if (existing) {
        setCart((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + quantity } : i
          )
        );
        showNotification("Quantity updated!", "info");
      } else {
        setCart((prev) => [...prev, newItem]);
        showNotification(`${product.name} added to cart!`, "success");
      }

      setLastAddedCart(newItem);
    } catch (err) {
      console.error("Error adding product to cart:", err);
      showNotification("Failed to add product to cart", "error");
    }
  };

  const removeFromCart = (id: number) => {
    const item = cart.find((i) => i.id === id);
    setCart((prev) => prev.filter((i) => i.id !== id));

    if (item) {
      showNotification(`${item.name} removed from cart`, "error");
    }
  };

  const updateQty = (id: number, qty: number) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }

    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
    showNotification("Quantity updated!", "info");
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = cart.length > 0 ? 350 : 0;
  const totalCart = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
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
