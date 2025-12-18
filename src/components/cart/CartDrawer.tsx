import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCart } from "../../context/CartContext";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onClickProduct: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose, onClickProduct }) => {
  const { cart, total, shipping } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Calculate original total (before discount)
  const originalTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Discount = originalTotal - discounted total
  const discountTotal = originalTotal - total;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100vw" : 400,
          maxWidth: "100vw",
        },
      }}
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
          cart.map((item) => <CartItem key={item.id} item={item}  onClose={onClose} onClickProduct={onClickProduct} />)
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
          {/* Original Total */}
          <Typography
            variant="body2"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Subtotal</span>
            <span>Rs {originalTotal.toLocaleString()}</span>
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
              <span>- Rs {discountTotal.toLocaleString()}</span>
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
            <span>Discounted Subtotal</span>
            <span>Rs {total.toLocaleString()}</span>
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
            <span>Rs {shipping.toLocaleString()}</span>
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
            <span>Rs {(total + shipping).toLocaleString()}</span>
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              onClose();
              navigate("/checkout");
            }}
          >
            Checkout
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default CartDrawer;
