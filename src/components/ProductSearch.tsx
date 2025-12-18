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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../data/products";
import { searchProducts } from "../data/fetchProducts";

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

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: number;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = window.setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = useRef(
    debounce(async (value: string) => {
      if (!value.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchProducts(value, 8); // your API function
        setResults(data);
        setOpenDropdown(true);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500)
  ).current;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value); // trigger debounced API search
  };

  const renderResults = () => (
    <Paper
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 11,
        maxHeight: 300,
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
          key={p.id}
          onClick={() => handleSelectProduct(p.id)}
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
            image={p.images?.[0]}
            alt={p.name}
            sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1 }}
          />

          <CardContent sx={{ flexGrow: 1, py: 0.5, px: 1 }}>
            <Typography
              variant="body2"
              fontWeight={500}
              noWrap
              sx={{ fontSize: "0.9rem" }}
            >
              {p.name}
            </Typography>

            <Box
              sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.3 }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ fontSize: "1rem", color: "primary.main" }}
              >
                Rs {p.price}
              </Typography>

              {p.discount > 0 && (
                <Typography
                  variant="body2"
                  color="error"
                  fontWeight={600}
                  sx={{ fontSize: "0.75rem" }}
                >
                  {p.discount}% OFF
                </Typography>
              )}
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
                    key={p.id}
                    onClick={() => handleSelectProduct(p.id)}
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
                      image={p.images?.[0]}
                      alt={p.name}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, py: 0.5, px: 1 }}>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        noWrap
                        sx={{ fontSize: "0.9rem" }}
                      >
                        {p.name}
                      </Typography>
                      {/* <Typography variant="caption" color="text.secondary">
                          {p.category}
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
                          Rs {p.price}
                        </Typography>
                        {p.on_sale && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              textDecoration: "line-through",
                              fontSize: "0.75rem",
                            }}
                          >
                            Rs {p.price}
                          </Typography>
                        )}
                        {p.on_sale && (
                          <Typography
                            variant="body2"
                            color="error"
                            fontWeight={600}
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {Math.round(p.price * (1 - p.discount / 100))}% OFF
                          </Typography>
                        )}
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
