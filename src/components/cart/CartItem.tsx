import React from "react";
import {
  Box,
  Typography,
  IconButton,
  CardMedia,
  Tooltip,
  Skeleton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "../../context/CartContext";
import type { Cart } from "../../types/cart";

interface Props {
  item: Cart;
  onClose?: () => void;
  onClickProduct: (id: string) => void;
}

const CartItem: React.FC<Props> = ({ item, onClose, onClickProduct }) => {
  const { removeFromCart } = useCart();

  // const handleIncrease = () => updateQty(item.id, item.quantity + 1);
  // const handleDecrease = () =>
  //   updateQty(item.id, Math.max(item.quantity - 1, 1));

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
        onClickProduct(item?.id);
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: 1,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {item?.image ? (
          <CardMedia
            component="img"
            src={item?.image}
            alt={item?.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ width: "100%", height: "100%" }}
          />
        )}
      </Box>

      {/* <Box sx={{ flex: 1 }}> */}
      {/* <Box sx={{ flexGrow: 1,py: 0.5, display: "flex", flexDirection: "column", justifyContent: "space-between", height: 80 }}> */}
      <Box
        sx={{
          flexGrow: 1,
          py: 0.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 80,
          overflow: "hidden",
        }}
      >
        <Tooltip title={item?.name}>
          <Typography
            variant="body2"
            fontWeight={500}
            // noWrap
            // sx={{ fontSize: "0.9rem", maxWidth: checkoutMode ? (isDesktop ? "10vw" : "40vw") : isDesktop ? "10vw" : "50vw" }}
            // sx={{ fontSize: "0.9rem"}}
            sx={{
              fontSize: "0.9rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item?.name}
          </Typography>
        </Tooltip>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ fontSize: "1rem", color: "primary.main" }}
          >
            Rs {item?.price}
          </Typography>

          {item?.pre_discount_price > item?.price && (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: "line-through", fontSize: "0.75rem" }}
              >
                Rs {item?.pre_discount_price}
              </Typography>
              <Typography
                variant="body2"
                color="error"
                fontWeight={600}
                sx={{ fontSize: "0.8rem" }}
              >
                {Math.round(
                  ((item?.pre_discount_price - item?.price) /
                    item?.pre_discount_price) *
                    100,
                )}
                % OFF
              </Typography>
            </>
          )}
          {/* {item.discount != 0 && (
            <Typography
              variant="body2"
              color="error"
              fontWeight={600}
              sx={{ fontSize: "0.8rem" }}
            >
              {item.discount}% OFF
            </Typography>
          )} */}
        </Box>

        {/* <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
        </Box> */}
      </Box>

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          removeFromCart(item?.id);
        }}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default CartItem;
