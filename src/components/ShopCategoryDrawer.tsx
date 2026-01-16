import {
  Box,
  Drawer,
  Typography,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories } from "../data/fetchCategories";
import type { Category } from "../types/category";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ShopCategoryDrawer = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!open) return;

    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    if (categories.length === 0) {
      loadCategories();
    }
  }, [open]);

  const goShopAll = () => {
    navigate("/shop");
    onClose();
  };

  const goMain = (main: string) => {
    navigate(`/shop?category=${encodeURIComponent(main)}`);
    onClose();
  };

  const goSub = (main: string, sub: string) => {
    navigate(
      `/shop?category=${encodeURIComponent(
        main
      )}&sub_category=${encodeURIComponent(sub)}`
    );
    onClose();
  };

  return (
    <Drawer anchor="top" open={open} onClose={onClose}>
      <Box
        onMouseLeave={() => {
          if (!isMobile) onClose();
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Shop Categories</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Shop All */}
        <Box
          sx={{
            px: 3,
            py: 2,
            cursor: "pointer",
            fontWeight: 700,
            "&:hover": { color: "primary.main" },
          }}
          onClick={goShopAll}
        >
          Shop All
        </Box>

        <Divider />

        {/* Categories */}
        <Box
          sx={{
            px: 3,
            py: 3,
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr 1fr"
              : "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 4,
          }}
        >
          {categories.map((cat, i) => (
            <Box key={i}>
              {/* Main category */}
              <Typography
                fontWeight={700}
                sx={{
                  mb: 1,
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}
                onClick={() => goMain(cat.name)}
              >
                {cat.name}
              </Typography>

              {/* Sub categories */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                {cat.subs?.map((sub, i) => (
                  <Typography
                    key={i}
                    sx={{
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      "&:hover": { color: "primary.main" },
                    }}
                    onClick={() => goSub(cat.name, sub)}
                  >
                    {sub}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default ShopCategoryDrawer;
