import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { useCart } from "../context/CartContext";
import { getProducts } from "../data/fetchProducts";
import type { Product } from "../types/product";

const CHUNK_SIZE = 8;

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const observerRef = useRef<HTMLDivElement | null>(null);

  // --- Parse query parameters ---
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const category = queryParams.get("category") || undefined;
  const subCategory = category
    ? queryParams.get("sub_category") || undefined
    : undefined;
  const initialOnlyInStock = queryParams.get("inStock") === "true";
  const initialOnlyOnSale = queryParams.get("onSale") === "true";
  const initialSort = queryParams.get("sort") || "default";

  // --- State ---
  const [onlyInStock, setOnlyInStock] = useState(initialOnlyInStock);
  const [onlyOnSale, setOnlyOnSale] = useState(initialOnlyOnSale);
  const [sort, setSort] = useState(initialSort);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [itemsToShow, setItemsToShow] = useState(CHUNK_SIZE);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // --- Load products from DB ---
  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);

      const orderBy =
        sort === "price-asc"
          ? { column: "price", ascending: true }
          : sort === "price-desc"
          ? { column: "price", ascending: false }
          : sort === "name-asc"
          ? { column: "name", ascending: true }
          : undefined;

      const products = await getProducts({
        limit: 1000,
        category,
        sub_category: subCategory,
        in_stock: onlyInStock ? true : undefined,
        on_sale: onlyOnSale ? true : undefined,
        orderBy,
      });

      setAllProducts(products);
      setLoadingProducts(false);
      setItemsToShow(CHUNK_SIZE);
    };

    loadProducts();
  }, [category, subCategory, onlyInStock, onlyOnSale, sort]);

  // --- Update URL query params when filters change ---
  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (subCategory) params.set("sub_category", subCategory);
    if (onlyInStock) params.set("inStock", "true");
    if (onlyOnSale) params.set("onSale", "true");
    if (sort !== "default") params.set("sort", sort);

    navigate({ search: params.toString() }, { replace: true });
  }, [onlyInStock, onlyOnSale, sort, navigate, category, subCategory]);

  // --- Infinite scroll observer ---
  useEffect(() => {
    if (!observerRef.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !isLoadingMore &&
            itemsToShow < allProducts.length
          ) {
            setIsLoadingMore(true);
            setTimeout(() => {
              setItemsToShow((prev) =>
                Math.min(prev + CHUNK_SIZE, allProducts.length)
              );
              setIsLoadingMore(false);
            }, 500);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.2 }
    );

    io.observe(observerRef.current);
    return () => io.disconnect();
  }, [allProducts.length, itemsToShow, isLoadingMore]);

  // --- Add to cart ---
  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    addToCart(productId);
  };

  const visibleItems = allProducts.slice(0, itemsToShow);

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
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight={700}>
        Pickio Shop
      </Typography>

      {/* Filters */}
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

      <ProductGrid
        products={visibleItems}
        onClickProduct={(id) => navigate(`/product/${id}`)}
        onAddToCart={handleAddToCart}
        loading={loadingProducts}
      />

      <Box ref={observerRef} sx={{ height: 24, mt: 4 }} />

      <Box sx={{ textAlign: "center", mt: 2 }}>
        {itemsToShow < allProducts.length ? (
          <Typography variant="body2" color="text.secondary">
            Loading more items...
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {allProducts.length === 0
              ? "No products found."
              : "You reached the end."}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ShopPage;
