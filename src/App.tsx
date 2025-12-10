import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import AddToCartOverlay from "./overlays/AddToCartOverlay";

const App: React.FC = () => {
  return (
    <CartProvider>
      <AddToCartOverlay />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
