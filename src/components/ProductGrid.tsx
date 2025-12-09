import React from "react";
import { Box } from "@mui/material";
import ProductCard from "./ProductCard";
import type { Product } from "../data/products";

type Props = {
  products: Product[];
  onClickProduct: (id: number) => void;
  onAddToCart: (e: React.MouseEvent, id: number) => void;
};

const ProductGrid: React.FC<Props> = ({ products, onClickProduct, onAddToCart }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        px: 1,
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(5, 1fr)",
        },
      }}
    >
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onClickProduct={onClickProduct}
          onAddToCart={onAddToCart}
        />
      ))}
    </Box>
  );
};

export default ProductGrid;
