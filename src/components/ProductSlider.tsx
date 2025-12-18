import React, { useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ProductCard from "./ProductCard";
import type { Product } from "../data/products";
import ProductCardSkeleton from "./ProductCardSkeleton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type Props = {
  products: Product[];
  onClickProduct: (id: string) => void;
  onAddToCart: (e: React.MouseEvent, id: string) => void;
  loading?: boolean;
  title: string;
};

const ProductSlider: React.FC<Props> = ({
  products,
  onClickProduct,
  onAddToCart,
  loading,
  title,
}) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const snapWidth = 360;

  const scroll = (dir: "left" | "right") => {
    sliderRef.current?.scrollBy({
      left: dir === "left" ? -snapWidth : snapWidth,
      behavior: "smooth",
    });
  };

  return (
    <Box sx={{ my: 6 }}>
      {/* HEADER */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h4">{title}</Typography>

        {isDesktop && (
          <Box display="flex" gap={1}>
            <IconButton
              onClick={() => scroll("left")}
              sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: 2,
                "&:hover": {
                  bgcolor: "grey.100",
                  boxShadow: 4,
                },
              }}
            >
              <ChevronLeftIcon fontSize="medium" />
            </IconButton>

            <IconButton
              onClick={() => scroll("right")}
              sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: 2,
                "&:hover": {
                  bgcolor: "grey.100",
                  boxShadow: 4,
                },
              }}
            >
              <ChevronRightIcon fontSize="medium" />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* SLIDER */}
      {/* <Box
        ref={sliderRef}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          py: 2,
          px: 1,
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {(loading ? Array.from({ length: 6 }) : products).map((p, index) => (
          <Box
            key={index}
            sx={{
              minWidth: { xs: "50%", sm: "35%", md: "20%" },
              flexShrink: 0,
              scrollSnapAlign: "start",
            }}
          >
            {loading ? (
              <ProductCardSkeleton />
            ) : (
              <ProductCard
                product={p as Product}
                onClickProduct={onClickProduct}
                onAddToCart={onAddToCart}
              />
            )}
          </Box>
        ))}
      </Box> */}


      <Box
  ref={sliderRef}
  sx={{
    display: "flex",
    gap: 2,
    overflowX: "auto",
    py: 2,
    px: 1,
    scrollSnapType: "x mandatory",
    scrollBehavior: "smooth",
    "&::-webkit-scrollbar": { display: "none" },
    scrollbarWidth: "none",
  }}
>
  {(loading ? Array.from({ length: 6 }) : products).map((p, index) => (
    <Box
      key={index}
      sx={{
        flex: "0", // force 50% width on xs
        flexShrink: 0,
        minWidth: { xs: "50%", sm: "35%", md: "20%" },
        scrollSnapAlign: "start",
        display: "flex",       // <-- new
      }}
    >
      {loading ? (
        <ProductCardSkeleton sx={{ flexGrow: 1 }} />
      ) : (
        <ProductCard
          product={p as Product}
          onClickProduct={onClickProduct}
          onAddToCart={onAddToCart}
          sx={{ flexGrow: 1 }} // <-- new
        />
      )}
    </Box>
  ))}
</Box>

    </Box>
  );
};

export default ProductSlider;
