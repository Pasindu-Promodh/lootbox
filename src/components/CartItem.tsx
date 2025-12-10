import React from "react";
import { Box, Typography, IconButton, Button, CardMedia } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart, type CartItem as CartItemType } from "../context/CartContext";

interface Props {
  item: CartItemType;
}

const CartItem: React.FC<Props> = ({ item }) => {
  const { removeFromCart, updateQty } = useCart();

  const handleIncrease = () => updateQty(item.id, item.quantity + 1);
  const handleDecrease = () =>
    updateQty(item.id, Math.max(item.quantity - 1, 1));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 2,
        p: 1.5,
        borderRadius: 2,
        boxShadow: 1,
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.01)" },
      }}
    >
      {item.image && (
        <CardMedia
          component="img"
          src={item.image}
          alt={item.name}
          sx={{ width: 70, height: 70, borderRadius: 1, objectFit: "cover" }}
        />
      )}

      <Box sx={{ flex: 1 }}>
        <Typography fontWeight={600} noWrap>
          {item.name}
        </Typography>
        <Typography color="text.secondary">
          Rs {item.price.toFixed(2)} x {item.quantity} = Rs{" "}
          {(item.price * item.quantity).toFixed(2)}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDecrease}
            sx={{ minWidth: 32 }}
          >
            -
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleIncrease}
            sx={{ minWidth: 32 }}
          >
            +
          </Button>
        </Box>
      </Box>

      <IconButton onClick={() => removeFromCart(item.id)} color="error">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default CartItem;
