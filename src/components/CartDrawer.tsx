import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { cart, total,shipping } = useCart();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 400 } }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Your Cart</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      {/* Cart Items */}
      <Box
        sx={{
          p: 2,
          flex: 1,
          overflowY: "auto",
          maxHeight: "calc(100vh - 160px)",
        }}
      >
        {cart.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            Your cart is empty
          </Typography>
        ) : (
          cart.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </Box>

      <Divider />

      {/* Footer */}
      {cart.length > 0 && (
        <Box
          sx={{
            p: 2,
            position: "sticky",
            bottom: 0,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Shipping: Rs {shipping.toFixed(2)}
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            Total: Rs {(total + shipping).toFixed(2)}
          </Typography>
          <Button variant="contained" fullWidth color="primary">
            Checkout
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default CartDrawer;
