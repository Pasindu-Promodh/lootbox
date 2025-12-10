// src/pages/ShopPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Typography,
  Box,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { ALL_PRODUCTS } from "../data/products";
import ProductGrid from "../components/ProductGrid";
import { useCart } from "../context/CartContext";

// ---------- Constants ----------
const CATEGORIES = ["All", "Electronics", "Accessories", "Home"];
const CHUNK_SIZE = 8;

// ---------- Component ----------
const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  // Read filters & sort from URL query params
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const initialCategory = queryParams.get("category") || "All";
  const initialOnlyInStock = queryParams.get("inStock") === "true";
  const initialOnlyOnSale = queryParams.get("onSale") === "true";
  const initialSort = queryParams.get("sort") || "default";

  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<string>(initialSort);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(initialOnlyInStock);
  const [onlyOnSale, setOnlyOnSale] = useState<boolean>(initialOnlyOnSale);

  // Infinite scroll + loading
  const [itemsToShow, setItemsToShow] = useState<number>(CHUNK_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update URL when filters/sort change
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (onlyInStock) params.set("inStock", "true");
    if (onlyOnSale) params.set("onSale", "true");
    if (sort !== "default") params.set("sort", sort);

    navigate({ search: params.toString() }, { replace: true });
  }, [category, onlyInStock, onlyOnSale, sort, navigate]);

  // Filter & sort the full product set based on controls
  const filteredSorted = useMemo(() => {
    let list = ALL_PRODUCTS.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesStock = onlyInStock ? p.inStock : true;
      const matchesSale = onlyOnSale ? p.onSale : true;
      return matchesCategory && matchesStock && matchesSale;
    });

    if (sort === "price-asc") {
      list = list.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list = list.sort((a, b) => b.price - a.price);
    } else if (sort === "name-asc") {
      list = list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [category, onlyInStock, onlyOnSale, sort]);

  const visibleItems = filteredSorted.slice(0, itemsToShow);

  // Reset itemsToShow when filters/sort change
  useEffect(() => {
    setItemsToShow(CHUNK_SIZE);
  }, [category, onlyInStock, onlyOnSale, sort]);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current) return;
    const sentinel = observerRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoadingMore) {
            if (itemsToShow < filteredSorted.length) {
              setIsLoadingMore(true);
              setTimeout(() => {
                setItemsToShow((prev) =>
                  Math.min(prev + CHUNK_SIZE, filteredSorted.length)
                );
                setIsLoadingMore(false);
              }, 700);
            }
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.2 }
    );

    io.observe(sentinel);
    return () => io.disconnect();
  }, [filteredSorted.length, itemsToShow, isLoadingMore]);

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    addToCart(productId);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1700,
        mx: "auto",
        px: { xs: 1, sm: 2 },
        mt: 6,
        mb: 8,
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight={700}>
        LootBox Shop
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Discover curated items — filter, sort, and scroll forever.
      </Typography>

      {/* Category Chips */}
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 1,
          py: 1,
          mb: 3,
        }}
      >
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={c}
            clickable
            color={category === c ? "primary" : "default"}
            onClick={() => setCategory(c)}
            sx={{
              px: 2,
              py: 1,
              boxShadow: 1,
              fontWeight: category === c ? 700 : 500,
            }}
          />
        ))}
      </Box>

      {/* Filters row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
            }
            label="In Stock Only"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={onlyOnSale}
                onChange={(e) => setOnlyOnSale(e.target.checked)}
              />
            }
            label="On Sale Only"
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Sort</InputLabel>
            <Select
              value={sort}
              label="Sort"
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="price-asc">Price: Low → High</MenuItem>
              <MenuItem value="price-desc">Price: High → Low</MenuItem>
              <MenuItem value="name-asc">Name A → Z</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Product grid */}
      <ProductGrid
        products={visibleItems}
        onClickProduct={(id) => navigate(`/product/${id}`)}
        onAddToCart={handleAddToCart}
      />

      <Box ref={observerRef} sx={{ height: 24, mt: 4 }} />

      <Box sx={{ textAlign: "center", mt: 2 }}>
        {itemsToShow < filteredSorted.length ? (
          <Typography variant="body2" color="text.secondary">
            Loading more items...
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {filteredSorted.length === 0 ? "" : "You reached the end."}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ShopPage;
