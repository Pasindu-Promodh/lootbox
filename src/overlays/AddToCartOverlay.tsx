import React, { useEffect, useState } from "react";
import { Box, Grow } from "@mui/material";
import { useCart } from "../context/CartContext";

const AddToCartOverlay: React.FC = () => {
  const { lastAddedItem } = useCart(); // store the last added product in context
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (lastAddedItem) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem]);

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
          Added to cart successfully!
        </Box>
      </Box>
    </Grow>
  );
};

export default AddToCartOverlay;
