import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import ProductGrid from "../components/ProductGrid";
import FullscreenViewer from "../components/FullscreenViewer";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishListContext";

import { getProductById, getProductsByCategory } from "../data/fetchProducts";
import type { Product } from "../data/products";

export default function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishList, addToWishList, removeFromWishList } = useWishList();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [mainImage, setMainImage] = useState("");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const isInWishList = product
    ? wishList.some((item) => item.id === product.id)
    : false;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (productId) loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    const prod = await getProductById(productId);
    setProduct(prod);
    if (prod) setMainImage(prod.images[0] || "");

    // Fetch related products by category (exclude current product)
    if (prod) {
      const related = await getProductsByCategory(prod.category, 10);
      setRelatedProducts(related.filter((p) => p.id !== prod.id).slice(0, 10));
    }

    setLoading(false);
  };

  useEffect(() => {
    if (product) setMainImage(product.images[0]);
    setZoomed(false);
  }, [product]);

  const index = mainImage ? product?.images.indexOf(mainImage) ?? 0 : 0;

  const goNext = useCallback(
    () =>
      setMainImage(
        product?.images[(index + 1) % (product.images.length || 1)] || ""
      ),
    [index, product]
  );

  const goPrev = useCallback(
    () =>
      setMainImage(
        product?.images[
          (index - 1 + (product?.images.length || 1)) %
            (product?.images.length || 1)
        ] || ""
      ),
    [index, product]
  );

  const toggleZoom = () => setZoomed((z) => !z);

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    addToCart(productId);
  };

  const handleClickProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h4">Product not found</Typography>
        <Button onClick={() => navigate(-1)} variant="contained" sx={{ mt: 2 }}>
          Back to Shop
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1700,
        mx: "auto",
        px: { xs: 2, sm: 5 },
        mt: 6,
        mb: 8,
      }}
    >
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        ← Back to Shop
      </Button>

      {/* MAIN SECTION */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mx: 2,
        }}
      >
        {/* IMAGE */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
              cursor: "zoom-in",
            }}
            onClick={() => setViewerOpen(true)}
          >
            <CardMedia
              component="img"
              src={mainImage}
              alt={product.name}
              sx={{
                width: "100%",
                aspectRatio: "1/1",
                objectFit: "cover",
                transition: "transform .3s",
                "&:hover": { transform: "scale(1.03)" },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2, overflowX: "auto" }}>
            {product.images.map((img) => (
              <Box
                key={img}
                onClick={() => setMainImage(img)}
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: 2,
                  cursor: "pointer",
                  overflow: "hidden",
                  border:
                    img === mainImage
                      ? "2px solid #1976d2"
                      : "2px solid transparent",
                }}
              >
                <CardMedia
                  component="img"
                  src={img}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* DETAILS */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">{product.name}</Typography>
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, color: "text.secondary" }}
          >
            Category: {product.category}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
            {product.description}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography variant="h5" color="primary" fontWeight={700}>
              Rs {Math.round(product.price * (1 - product.discount / 100))}
            </Typography>
            {product.on_sale && (
              <>
                <Typography
                  variant="body1"
                  sx={{ textDecoration: "line-through", opacity: 0.6 }}
                >
                  Rs {product.price}
                </Typography>
                <Typography color="error" fontWeight={600}>
                  Save {product.discount}%
                </Typography>
              </>
            )}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight={600}>
              Delivery Date:
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              1 – 5 Working Days
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: "#f7f7f7",
            }}
          >
            <Typography variant="body2">
              ✔ Cash on Delivery Available
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              size="large"
              sx={{ flex: 1 }}
              disabled={!product.in_stock}
              onClick={() => addToCart(product.id)}
            >
              {product.in_stock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button
              variant={isInWishList ? "outlined" : "outlined"}
              size="large"
              sx={{ flex: 1 }}
              color={isInWishList ? "error" : "primary"}
              onClick={() =>
                isInWishList
                  ? removeFromWishList(product.id)
                  : addToWishList(product.id)
              }
            >
              {isInWishList ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Related Products
          </Typography>
          <ProductGrid
            products={relatedProducts}
            onClickProduct={handleClickProduct}
            onAddToCart={handleAddToCart}
            loading={loading}
          />
        </Box>
      )}

      {/* FULLSCREEN VIEWER */}
      <FullscreenViewer
        open={viewerOpen}
        images={product.images}
        currentIndex={index}
        onClose={() => setViewerOpen(false)}
        onPrev={goPrev}
        onNext={goNext}
        zoomed={zoomed}
        toggleZoom={toggleZoom}
      />
    </Box>
  );
}
