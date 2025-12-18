import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import type { Product } from "../data/products";

type Props = {
  product: Product;
  onClickProduct: (id: string) => void;
  onAddToCart: (e: React.MouseEvent, id: string) => void;
  fontSizes?: {
    name?: string;
    price?: string;
    originalPrice?: string;
    category?: string;
    button?: string;
  };
  sx?: object;
};

const ProductCard: React.FC<Props> = ({
  product,
  onClickProduct,
  // onAddToCart,
  fontSizes = {},
  sx,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Card
      onClick={() => onClickProduct(product.id)}
      sx={{
        ...sx,
        cursor: "pointer",
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        transition: "transform 220ms ease, box-shadow 220ms ease",
        "&:hover": { transform: "translateY(-6px)", boxShadow: 8 },
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* SALE Badge */}
      {product.on_sale && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: -40,
            width: 120,
            transform: "rotate(45deg)",
            bgcolor: "error.main",
            color: "white",
            textAlign: "center",
            fontWeight: 800,
            py: 0.4,
            zIndex: 12,
            boxShadow: 2,
            fontSize: "0.75rem",
          }}
        >
          SALE
        </Box>
      )}

      {/* Stock Badge */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          bgcolor: product.in_stock ? "success.main" : "grey.600",
          color: "white",
          px: 1.2,
          py: 0.35,
          borderRadius: 1,
          fontSize: "0.75rem",
          fontWeight: 700,
          zIndex: 12,
        }}
      >
        {product.in_stock ? "In Stock" : "Out of Stock"}
      </Box>

      {/* 1:1 Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          pt: "100%",
          bgcolor: "grey.100",
        }}
      >
        {!loaded && (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ position: "absolute", inset: 0 }}
          />
        )}
        <CardMedia
          component="img"
          src={product.images?.[0]}
          alt={product.name}
          onLoad={() => setLoaded(true)}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 400ms ease",
          }}
          loading="lazy"
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          fontWeight={500}
          gutterBottom
          noWrap
          sx={{ fontSize: fontSizes.name ?? "0.9rem" }}
        >
          {product.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // gap: 0.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              columnGap:1,
              flexWrap: "wrap",
            }}
          >
            {/* New Price */}
            <Typography
              variant="h6"
              color="primary"
              fontWeight={500}
              sx={{ fontSize: fontSizes.price ?? "1.2rem" }}
            >
              Rs{" "}
              {Math.round(
                product.price * (1 - product.discount / 100)
              ).toLocaleString()}
            </Typography>

            {/* Old price inline on desktop only */}
            {product.on_sale && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  textDecoration: "line-through",
                  fontSize: fontSizes.originalPrice ?? "0.8rem",
                  display: { xs: "none", sm: "block" },
                }}
              >
                Rs {Math.round(product.price).toLocaleString()}
              </Typography>
            )}

            {/* Discount always next to new price */}
            {product.on_sale && (
              <Typography
                variant="body2"
                color="error"
                fontWeight={600}
                sx={{ fontSize: "0.8rem" }}
              >
                {product.discount}% OFF
              </Typography>
            )}
          </Box>

          {/* Old price below new price on mobile only */}
          {product.on_sale && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textDecoration: "line-through",
                fontSize: fontSizes.originalPrice ?? "0.8rem",
                display: { xs: "block", sm: "none" },
              }}
            >
              Rs {Math.round(product.price).toLocaleString()}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ borderRadius: 0, fontSize: fontSizes.button ?? "0.875rem" }}
        disabled={!product.in_stock}
        onClick={(e) => onAddToCart(e, product.id)}
      >
        {product.in_stock ? "Add to Cart" : "Unavailable"}
      </Button> */}
    </Card>
  );
};

export default ProductCard;
