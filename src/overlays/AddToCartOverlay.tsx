import React, { useEffect, useState } from "react";
import { Box, Grow } from "@mui/material";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishListContext";

const AddToCartOverlay: React.FC = () => {
  const { lastAddedCart } = useCart(); // store the last added product in context
  const { lastAddedWishList } = useWishList();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (lastAddedCart || lastAddedWishList) {
      setShow(true);
      console.log(lastAddedCart);
      console.log(lastAddedWishList);
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastAddedCart, lastAddedWishList]);

  if (!show) return null;

  return (
    <Grow in={show}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 1400,
        }}
      >
        <Box
          sx={{
            bgcolor: "success.light",
            color: "white",
            px: 4,
            py: 2,
            borderRadius: 3,
            boxShadow: 5,
            textAlign: "center",
            fontSize: { xs: 20, md: 28 },
          }}
        >
          {lastAddedCart
            ? "Added to cart successfully!"
            : lastAddedWishList
            ? "Added to wishlist successfully!"
            : "Action completed!"}
        </Box>
      </Box>
    </Grow>
  );
};

export default AddToCartOverlay;
