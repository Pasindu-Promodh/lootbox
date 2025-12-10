import React, { useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ALL_PRODUCTS } from "../data/products";
import ProductSlider from "../components/ProductSlider";
import { useCart } from "../context/CartContext";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    addToCart(productId);
  };

  const handleClickProduct = (id: number) => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featuredProducts = ALL_PRODUCTS.filter((p) => p.featured);

  const bestSellers = [...ALL_PRODUCTS]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 12);

  const newArrivals = [...ALL_PRODUCTS]
    .sort(
      (a, b) =>
        new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    )
    .slice(0, 12);

  return (
    <div>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage:
            "url(https://placehold.co/1200x400?text=LootBox&bg=555&fg=fff)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          py: { xs: 6, md: 12 },
          textAlign: "center",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
          Shop the Best Deals!
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, px: { xs: 2, md: 0 } }}>
          Find your favorite gadgets, accessories, and more at amazing prices.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate("/shop")}
        >
          Start Shopping
        </Button>
      </Box>

      <Box
        sx={{
          width: "100%", // full width on small screens
          maxWidth: 1700, // limit width on large screens
          mx: "auto", // center horizontally
          px: { xs: 1, sm: 2 }, // small horizontal padding
        }}
      >
        {/* Featured */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Featured Products
          </Typography>

          <ProductSlider
            products={featuredProducts}
            onClickProduct={handleClickProduct}
            onAddToCart={handleAddToCart}
          />
        </Box>

        {/* Best Sellers */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Best Sellers
          </Typography>

          <ProductSlider
            products={bestSellers}
            onClickProduct={handleClickProduct}
            onAddToCart={handleAddToCart}
          />
        </Box>

        {/* New Arrivals */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            New Arrivals
          </Typography>

          <ProductSlider
            products={newArrivals}
            onClickProduct={handleClickProduct}
            onAddToCart={handleAddToCart}
          />
        </Box>
      </Box>
    </div>
  );
};

export default HomePage;
