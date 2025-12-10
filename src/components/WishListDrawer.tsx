import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useWishList } from "../context/WishListContext";
import WishListItem from "./WishListItem";

interface WishListDrawerProps {
  open: boolean;
  onClose: () => void;
}

const WishListDrawer: React.FC<WishListDrawerProps> = ({ open, onClose }) => {
  const { wishList } = useWishList();

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
          wishList.map((item) => <WishListItem key={item.id} item={item} />)
        )}
      </Box>

      <Divider />

      
    </Drawer>
  );
};

export default WishListDrawer;
