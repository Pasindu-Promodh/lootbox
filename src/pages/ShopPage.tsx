import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { usePageTitle } from "../utils/usePageTitle";

const PAGE_SIZE = 20;

const SORT_ORDERS: Record<string, { column: string; ascending: boolean } | undefined> = {
  "price-asc": { column: "price", ascending: true },
  "price-desc": { column: "price", ascending: false },
  "name-asc": { column: "name", ascending: true },
};

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
  usePageTitle(subCategory ?? category ?? "Shop");
  const initialOnlyInStock = queryParams.get("inStock") === "true";
  const initialOnlyOnSale = queryParams.get("onSale") === "true";
  const initialSort = queryParams.get("sort") || "default";

  // --- State ---
  const [onlyInStock, setOnlyInStock] = useState(initialOnlyInStock);
  const [onlyOnSale, setOnlyOnSale] = useState(initialOnlyOnSale);
  const [sort, setSort] = useState(initialSort);
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filters as one key: which result set is loaded vs. requested.
  const filterKey = JSON.stringify([category, subCategory, onlyInStock, onlyOnSale, sort]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const loadingProducts = loadedKey !== filterKey;
  const currentKey = useRef(filterKey);
  useEffect(() => {
    currentKey.current = filterKey;
  }, [filterKey]);

  const fetchPage = useCallback(
    (offset: number) =>
      getProducts({
        limit: PAGE_SIZE,
        offset,
        category,
        sub_category: subCategory,
        in_stock: onlyInStock ? true : undefined,
        on_sale: onlyOnSale ? true : undefined,
        orderBy: SORT_ORDERS[sort],
      }),
    [category, subCategory, onlyInStock, onlyOnSale, sort]
  );

  // --- Load the first page whenever filters change ---
  useEffect(() => {
    let cancelled = false;
    fetchPage(0).then((page) => {
      if (cancelled) return;
      setProducts(page);
      setHasMore(page.length === PAGE_SIZE);
      setLoadedKey(filterKey);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchPage, filterKey]);

  // --- Load the next page from the server ---
  const loadMore = async () => {
    if (isLoadingMore || !hasMore || loadingProducts) return;
    setIsLoadingMore(true);
    const requestedKey = filterKey;
    const page = await fetchPage(products.length);
    // Filters changed mid-request: this page belongs to the old results.
    if (currentKey.current !== requestedKey) {
      setIsLoadingMore(false);
      return;
    }
    setProducts((prev) => [...prev, ...page]);
    setHasMore(page.length === PAGE_SIZE);
    setIsLoadingMore(false);
  };

  // The observer is created once; it always calls the latest loadMore.
  const loadMoreRef = useRef(loadMore);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  });

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
        if (entries.some((entry) => entry.isIntersecting)) loadMoreRef.current();
      },
      { root: null, rootMargin: "200px", threshold: 0.2 }
    );

    io.observe(observerRef.current);
    return () => io.disconnect();
  }, []);

  // --- Add to cart ---
  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    addToCart(productId);
  };

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
        products={products}
        onClickProduct={(id) => navigate(`/product/${id}`)}
        onAddToCart={handleAddToCart}
        loading={loadingProducts}
      />

      <Box ref={observerRef} sx={{ height: 24, mt: 4 }} />

      <Box sx={{ textAlign: "center", mt: 2 }}>
        {loadingProducts ? null : hasMore ? (
          <Typography variant="body2" color="text.secondary">
            Loading more items...
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {products.length === 0
              ? "No products found."
              : "You reached the end."}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ShopPage;
