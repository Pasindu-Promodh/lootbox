// // Navbar.tsx
// import React, { useState } from "react";
// import { AppBar, Toolbar, IconButton, Box, Badge } from "@mui/material";
// import HomeIcon from "@mui/icons-material/Home";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import SearchIcon from "@mui/icons-material/Search";
// import PersonIcon from "@mui/icons-material/Person";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import { useNavigate } from "react-router-dom";
// import ProductSearch from "./ProductSearch";
// import { useTheme, useMediaQuery } from "@mui/material";
// import CartDrawer from "./CartDrawer";
// import { useCart } from "../context/CartContext";
// import WishListDrawer from "./WishListDrawer";
// import { useWishList } from "../context/WishListContext";

// const Navbar: React.FC = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const { totalCart } = useCart();
//   const { totalWishList } = useWishList();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
//   const [cartOpen, setCartOpen] = useState(false);
//   const [wishListOpen, setWishListOpen] = useState(false);

//   const menuIcons = [
//     { icon: <HomeIcon />, onClick: () => navigate("/"), count: 0 },
//     { icon: <StorefrontIcon />, onClick: () => navigate("/shop"), count: 0 },
//     {
//       icon: <ShoppingCartIcon />,
//       onClick: () => setCartOpen(true),
//       count: totalCart,
//     },
//     {
//       icon: <FavoriteIcon />,
//       onClick: () => setWishListOpen(true),
//       count: totalWishList,
//     },
//     { icon: <PersonIcon />, onClick: () => alert("Login clicked"), count: 0 },
//   ];

//   return (
//     <>
//       <AppBar position="sticky">
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           {/* Logo */}
//           <Box
//             sx={{ cursor: "pointer", fontWeight: 700 }}
//             onClick={() => navigate("/")}
//           >
//             LootBox
//           </Box>

//           {/* Desktop */}
//           {!isMobile && (
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 2,
//                 flexGrow: 1,
//                 justifyContent: "flex-end",
//               }}
//             >
//               <ProductSearch width={400} />
//               {menuIcons.map((item, idx) => (
//                 <IconButton key={idx} color="inherit" onClick={item.onClick}>
//                   <Badge badgeContent={item.count} color="secondary">
//                     {item.icon}
//                   </Badge>
//                 </IconButton>
//               ))}
//             </Box>
//           )}

//           {/* Mobile */}
//           {isMobile && (
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               {/* Search Icon */}
//               <IconButton
//                 color="inherit"
//                 onClick={() => setMobileSearchOpen(true)}
//               >
//                 <SearchIcon />
//               </IconButton>
//               {menuIcons.map((item, idx) => (
//                 <IconButton key={idx} color="inherit" onClick={item.onClick}>
//                   <Badge badgeContent={item.count} color="secondary">
//                     {item.icon}
//                   </Badge>
//                 </IconButton>
//               ))}

//               {mobileSearchOpen && (
//                 <ProductSearch
//                   isMobile
//                   openFullScreen={mobileSearchOpen}
//                   onCloseFullScreen={() => setMobileSearchOpen(false)}
//                 />
//               )}
//             </Box>
//           )}
//         </Toolbar>
//       </AppBar>
//       {/* CART SIDE PANEL */}
//       <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

//       {/* WISHLIST SIDE PANEL */}
//       <WishListDrawer
//         open={wishListOpen}
//         onClose={() => setWishListOpen(false)}
//       />
//     </>
//   );
// };

// export default Navbar;






// import React, { useEffect, useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Box,
//   Badge,
//   Avatar,
//   Menu,
//   MenuItem,
//   Divider,
// } from "@mui/material";

// import HomeIcon from "@mui/icons-material/Home";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import SearchIcon from "@mui/icons-material/Search";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import PersonIcon from "@mui/icons-material/Person";

// import { useNavigate } from "react-router-dom";
// import { useTheme, useMediaQuery } from "@mui/material";

// import ProductSearch from "./ProductSearch";
// import CartDrawer from "./CartDrawer";
// import WishListDrawer from "./WishListDrawer";

// import { useCart } from "../context/CartContext";
// import { useWishList } from "../context/WishListContext";

// import { supabase } from "../supabase";

// const Navbar: React.FC = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();

//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const { totalCart } = useCart();
//   const { totalWishList } = useWishList();

//   const [cartOpen, setCartOpen] = useState(false);
//   const [wishListOpen, setWishListOpen] = useState(false);
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

//   const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

//   const [session, setSession] = useState<any>(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => setSession(data.session));
//     supabase.auth.onAuthStateChange((_event, session) => setSession(session));
//   }, []);

//   const profileImage = session?.user?.user_metadata?.avatar_url;

//   const handleLogin = async () => {
//     await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: window.location.origin,
//       },
//     });
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     setMenuAnchor(null);
//   };

//   return (
//     <>
//       <AppBar position="sticky">
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           {/* Logo */}
//           <Box
//             sx={{ cursor: "pointer", fontWeight: 700 }}
//             onClick={() => navigate("/")}
//           >
//             LootBox
//           </Box>

//           {/* Desktop */}
//           {!isMobile && (
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 2,
//                 flexGrow: 1,
//                 justifyContent: "flex-end",
//               }}
//             >
//               <ProductSearch width={400} />

//               {/* Home */}
//               <IconButton onClick={() => navigate("/")}>
//                 <HomeIcon />
//               </IconButton>

//               {/* Shop */}
//               <IconButton onClick={() => navigate("/shop")}>
//                 <StorefrontIcon />
//               </IconButton>

//               {/* Cart */}
//               <IconButton onClick={() => setCartOpen(true)}>
//                 <Badge badgeContent={totalCart} color="secondary">
//                   <ShoppingCartIcon />
//                 </Badge>
//               </IconButton>

//               {/* Wishlist */}
//               <IconButton onClick={() => setWishListOpen(true)}>
//                 <Badge badgeContent={totalWishList} color="secondary">
//                   <FavoriteIcon />
//                 </Badge>
//               </IconButton>

//               {/* Login / Profile */}
//               {session ? (
//                 <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
//                   <Avatar src={profileImage} sx={{ width: 32, height: 32 }} />
//                 </IconButton>
//               ) : (
//                 <IconButton onClick={handleLogin}>
//                   <PersonIcon />
//                 </IconButton>
//               )}
//             </Box>
//           )}

//           {/* Mobile */}
//           {isMobile && (
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <IconButton onClick={() => setMobileSearchOpen(true)}>
//                 <SearchIcon />
//               </IconButton>

//               <IconButton onClick={() => navigate("/")}>
//                 <HomeIcon />
//               </IconButton>

//               <IconButton onClick={() => navigate("/shop")}>
//                 <StorefrontIcon />
//               </IconButton>

//               <IconButton onClick={() => setCartOpen(true)}>
//                 <Badge badgeContent={totalCart} color="secondary">
//                   <ShoppingCartIcon />
//                 </Badge>
//               </IconButton>

//               <IconButton onClick={() => setWishListOpen(true)}>
//                 <Badge badgeContent={totalWishList} color="secondary">
//                   <FavoriteIcon />
//                 </Badge>
//               </IconButton>

//               {session ? (
//                 <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
//                   <Avatar src={profileImage} sx={{ width: 32, height: 32 }} />
//                 </IconButton>
//               ) : (
//                 <IconButton onClick={handleLogin}>
//                   <PersonIcon />
//                 </IconButton>
//               )}

//               {mobileSearchOpen && (
//                 <ProductSearch
//                   isMobile
//                   openFullScreen
//                   onCloseFullScreen={() => setMobileSearchOpen(false)}
//                 />
//               )}
//             </Box>
//           )}
//         </Toolbar>
//       </AppBar>

//       {/* Profile Menu */}
//       <Menu
//         anchorEl={menuAnchor}
//         open={Boolean(menuAnchor)}
//         onClose={() => setMenuAnchor(null)}
//       >
//         <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
//         <Divider />
//         <MenuItem onClick={handleLogout}>Logout</MenuItem>
//       </Menu>

//       {/* Drawers */}
//       <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
//       <WishListDrawer
//         open={wishListOpen}
//         onClose={() => setWishListOpen(false)}
//       />
//     </>
//   );
// };

// export default Navbar;





// import React, { useEffect, useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Box,
//   Badge,
//   Avatar,
//   Menu,
//   MenuItem,
//   Divider,
//   CircularProgress,
// } from "@mui/material";

// import HomeIcon from "@mui/icons-material/Home";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import SearchIcon from "@mui/icons-material/Search";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import PersonIcon from "@mui/icons-material/Person";

// import { useNavigate } from "react-router-dom";
// import { useTheme, useMediaQuery } from "@mui/material";

// import ProductSearch from "./ProductSearch";
// import CartDrawer from "./CartDrawer";
// import WishListDrawer from "./WishListDrawer";

// import { useCart } from "../context/CartContext";
// import { useWishList } from "../context/WishListContext";

// import { supabase } from "../supabase";
// import type { Session } from "@supabase/supabase-js";

// const Navbar: React.FC = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();

//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const { totalCart } = useCart();
//   const { totalWishList } = useWishList();

//   const [cartOpen, setCartOpen] = useState(false);
//   const [wishListOpen, setWishListOpen] = useState(false);
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

//   const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Get initial session
//     supabase.auth.getSession().then(({ data }) => {
//       setSession(data.session);
//       setLoading(false);
//     });

//     // Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const profileImage = session?.user?.user_metadata?.avatar_url;
//   const userName = session?.user?.user_metadata?.full_name || session?.user?.email;

//   const handleLogin = async () => {
//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: `${window.location.origin}/`,
//           queryParams: {
//             access_type: 'offline',
//             prompt: 'consent',
//           },
//         },
//       });

//       if (error) {
//         console.error("Login error:", error.message);
//         alert("Login failed: " + error.message);
//       }
//     } catch (err) {
//       console.error("Unexpected error during login:", err);
//       alert("An unexpected error occurred during login");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) {
//         console.error("Logout error:", error.message);
//       }
//       setMenuAnchor(null);
//       navigate("/");
//     } catch (err) {
//       console.error("Unexpected error during logout:", err);
//     }
//   };

//   const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
//     setMenuAnchor(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//   };

//   const handleProfileNavigate = () => {
//     navigate("/profile");
//     handleMenuClose();
//   };

//   return (
//     <>
//       <AppBar position="sticky">
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           {/* Logo */}
//           <Box
//             sx={{ 
//               cursor: "pointer", 
//               fontWeight: 700, 
//               fontSize: "1.5rem",
//               userSelect: "none"
//             }}
//             onClick={() => navigate("/")}
//           >
//             LootBox
//           </Box>

//           {/* Desktop */}
//           {!isMobile && (
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 2,
//                 flexGrow: 1,
//                 justifyContent: "flex-end",
//               }}
//             >
//               <ProductSearch width={400} />

//               {/* Home */}
//               <IconButton 
//                 color="inherit" 
//                 onClick={() => navigate("/")}
//                 aria-label="home"
//               >
//                 <HomeIcon />
//               </IconButton>

//               {/* Shop */}
//               <IconButton 
//                 color="inherit" 
//                 onClick={() => navigate("/shop")}
//                 aria-label="shop"
//               >
//                 <StorefrontIcon />
//               </IconButton>

//               {/* Cart */}
//               <IconButton 
//                 color="inherit" 
//                 onClick={() => setCartOpen(true)}
//                 aria-label="cart"
//               >
//                 <Badge badgeContent={totalCart} color="secondary">
//                   <ShoppingCartIcon />
//                 </Badge>
//               </IconButton>

//               {/* Wishlist */}
//               <IconButton 
//                 color="inherit" 
//                 onClick={() => setWishListOpen(true)}
//                 aria-label="wishlist"
//               >
//                 <Badge badgeContent={totalWishList} color="secondary">
//                   <FavoriteIcon />
//                 </Badge>
//               </IconButton>

//               {/* Login / Profile */}
//               {loading ? (
//                 <CircularProgress size={24} color="inherit" />
//               ) : session ? (
//                 <IconButton 
//                   color="inherit" 
//                   onClick={handleProfileClick}
//                   aria-label="profile"
//                 >
//                   <Avatar 
//                     src={profileImage} 
//                     alt={userName}
//                     sx={{ width: 32, height: 32 }}
//                   >
//                     {!profileImage && userName?.charAt(0).toUpperCase()}
//                   </Avatar>
//                 </IconButton>
//               ) : (
//                 <IconButton 
//                   color="inherit" 
//                   onClick={handleLogin}
//                   aria-label="login"
//                 >
//                   <PersonIcon />
//                 </IconButton>
//               )}
//             </Box>
//           )}

//           {/* Mobile */}
//           {isMobile && (
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <IconButton 
//                 color="inherit" 
//                 onClick={() => setMobileSearchOpen(true)}
//                 aria-label="search"
//               >
//                 <SearchIcon />
//               </IconButton>

//               <IconButton 
//                 color="inherit" 
//                 onClick={() => navigate("/")}
//                 aria-label="home"
//               >
//                 <HomeIcon />
//               </IconButton>

//               <IconButton 
//                 color="inherit" 
//                 onClick={() => navigate("/shop")}
//                 aria-label="shop"
//               >
//                 <StorefrontIcon />
//               </IconButton>

//               <IconButton 
//                 color="inherit" 
//                 onClick={() => setCartOpen(true)}
//                 aria-label="cart"
//               >
//                 <Badge badgeContent={totalCart} color="secondary">
//                   <ShoppingCartIcon />
//                 </Badge>
//               </IconButton>

//               <IconButton 
//                 color="inherit" 
//                 onClick={() => setWishListOpen(true)}
//                 aria-label="wishlist"
//               >
//                 <Badge badgeContent={totalWishList} color="secondary">
//                   <FavoriteIcon />
//                 </Badge>
//               </IconButton>

//               {loading ? (
//                 <CircularProgress size={24} color="inherit" />
//               ) : session ? (
//                 <IconButton 
//                   color="inherit" 
//                   onClick={handleProfileClick}
//                   aria-label="profile"
//                 >
//                   <Avatar 
//                     src={profileImage} 
//                     alt={userName}
//                     sx={{ width: 32, height: 32 }}
//                   >
//                     {!profileImage && userName?.charAt(0).toUpperCase()}
//                   </Avatar>
//                 </IconButton>
//               ) : (
//                 <IconButton 
//                   color="inherit" 
//                   onClick={handleLogin}
//                   aria-label="login"
//                 >
//                   <PersonIcon />
//                 </IconButton>
//               )}

//               {mobileSearchOpen && (
//                 <ProductSearch
//                   isMobile
//                   openFullScreen
//                   onCloseFullScreen={() => setMobileSearchOpen(false)}
//                 />
//               )}
//             </Box>
//           )}
//         </Toolbar>
//       </AppBar>

//       {/* Profile Menu */}
//       <Menu
//         anchorEl={menuAnchor}
//         open={Boolean(menuAnchor)}
//         onClose={handleMenuClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <MenuItem disabled sx={{ opacity: 1 }}>
//           <Box>
//             <Box sx={{ fontWeight: 600 }}>{userName}</Box>
//             <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
//               {session?.user?.email}
//             </Box>
//           </Box>
//         </MenuItem>
//         <Divider />
//         <MenuItem onClick={handleProfileNavigate}>Profile</MenuItem>
//         <MenuItem onClick={() => { navigate("/orders"); handleMenuClose(); }}>
//           My Orders
//         </MenuItem>
//         <Divider />
//         <MenuItem onClick={handleLogout}>Logout</MenuItem>
//       </Menu>

//       {/* Drawers */}
//       <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
//       <WishListDrawer
//         open={wishListOpen}
//         onClose={() => setWishListOpen(false)}
//       />
//     </>
//   );
// };

// export default Navbar;



import React, { useEffect, useState } from "react";
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

import { supabase } from "../supabase";
import type { Session } from "@supabase/supabase-js";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { totalCart } = useCart();
  const { totalWishList } = useWishList();

  const [cartOpen, setCartOpen] = useState(false);
  const [wishListOpen, setWishListOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const profileImage = session?.user?.user_metadata?.avatar_url;
  const userName = session?.user?.user_metadata?.full_name || session?.user?.email;

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `https://pasindu-promodh.github.io/lootbox/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error("Login error:", error.message);
        alert("Login failed: " + error.message);
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      alert("An unexpected error occurred during login");
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
      }
      setMenuAnchor(null);
      navigate("/");
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

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

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            sx={{ 
              cursor: "pointer", 
              fontWeight: 700, 
              fontSize: "1.5rem",
              userSelect: "none"
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
                <IconButton 
                  color="inherit" 
                  onClick={handleLogin}
                  aria-label="login"
                >
                  <PersonIcon />
                </IconButton>
              )}
            </Box>
          )}

          {/* Mobile */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                <IconButton 
                  color="inherit" 
                  onClick={handleLogin}
                  aria-label="login"
                >
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
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled sx={{ opacity: 1 }}>
          <Box>
            <Box sx={{ fontWeight: 600 }}>{userName}</Box>
            <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              {session?.user?.email}
            </Box>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileNavigate}>Profile</MenuItem>
        <MenuItem onClick={() => { navigate("/orders"); handleMenuClose(); }}>
          My Orders
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* Drawers */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <WishListDrawer
        open={wishListOpen}
        onClose={() => setWishListOpen(false)}
      />
    </>
  );
};

export default Navbar;
