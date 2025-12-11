import React from "react";
import { Box, Typography, IconButton, Button, CardMedia } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart, type CartItem as CartItemType } from "../context/CartContext";

interface Props {
  item: CartItemType;
  onClose?: () => void;
  onClickProduct: (id: number) => void;
}

const CartItem: React.FC<Props> = ({ item, onClose, onClickProduct }) => {
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
        borderRadius: 2,
        boxShadow: 1,
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.01)" },
      }}
      onClick={() => {
        onClose?.();
        onClickProduct(item.id);
      }}
    >
      {item.image && (
        <CardMedia
          component="img"
          src={item.image}
          alt={item.name}
          sx={{ width: 80, height: 80, borderRadius: 1, objectFit: "cover" }}
        />
      )}

      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body2"
          fontWeight={500}
          noWrap
          sx={{ fontSize: "0.9rem" }}
        >
          {item.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ fontSize: "1rem", color: "text.primary" }}
          >
            Rs {item.price}
          </Typography>

          {item.originalPrice && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through", fontSize: "0.75rem" }}
            >
              Rs {item.originalPrice}
            </Typography>
          )}
          {item.originalPrice && (
            <Typography
              variant="body2"
              color="error"
              fontWeight={600}
              sx={{ fontSize: "0.8rem" }}
            >
              {Math.round(
                ((item.originalPrice - item.price) / item.originalPrice) * 100
              )}
              % OFF
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDecrease();
            }}
            sx={{ minWidth: 32 }}
          >
            -
          </Button>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ fontSize: "0.9rem", color: "text.primary" }}
          >
            {item.quantity}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleIncrease();
            }}
            sx={{ minWidth: 32 }}
          >
            +
          </Button>

          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ fontSize: "1rem", color: "primary.main" }}
          >
            Rs {item.price * item.quantity}
          </Typography>
        </Box>
      </Box>

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          removeFromCart(item.id);
        }}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default CartItem;
