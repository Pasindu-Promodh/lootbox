import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useWishList } from "../../context/WishListContext";
import WishListItem from "./WishListItem";

interface WishListDrawerProps {
  open: boolean;
  onClose: () => void;
  onClickProduct: (id: string) => void;
}

const WishListDrawer: React.FC<WishListDrawerProps> = ({
  open,
  onClose,
  onClickProduct,
}) => {
  const { wishList } = useWishList();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        <Typography variant="h6">Your WishList</Typography>
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
        {wishList.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            Your wishlist is empty
          </Typography>
        ) : (
          wishList.map((item) => (
            <WishListItem
              key={item.id}
              item={item}
              onClose={onClose}
              onClickProduct={onClickProduct}
            />
          ))
        )}
      </Box>

      <Divider />
    </Drawer>
  );
};

export default WishListDrawer;
