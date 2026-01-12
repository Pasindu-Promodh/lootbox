// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNotification } from "./NotificationContext";
// import { getProductById } from "../data/fetchProducts";
// import type { Product } from "../data/products";

// export interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   discount: number;
//   quantity: number;
//   image?: string;
// }

// interface CartContextType {
//   cart: CartItem[];
//   addToCart: (id: string, quantity?: number) => Promise<void>;
//   removeFromCart: (id: string) => void;
//   updateQty: (id: string, qty: number) => void;
//   clearCart: () => void;
//   total: number;
//   shipping: number;
//   totalCart: number;
//   lastAddedCart: CartItem | null;
// }

// const CartContext = createContext<CartContextType | null>(null);

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used within CartProvider");
//   return context;
// };

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [cart, setCart] = useState<CartItem[]>(() => {
//     const saved = localStorage.getItem("cart");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [lastAddedCart, setLastAddedCart] = useState<CartItem | null>(null);
//   const { showNotification } = useNotification();

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   // Add item to cart
//   const addToCart = async (id: string, quantity: number = 1) => {
//     try {
//       const product: Product | null = await getProductById(String(id));

//       if (!product) {
//         showNotification("Product not found!", "error");
//         return;
//       }

//       const newItem: CartItem = {
//         id: product.id,
//         name: product.name,
//         price: product.price,
//         discount: product.discount,
//         image: product.images[0]?.thumb,
//         quantity,
//       };

//       const existing = cart.find((i) => i.id === id);

//       if (existing) {
//         setCart((prev) =>
//           prev.map((i) =>
//             i.id === id ? { ...i, quantity: i.quantity + quantity } : i
//           )
//         );
//         showNotification("Quantity updated!", "info");
//       } else {
//         setCart((prev) => [...prev, newItem]);
//         showNotification(`${product.name} added to cart!`, "success");
//       }

//       setLastAddedCart(newItem);
//     } catch (err) {
//       console.error("Error adding product to cart:", err);
//       showNotification("Failed to add product to cart", "error");
//     }
//   };

//   const removeFromCart = (id: string) => {
//     const item = cart.find((i) => i.id === id);
//     setCart((prev) => prev.filter((i) => i.id !== id));

//     if (item) {
//       showNotification(`${item.name} removed from cart`, "error");
//     }
//   };

//   const updateQty = (id: string, qty: number) => {
//     if (qty < 1) {
//       removeFromCart(id);
//       return;
//     }

//     setCart((prev) =>
//       prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
//     );
//     showNotification("Quantity updated!", "info");
//   };

//   const clearCart = () => {
//     setCart([]);
//     setLastAddedCart(null);
//     //showNotification("Cart cleared!", "info");
//   };

//   const total = cart.reduce(
//     (sum, i) => sum + Math.round(i.price * (1 - i.discount / 100)) * i.quantity,
//     0
//   );

//   const shipping = cart.length > 0 ? 350 : 0;
//   const totalCart = cart.reduce((sum, i) => sum + i.quantity, 0);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         updateQty,
//         clearCart,
//         total,
//         shipping,
//         totalCart,
//         lastAddedCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNotification } from "./NotificationContext";
import { getProductById } from "../data/fetchProducts";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  image?: string;
}

interface CartStorageItem {
  id: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (id: string, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastAddedCart, setLastAddedCart] = useState<CartItem | null>(null);
  const { showNotification } = useNotification();

  // --- Load cart from localStorage and fetch fresh product data ---
  useEffect(() => {
    refreshCart();
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
    try {
      const product = await getProductById(id);
      if (!product) {
        showNotification("Product not found!", "error");
        return;
      }

      const existing = cart.find((i) => i.id === id);

      if (existing) {
        setCart((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + quantity } : i
          )
        );
        showNotification("Quantity updated!", "info");
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          discount: product.discount,
          image: product.images[0]?.thumb,
          quantity,
        };
        setCart((prev) => [...prev, newItem]);
        setLastAddedCart(newItem);
        showNotification(`${product.name} added to cart!`, "success");
      }
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

    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
    showNotification("Quantity updated!", "info");
  };

  // --- Clear cart ---
  const clearCart = () => {
    setCart([]);
    setLastAddedCart(null);
    // showNotification("Cart cleared!", "info");
  };

  // --- Refresh cart with latest product data ---
  const refreshCart = async () => {
    const saved = localStorage.getItem("cart");
    if (!saved) return;

    const savedItems: CartStorageItem[] = JSON.parse(saved);

    const refreshed = (
      await Promise.all(
        savedItems.map(async (item) => {
          const product = await getProductById(item.id);
          if (!product) return null;

          return {
            id: product.id,
            name: product.name,
            price: product.price,
            discount: product.discount,
            image: product.images[0]?.thumb,
            quantity: item.quantity,
          };
        })
      )
    ).filter(Boolean) as CartItem[];

    setCart(refreshed);
  };

  // --- Compute totals ---
  const total = cart.reduce(
    (sum, i) => sum + Math.round(i.price * (1 - i.discount / 100)) * i.quantity,
    0
  );
  const shipping = cart.length > 0 ? 350 : 0;
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
