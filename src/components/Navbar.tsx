import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";

import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";

import ProductSearch from "./ProductSearch";
import CartDrawer from "./CartDrawer";
import WishListDrawer from "./WishListDrawer";

import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishListContext";

import { useAuth } from "../AuthContext";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { session, loading, signIn, signOut } = useAuth();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { totalCart } = useCart();
  const { totalWishList } = useWishList();

  const [cartOpen, setCartOpen] = useState(false);
  const [wishListOpen, setWishListOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const profileImage = session?.user?.user_metadata?.avatar_url;
  const userName =
    session?.user?.user_metadata?.full_name || session?.user?.email;

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleProfileNavigate = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            sx={{
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "1.5rem",
              userSelect: "none",
            }}
            onClick={() => navigate("/")}
          >
            LootBox
          </Box>

          {/* Desktop */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexGrow: 1,
                justifyContent: "flex-end",
              }}
            >
              <ProductSearch width={400} />

              {/* Home */}
              <IconButton
                color="inherit"
                onClick={() => navigate("/")}
                aria-label="home"
              >
                <HomeIcon />
              </IconButton>

              {/* Shop */}
              <IconButton
                color="inherit"
                onClick={() => navigate("/shop")}
                aria-label="shop"
              >
                <StorefrontIcon />
              </IconButton>

              {/* Cart */}
              <IconButton
                color="inherit"
                onClick={() => setCartOpen(true)}
                aria-label="cart"
              >
                <Badge badgeContent={totalCart} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {/* Wishlist */}
              <IconButton
                color="inherit"
                onClick={() => setWishListOpen(true)}
                aria-label="wishlist"
              >
                <Badge badgeContent={totalWishList} color="secondary">
                  <FavoriteIcon />
                </Badge>
              </IconButton>

              {/* Login / Profile */}
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : session ? (
                <IconButton
                  color="inherit"
                  onClick={handleProfileClick}
                  aria-label="profile"
                >
                  <Avatar
                    src={profileImage}
                    alt={userName}
                    sx={{ width: 32, height: 32 }}
                  >
                    {!profileImage && userName?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              ) : (
                <IconButton color="inherit" onClick={signIn} aria-label="login">
                  <PersonIcon />
                </IconButton>
              )}
            </Box>
          )}

          {/* Mobile */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.1 }}>
              <IconButton
                color="inherit"
                onClick={() => setMobileSearchOpen(true)}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>

              <IconButton
                color="inherit"
                onClick={() => navigate("/")}
                aria-label="home"
              >
                <HomeIcon />
              </IconButton>

              <IconButton
                color="inherit"
                onClick={() => navigate("/shop")}
                aria-label="shop"
              >
                <StorefrontIcon />
              </IconButton>

              <IconButton
                color="inherit"
                onClick={() => setCartOpen(true)}
                aria-label="cart"
              >
                <Badge badgeContent={totalCart} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <IconButton
                color="inherit"
                onClick={() => setWishListOpen(true)}
                aria-label="wishlist"
              >
                <Badge badgeContent={totalWishList} color="secondary">
                  <FavoriteIcon />
                </Badge>
              </IconButton>

              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : session ? (
                <IconButton
                  color="inherit"
                  onClick={handleProfileClick}
                  aria-label="profile"
                >
                  <Avatar
                    src={profileImage}
                    alt={userName}
                    sx={{ width: 32, height: 32 }}
                  >
                    {!profileImage && userName?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              ) : (
                <IconButton color="inherit" onClick={signIn} aria-label="login">
                  <PersonIcon />
                </IconButton>
              )}

              {mobileSearchOpen && (
                <ProductSearch
                  isMobile
                  openFullScreen
                  onCloseFullScreen={() => setMobileSearchOpen(false)}
                />
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem disabled sx={{ opacity: 1 }}>
          <Box>
            <Box sx={{ fontWeight: 600 }}>{userName}</Box>
            <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
              {session?.user?.email}
            </Box>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileNavigate}>Profile</MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/orders");
            handleMenuClose();
          }}
        >
          My Orders
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            signOut();
            navigate("/");
            handleMenuClose();
          }}
        >
          Logout
        </MenuItem>
      </Menu>

      {/* Drawers */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onClickProduct={handleClickProduct}
      />
      <WishListDrawer
        open={wishListOpen}
        onClose={() => setWishListOpen(false)}
        onClickProduct={handleClickProduct}
      />
    </>
  );
};

export default Navbar;
