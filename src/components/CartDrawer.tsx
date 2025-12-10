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
  const { cart, total, shipping } = useCart();

  // Calculate original total (before discount)
  const originalTotal = cart.reduce(
    (sum, item) => sum + (item.originalPrice ?? item.price) * item.quantity,
    0
  );

  // Discount = originalTotal - discounted total
  const discountTotal = originalTotal - total;

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
      {/* {cart.length > 0 && (
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
      )} */}

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
          {/* Original Total */}
          <Typography
            variant="body2"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Original Price</span>
            <span>Rs {originalTotal.toFixed(2)}</span>
          </Typography>

          {/* Discount */}
          {discountTotal > 0 && (
            <Typography
              variant="body2"
              color="error"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 600,
              }}
            >
              <span>Discount</span>
              <span>- Rs {discountTotal.toFixed(2)}</span>
            </Typography>
          )}

          {/* Price After Discount */}
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 500,
              mt: 1,
            }}
          >
            <span>Subtotal</span>
            <span>Rs {total.toFixed(2)}</span>
          </Typography>

          {/* Shipping */}
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <span>Shipping</span>
            <span>Rs {shipping.toFixed(2)}</span>
          </Typography>

          <Divider sx={{ my: 1 }} />

          {/* Final Total */}
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
            }}
          >
            <span>Total</span>
            <span>Rs {(total + shipping).toFixed(2)}</span>
          </Typography>

          <Button variant="contained" fullWidth sx={{ mt: 2 }}>
            Checkout
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default CartDrawer;
