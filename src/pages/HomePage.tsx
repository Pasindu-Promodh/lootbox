import React, { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../data/fetchProducts";
import ProductSlider from "../components/ProductSlider";
import { useCart } from "../context/CartContext";
import type { Product } from "../data/products";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    addToCart(productId);
  };

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadHomeProducts();
  }, []);

  async function loadHomeProducts() {
    setLoading(true);

    // Fetch only featured products
    const featured = await getProducts({ limit: 6, featured: true });
    setFeaturedProducts(featured);

    // Fetch best sellers (sorted by soldCount)
    const best = await getProducts({
      limit: 6,
      orderBy: { column: "soldCount" },
    });
    setBestSellers(best);

    // Fetch newest arrivals (sorted by addedDate)
    const newProds = await getProducts({
      limit: 6,
      orderBy: { column: "addedDate" },
    });
    setNewArrivals(newProds);

    setLoading(false);
  }

  // if (loading) {
  //   return (
  //     <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

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
        sx={{ width: "100%", maxWidth: 1700, mx: "auto", px: { xs: 2, sm: 5 } }}
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
            loading={loading}
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
            loading={loading}
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
            loading={loading}
          />
        </Box>
      </Box>
    </div>
  );
};

export default HomePage;
