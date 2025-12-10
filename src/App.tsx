// import React from "react";
// import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import ShopPage from "./pages/ShopPage";
// import ProductPage from "./pages/ProductPage";
// import Navbar from "./components/Navbar";
// import { CartProvider } from "./context/CartContext";
// import AddToCartOverlay from "./overlays/AddToCartOverlay";
// import { WishListProvider } from "./context/WishListContext";
// import { AuthProvider } from "./AuthContext";
// import ProfilePage from "./pages/ProfilePage";

// const App: React.FC = () => {

//   return (
//     <AuthProvider>
//       <CartProvider>
//         <WishListProvider>
//           <AddToCartOverlay />
//           <Router>
//             <Navbar />
//             <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/shop" element={<ShopPage />} />
//               <Route path="/product/:id" element={<ProductPage />} />
//               <Route path="/auth/callback" element={<AuthCallback />} />
//               <Route path="/profile" element={<ProfilePage />} />

//             </Routes>
//           </Router>
//         </WishListProvider>
//       </CartProvider>
//     </AuthProvider>
//   );
// };

// export default App;

// import React from "react";
// import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import ShopPage from "./pages/ShopPage";
// import ProductPage from "./pages/ProductPage";
// import ProfilePage from "./pages/ProfilePage";
// import Navbar from "./components/Navbar";
// import { CartProvider } from "./context/CartContext";
// import AddToCartOverlay from "./overlays/AddToCartOverlay";
// import { WishListProvider } from "./context/WishListContext";
// import { AuthProvider } from "./AuthContext";

// const App: React.FC = () => {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <WishListProvider>
//           <AddToCartOverlay />
//           <Router>
//             <Navbar />
//             <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/shop" element={<ShopPage />} />
//               <Route path="/product/:id" element={<ProductPage />} />
//               <Route path="/profile" element={<ProfilePage />} />
//               {/* No need for /auth/callback route; Supabase handles redirect */}
//             </Routes>
//           </Router>
//         </WishListProvider>
//       </CartProvider>
//     </AuthProvider>
//   );
// };

// export default App;

import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/HomePage";
import Shop from "./pages/ShopPage";
import Profile from "./pages/ProfilePage";
import ProductPage from "./pages/ProductPage";

// Context Providers
import { CartProvider } from "./context/CartContext";
import { WishListProvider } from "./context/WishListContext";
import { AuthProvider } from "./AuthContext";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <WishListProvider>
            <HashRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/product/:id" element={<ProductPage />} />
              </Routes>
            </HashRouter>
          </WishListProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
