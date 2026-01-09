import React, { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../data/fetchProducts";
import ProductSlider from "../components/ProductSlider";
import { useCart } from "../context/CartContext";
import type { Product } from "../data/products";
import { keyframes } from "@mui/system";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    addToCart(productId);
  };

  const handleClickProduct = (productId: string) => {
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
      orderBy: { column: "sold_count" },
    });
    setBestSellers(best);

    // Fetch newest arrivals (sorted by addedDate)
    const newProds = await getProducts({
      limit: 6,
      orderBy: { column: "added_date" },
    });
    setNewArrivals(newProds);

    setLoading(false);
  }

  const flyInLeft = keyframes`
  0% { opacity: 0; transform: translateX(-100px) rotate(-10deg); }
  60% { transform: translateX(10px) rotate(5deg); opacity: 1; }
  80% { transform: translateX(-5px) rotate(-2deg); }
  100% { transform: translateX(0) rotate(0deg); }
`;

  const flyInRight = keyframes`
  0% { opacity: 0; transform: translateX(100px) rotate(10deg); }
  60% { transform: translateX(-10px) rotate(-5deg); opacity: 1; }
  80% { transform: translateX(5px) rotate(2deg); }
  100% { transform: translateX(0) rotate(0deg); }
`;

  const floatGlow = keyframes`
  0%, 100% { transform: translateY(0); box-shadow: 0 0 10px rgba(255,255,255,0.5); }
  50% { transform: translateY(-6px); box-shadow: 0 0 20px rgba(255,255,255,0.9); }
`;

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
      {/* <Box
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
      </Box> */}

      <Box
        sx={{
          backgroundImage:
            "url(https://placehold.co/1200x400?text=Pickio&bg=555&fg=fff)",
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

        <Typography variant="h6" sx={{ mb: 2, px: { xs: 2, md: 0 } }}>
          Find your favorite gadgets, accessories, and more at amazing prices.
        </Typography>

        {/* COD Trust Badge */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            flexWrap: "wrap",
            mb: 5,
            position: "relative",
          }}
        >
          {/* COD Badge */}
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 3,
              backgroundColor: "rgba(255, 111, 0, 0.6)",
              color: "#fff",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              animation: `${flyInLeft} 0.9s ease-out, ${floatGlow} 2s infinite alternate`,
              cursor: "default",
              boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
            }}
          >
            💵 Cash on Delivery
          </Box>

          {/* Delivery Badge */}
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 3,
              backgroundColor: "rgba(0, 176, 255, 0.6)",
              color: "#fff",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              animation: `${flyInRight} 0.9s ease-out 0.2s, ${floatGlow} 2s infinite alternate`,
              cursor: "default",
              boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
            }}
          >
            🚚 1–5 Working Days Delivery
          </Box>
        </Box>

        <Box>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/shop")}
          >
            Start Shopping
          </Button>
        </Box>
      </Box>

      <Box
        sx={{ width: "100%", maxWidth: 1700, mx: "auto", px: { xs: 2, sm: 5 } }}
      >
        {/* Featured */}

        <ProductSlider
          products={featuredProducts}
          onClickProduct={handleClickProduct}
          onAddToCart={handleAddToCart}
          loading={loading}
          title="Featured Products"
        />

        {/* Best Sellers */}

        <ProductSlider
          products={bestSellers}
          onClickProduct={handleClickProduct}
          onAddToCart={handleAddToCart}
          loading={loading}
          title="Best Sellers"
        />

        {/* New Arrivals */}
        <ProductSlider
          products={newArrivals}
          onClickProduct={handleClickProduct}
          onAddToCart={handleAddToCart}
          loading={loading}
          title="New Arrivals"
        />
      </Box>
    </div>
  );
};

export default HomePage;
