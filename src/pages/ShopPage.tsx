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
import ProductGrid from "../components/ProductGrid";
import { useCart } from "../context/CartContext";
import { getProducts, getProductsByCategory } from "../data/fetchProducts";
import { getCategories } from "../data/fetchCategories";
import type { Product } from "../data/products";

const CHUNK_SIZE = 8;

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const observerRef = useRef<HTMLDivElement | null>(null);

  // --- Parse query parameters from URL ---
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialCategory = queryParams.get("category") || "All";
  const initialOnlyInStock = queryParams.get("inStock") === "true";
  const initialOnlyOnSale = queryParams.get("onSale") === "true";
  const initialSort = queryParams.get("sort") || "default";

  // --- State ---
  const [category, setCategory] = useState<string>(initialCategory);
  const [categories, setCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<string>(initialSort);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(initialOnlyInStock);
  const [onlyOnSale, setOnlyOnSale] = useState<boolean>(initialOnlyOnSale);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [itemsToShow, setItemsToShow] = useState<number>(CHUNK_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // --- Load categories ---
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  // --- Load products based on selected category ---
  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      const products =
        category === "All"
          ? await getProducts({ limit: 1000 })
          : await getProductsByCategory(category, 1000);
      setAllProducts(products);
      setLoadingProducts(false);
    };
    loadProducts();
  }, [category]);

  // --- Update URL query parameters when filters change ---
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (onlyInStock) params.set("inStock", "true");
    if (onlyOnSale) params.set("onSale", "true");
    if (sort !== "default") params.set("sort", sort);

    navigate({ search: params.toString() }, { replace: true });
  }, [category, onlyInStock, onlyOnSale, sort, navigate]);

  // --- Filter & sort products ---
  const filteredSorted = useMemo(() => {
    const filtered = allProducts.filter((p) => {
      return (onlyInStock ? p.in_stock : true) && (onlyOnSale ? p.on_sale : true);
    });

    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [allProducts, onlyInStock, onlyOnSale, sort]);

  const visibleItems = filteredSorted.slice(0, itemsToShow);

  // --- Reset items to show when filters or sort change ---
  useEffect(() => {
    setItemsToShow(CHUNK_SIZE);
  }, [category, onlyInStock, onlyOnSale, sort]);

  // --- Infinite scroll observer ---
  useEffect(() => {
    if (!observerRef.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoadingMore && itemsToShow < filteredSorted.length) {
            setIsLoadingMore(true);
            setTimeout(() => {
              setItemsToShow((prev) => Math.min(prev + CHUNK_SIZE, filteredSorted.length));
              setIsLoadingMore(false);
            }, 500);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.2 }
    );

    io.observe(observerRef.current);
    return () => io.disconnect();
  }, [filteredSorted.length, itemsToShow, isLoadingMore]);

  // --- Add product to cart ---
  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    addToCart(productId);
  };

  // --- Render ---
  return (
    <Box sx={{ width: "100%", maxWidth: 1700, mx: "auto", px: { xs: 2, sm: 5 }, mt: 6, mb: 8 }}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight={700}>
        Pickio Shop
      </Typography>
      {/* <Typography variant="subtitle1" gutterBottom textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
        Discover curated items — filter, sort, and scroll forever.
      </Typography> */}

      {/* Category Chips */}
      <Box sx={{ display: "flex", overflowX: "auto", gap: 1, py: 1, mb: 3 }}>
        {categories.map((c) => (
          <Chip
            key={c}
            label={c}
            clickable
            color={category === c ? "primary" : "default"}
            onClick={() => setCategory(c)}
            sx={{ px: 2, py: 1, boxShadow: 1, fontWeight: category === c ? 700 : 500 }}
          />
        ))}
      </Box>

      {/* Filters & Sorting */}
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center", mb: 3, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControlLabel
            control={<Checkbox checked={onlyInStock} onChange={(e) => setOnlyInStock(e.target.checked)} />}
            label="In Stock Only"
          />
          <FormControlLabel
            control={<Checkbox checked={onlyOnSale} onChange={(e) => setOnlyOnSale(e.target.checked)} />}
            label="On Sale Only"
          />
        </Box>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Sort</InputLabel>
          <Select value={sort} label="Sort" onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="price-asc">Price: Low → High</MenuItem>
            <MenuItem value="price-desc">Price: High → Low</MenuItem>
            <MenuItem value="name-asc">Name A → Z</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Product Grid */}
      <ProductGrid
        products={visibleItems}
        onClickProduct={(id) => navigate(`/product/${id}`)}
        onAddToCart={handleAddToCart}
        loading={loadingProducts}
      />

      {/* Infinite scroll sentinel */}
      <Box ref={observerRef} sx={{ height: 24, mt: 4 }} />

      {/* Footer message */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        {itemsToShow < filteredSorted.length ? (
          <Typography variant="body2" color="text.secondary">
            Loading more items...
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {filteredSorted.length === 0 ? "No products found." : "You reached the end."}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ShopPage;
