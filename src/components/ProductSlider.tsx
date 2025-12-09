import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import ProductCard from "./ProductCard";
import type { Product } from "../data/products";

type Props = {
  products: Product[];
  onClickProduct: (id: number) => void;
  onAddToCart: (e: React.MouseEvent, id: number) => void;
};

const ProductSlider: React.FC<Props> = ({ products, onClickProduct, onAddToCart }) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // now works
      slider.scrollLeft += e.deltaY;
    };

    slider.addEventListener("wheel", handleWheel, { passive: false });

    return () => slider.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <Box
      ref={sliderRef}
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        py: 2,
        px: 1,
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      {products.map((p) => (
        <Box
          key={p.id}
          sx={{
            minWidth: { xs: "50%", sm: "35%", md: "20%" },
            flexShrink: 0,
          }}
        >
          <ProductCard
            product={p}
            onClickProduct={onClickProduct}
            onAddToCart={onAddToCart}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ProductSlider;
