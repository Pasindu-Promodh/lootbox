import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box, CardMedia } from "@mui/material";
import { ALL_PRODUCTS } from "../data/products";
import ProductGrid from "../components/ProductGrid";
import FullscreenViewer from "../components/FullscreenViewer";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishListContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishList, addToWishList, removeFromWishList } = useWishList();

  const isInWishList = wishList.some((item) => item.id === Number(id));

  const product = ALL_PRODUCTS.find((p) => p.id === Number(id));

  const [mainImage, setMainImage] = useState(product?.images[0] || "");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (product) {
      setMainImage(product.images[0]);
      setZoomed(false);
    }
  }, [product]);

  if (!product) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h4">Product not found</Typography>
        <Button onClick={() => navigate(-1)} variant="contained" sx={{ mt: 2 }}>
          Back to Shop
        </Button>
      </Container>
    );
  }

  const images = product.images;
  const index = images.indexOf(mainImage);

  const goNext = useCallback(
    () => setMainImage(images[(index + 1) % images.length]),
    [index, images]
  );
  const goPrev = useCallback(
    () => setMainImage(images[(index - 1 + images.length) % images.length]),
    [index, images]
  );

  const toggleZoom = () => setZoomed((z) => !z);

  // Related products
  const relatedByCategory = ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  );
  let relatedProducts = [...relatedByCategory];
  if (relatedProducts.length < 8) {
    const fallback = ALL_PRODUCTS.filter((p) => p.id !== product.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 8 - relatedProducts.length);
    relatedProducts = [...relatedProducts, ...fallback];
  }
  relatedProducts = relatedProducts.slice(0, 8);

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    addToCart(productId);
  };

  const handleClickProduct = (id: number) => {
    navigate(`/product/${id}`);
  };

  return (
    <Box
      sx={{
        width: "100%", // full width on small screens
        maxWidth: 1700, // limit width on large screens
        mx: "auto", // center horizontally
        px: { xs: 1, sm: 2 }, // small horizontal padding
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
          // width: "70%",
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

          {/* Thumbnails */}
          <Box sx={{ display: "flex", gap: 2, mt: 2, overflowX: "auto" }}>
            {images.map((img) => (
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

          {/* DESCRIPTION */}
          {product.description && (
            <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
              {product.description}
            </Typography>
          )}

          {/* PRICING */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography variant="h5" color="primary" fontWeight={700}>
              Rs {product.price}
            </Typography>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <Typography
                  variant="body1"
                  sx={{ textDecoration: "line-through", opacity: 0.6 }}
                >
                  Rs {product.originalPrice}
                </Typography>
                <Typography color="error" fontWeight={600}>
                  Save{" "}
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  %
                </Typography>
              </>
            )}
          </Box>

          {/* DELIVERY DATE */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight={600}>
              Delivery Date:
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              1 – 5 Working Days
            </Typography>
          </Box>

          {/* TRUST BADGES */}
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

          {/* ADD TO CART / WISHLIST */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: "row", // always side by side
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{ flex: 1 }}
              disabled={!product.inStock}
              onClick={() => addToCart(product.id)}
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            {/* <Button
              variant="outlined"
              size="large"
              startIcon={<FavoriteBorderIcon />}
              sx={{ flex: 1 }}
              onClick={() => addToWishList(product.id)}
            >
              Add to Wishlist
            </Button> */}
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
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Related Products
        </Typography>
        <ProductGrid
          products={relatedProducts}
          onClickProduct={handleClickProduct}
          onAddToCart={handleAddToCart}
        />
      </Box>

      {/* FULLSCREEN VIEWER */}
      <FullscreenViewer
        open={viewerOpen}
        images={images}
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
