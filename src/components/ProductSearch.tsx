import React, { useState, useRef } from "react";
import {
  Box,
  InputBase,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Typography,
  ClickAwayListener,
  CircularProgress,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import { searchProducts } from "../data/fetchProducts";
import { clickable } from "../utils/a11y";
import { formatPrice, discountPercent } from "../utils/checkout";

interface ProductSearchProps {
  isMobile?: boolean;
  width?: number;
  openFullScreen?: boolean;
  onCloseFullScreen?: () => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  isMobile,
  width = 250,
  openFullScreen,
  onCloseFullScreen,
}) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);

  const handleSelectProduct = (id: string) => {
    navigate(`/product/${id}`);
    setSearch("");
    setResults([]);
    setOpenDropdown(false);
    onCloseFullScreen?.();
  };

  // Debounce typing, and ignore responses from searches that were superseded
  // by newer input (they can resolve out of order).
  const debounceTimer = useRef<number | undefined>(undefined);
  const latestRequest = useRef(0);

  const runSearch = async (value: string) => {
    const requestId = ++latestRequest.current;

    if (!value.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await searchProducts(value, 8);
      if (requestId !== latestRequest.current) return;
      setResults(data);
      setOpenDropdown(true);
    } catch (err) {
      console.error(err);
      if (requestId === latestRequest.current) setResults([]);
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => runSearch(value), 500);
  };

  const renderResults = () => (
    <Paper
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 11,
        maxHeight: 500,
        overflowY: "auto",
        mt: 0.5,
        p: 1,
        width: isMobile ? "100%" : width,
      }}
    >
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={22} />
        </Box>
      )}

      {!loading && results.length === 0 && (
        <Typography variant="body2" sx={{ p: 1, color: "text.secondary" }}>
          No results found
        </Typography>
      )}

      {results.map((p) => (
        <Card
          key={p?.id}
          {...clickable(() => handleSelectProduct(p?.id), p?.name)}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            cursor: "pointer",
            boxShadow: 1,
            "&:hover": { boxShadow: 3 },
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: 1,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {p?.images?.[0]?.thumb ? (
              <CardMedia
                component="img"
                image={p?.images?.[0]?.thumb}
                alt={p?.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{ width: "100%", height: "100%" }}
              />
            )}
          </Box>

          <CardContent
            sx={{
              flexGrow: 1,
              py: 0.5,
              px: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 80,
            }}
          >
            <Tooltip title={p?.name}>
              <Typography
                variant="body2"
                fontWeight={500}
                // noWrap
                sx={{ fontSize: "0.9rem" }}
              >
                {p?.name}
              </Typography>
            </Tooltip>

            <Box
              sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.3 }}
            >
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontSize: "1.1rem", color: "primary.main" }}
              >
                {formatPrice(p?.price)}
              </Typography>
              {p?.pre_discount_price > p?.price && (
                <>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textDecoration: "line-through",
                      fontSize: "0.75rem",
                    }}
                  >
                    {formatPrice(p?.pre_discount_price)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="error"
                    fontWeight={600}
                    sx={{ fontSize: "0.8rem" }}
                  >
                    {discountPercent(p.pre_discount_price, p.price)}
                    % OFF
                  </Typography>
                </>
              )}
              {/* {p?.on_sale && (
                <Typography
                  variant="body2"
                  color="error"
                  fontWeight={600}
                  sx={{ fontSize: "0.8rem" }}
                >
                  {discountPercent(p.pre_discount_price, p.price)}
                  % OFF
                </Typography>
              )} */}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Paper>
  );

  // 📱 MOBILE FULLSCREEN SEARCH

  if (isMobile && openFullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(0,0,0,0.6)",
          zIndex: 1200,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          pt: 0.5,
        }}
        onClick={onCloseFullScreen}
      >
        <ClickAwayListener onClickAway={() => setOpenDropdown(false)}>
          <Box sx={{ width: "98%" }} onClick={(e) => e.stopPropagation()}>
            <InputBase
              autoFocus
              placeholder="Search products..."
              value={search}
              // onChange={(e) => {
              //   setSearch(e.target.value);
              //   setOpenDropdown(true);
              // }}
              onChange={handleChange}
              sx={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 1,
                px: 2,
                py: 1,
                fontSize: "1rem",
              }}
            />

            {openDropdown && search && (
              <Paper
                sx={{
                  left: 0,
                  right: 0,
                  zIndex: 11,
                  maxHeight: 500,
                  overflowY: "auto",
                  mt: 0.5,
                  p: 1,
                  width: isMobile ? "100%" : width,
                }}
              >
                {loading && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 2 }}
                  >
                    <CircularProgress size={22} />
                  </Box>
                )}
                {!loading && results.length === 0 && (
                  <Typography
                    variant="body2"
                    sx={{ p: 1, color: "text.secondary" }}
                  >
                    No results found
                  </Typography>
                )}
                {results.map((p) => (
                  <Card
                    key={p?.id}
                    {...clickable(() => handleSelectProduct(p?.id), p?.name)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      cursor: "pointer",
                      boxShadow: 1,
                      "&:hover": { boxShadow: 3 },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={p?.images?.[0]?.thumb}
                      alt={p?.name}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        py: 0.5,
                        px: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: 80,
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        // noWrap
                        sx={{ fontSize: "0.9rem" }}
                      >
                        {p?.name}
                      </Typography>
                      {/* <Typography variant="caption" color="text.secondary">
                          {p?.category}
                        </Typography> */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          mt: 0.3,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ fontSize: "1.1rem", color: "primary.main" }}
                        >
                          {formatPrice(p?.price)}
                        </Typography>
                        {p?.pre_discount_price > p?.price && (
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                textDecoration: "line-through",
                                fontSize: "0.75rem",
                              }}
                            >
                              {formatPrice(p?.pre_discount_price)}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="error"
                              fontWeight={600}
                              sx={{ fontSize: "0.8rem" }}
                            >
                              {discountPercent(p.pre_discount_price, p.price)}
                              % OFF
                            </Typography>
                          </>
                        )}
                        {/* {p?.on_sale && (
                          <Typography
                            variant="body2"
                            color="error"
                            fontWeight={600}
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {p?.discount}% OFF
                          </Typography>
                        )} */}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            )}
          </Box>
        </ClickAwayListener>
      </Box>
    );
  }

  // 🖥 DESKTOP SEARCH
  return (
    <ClickAwayListener onClickAway={() => setOpenDropdown(false)}>
      <Box sx={{ position: "relative", width }} ref={searchRef}>
        <InputBase
          placeholder="Search products..."
          value={search}
          onChange={handleChange}
          sx={{
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: 1,
            px: 1,
            py: 0.5,
            color: "#fff",
          }}
        />

        {openDropdown && search && renderResults()}
      </Box>
    </ClickAwayListener>
  );
};

export default ProductSearch;
