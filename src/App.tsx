import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from "./pages/HomePage";
import Shop from "./pages/ShopPage";
import Profile from "./pages/ProfilePage";
import ProductPage from "./pages/ProductPage";
import MyOrders from './pages/MyOrders';

// Context Providers
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';
import { WishListProvider } from './context/WishListContext';
import { AuthProvider } from './AuthContext';
import CheckoutPage from './pages/CheckoutPage';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* IMPORTANT: NotificationProvider must wrap everything */}
      <NotificationProvider>
        <AuthProvider>
        <CartProvider>
          <WishListProvider>
            <HashRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/product/:productId" element={<ProductPage />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/checkout" element={<CheckoutPage/>} />
              </Routes>
            </HashRouter>
          </WishListProvider>
        </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;