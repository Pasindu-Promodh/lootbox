import React from "react";
import { Box, Typography, IconButton, CardMedia } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useWishList } from "../../context/WishListContext";
import type { WishList } from "../../types/wishlist";

interface Props {
  item: WishList;
  onClose: () => void;
  onClickProduct: (id: string) => void;
}

const WishListItem: React.FC<Props> = ({ item, onClose, onClickProduct }) => {
  const { removeFromWishList } = useWishList();

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
        onClose();
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
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            // , mt: 0.3
          }}
        >
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ fontSize: "1rem", color: "primary.main" }}
          >
            Rs {item.price}
          </Typography>
          {item.pre_discount_price > item.price && (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: "line-through", fontSize: "0.75rem" }}
              >
                Rs {item.pre_discount_price}
              </Typography>

              <Typography
                variant="body2"
                color="error"
                fontWeight={600}
                sx={{ fontSize: "0.8rem" }}
              >
                {Math.round(
                  ((item.pre_discount_price - item.price) /
                    item.pre_discount_price) *
                    100
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
      </Box>

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          removeFromWishList(item.id);
        }}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default WishListItem;
