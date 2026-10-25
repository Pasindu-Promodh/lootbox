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
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories } from "../data/fetchCategories";
import type { Category } from "../types/category";

const shopUrl = (category: string, sub?: string) => {
  const params = new URLSearchParams({ category });
  if (sub) params.set("sub_category", sub);
  return `/shop?${params}`;
};

const linkSx = {
  color: "inherit",
  textDecoration: "none",
  cursor: "pointer",
  "&:hover, &:focus-visible": { color: "primary.main" },
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const ShopCategoryDrawer = ({ open, onClose }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch once, the first time the drawer opens.
  const needsCategories = open && categories.length === 0;
  useEffect(() => {
    if (!needsCategories) return;
    let cancelled = false;
    getCategories().then((data) => {
      if (!cancelled) setCategories(data);
    });
    return () => {
      cancelled = true;
    };
  }, [needsCategories]);

  return (
    <Drawer
      anchor="top"
      open={open}
      onClose={onClose}
    >
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
          <IconButton onClick={onClose} aria-label="Close categories">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Shop All */}
        <Box
          component={RouterLink}
          to="/shop"
          onClick={onClose}
          sx={{ ...linkSx, display: "block", px: 3, py: 2, fontWeight: 700 }}
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
          {categories.map((cat) => (
            <Box key={cat.name}>
              {/* Main category */}
              <Typography
                component={RouterLink}
                to={shopUrl(cat.name)}
                onClick={onClose}
                fontWeight={700}
                sx={{ ...linkSx, display: "block", mb: 1 }}
              >
                {cat.name}
              </Typography>

              {/* Sub categories */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                {cat.subs?.map((sub) => (
                  <Typography
                    key={sub}
                    component={RouterLink}
                    to={shopUrl(cat.name, sub)}
                    onClick={onClose}
                    sx={{ ...linkSx, fontSize: "0.9rem" }}
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
