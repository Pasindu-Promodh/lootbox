// Navbar.tsx
import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";
import ProductSearch from "./ProductSearch";
import { useTheme, useMediaQuery } from "@mui/material";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const menuIcons = [
    { icon: <HomeIcon />, onClick: () => navigate("/") },
    { icon: <StorefrontIcon />, onClick: () => navigate("/shop") },
    { icon: <ShoppingCartIcon />, onClick: () => alert("Cart clicked") },
    { icon: <PersonIcon />, onClick: () => alert("Login clicked") },
  ];

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            sx={{ cursor: "pointer", fontWeight: 700 }}
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
              {menuIcons.map((item, idx) => (
                <IconButton key={idx} color="inherit" onClick={item.onClick}>
                  {item.icon}
                </IconButton>
              ))}
            </Box>
          )}

          {/* Mobile */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Search Icon */}
              <IconButton
                color="inherit"
                onClick={() => setMobileSearchOpen(true)}
              >
                <SearchIcon />
              </IconButton>
              {menuIcons.map((item, idx) => (
                <IconButton key={idx} color="inherit" onClick={item.onClick}>
                  {item.icon}
                </IconButton>
              ))}

              {mobileSearchOpen && (
                <ProductSearch
                  isMobile
                  openFullScreen={mobileSearchOpen}
                  onCloseFullScreen={() => setMobileSearchOpen(false)}
                />
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
