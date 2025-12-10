// import React, { createContext, useContext, useState, useEffect } from "react";

// export interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string;
// }

// interface CartContextType {
//   cart: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (id: number) => void;
//   updateQty: (id: number, qty: number) => void;
//   total: number;
//   shipping: number;
//   totalItems: number;
//   lastAddedItem: CartItem | null;
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
//     // Load cart from localStorage if available
//     const saved = localStorage.getItem("cart");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = (item: CartItem) => {
//     setCart((prev) => {
//       const existing = prev.find((i) => i.id === item.id);
//       if (existing) {
//         return prev.map((i) =>
//           i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
//         );
//       }
//       return [...prev, item];
//     });
//     setLastAddedItem(item);
//   };

//   //   const addToCart = (item: CartItem) => {
//   //     setCart((prev) => [...prev, item]);
//   //     setLastAddedItem(item);
//   //   };

//   const removeFromCart = (id: number) =>
//     setCart((prev) => prev.filter((i) => i.id !== id));
//   const updateQty = (id: number, qty: number) =>
//     setCart((prev) =>
//       prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
//     );

//   const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
//   const shipping = cart.length > 0 ? 350 : 0; // simple example

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         updateQty,
//         total,
//         shipping,
//         totalItems: cart.reduce((sum, i) => sum + i.quantity, 0),
//         lastAddedItem,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };



import React, { createContext, useContext, useState, useEffect } from "react";
import { ALL_PRODUCTS } from "../data/products"; // make sure this path is correct

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (id: number, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  total: number;
  shipping: number;
  totalItems: number;
  lastAddedItem: CartItem | null;
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

  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id: number, quantity: number = 1) => {
    const product = ALL_PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    };

    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, newItem];
    });

    setLastAddedItem(newItem);
  };

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id: number, qty: number) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = cart.length > 0 ? 350 : 0;
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        total,
        shipping,
        totalItems,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
