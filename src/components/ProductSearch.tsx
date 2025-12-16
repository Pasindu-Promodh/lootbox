// ProductSearch.tsx
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ALL_PRODUCTS } from "../data/products";

interface ProductSearchProps {
  isMobile?: boolean;
  width?: number; // desktop width
  openFullScreen?: boolean; // mobile full-screen overlay
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
  const [openDropdown, setOpenDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);

  const filteredProducts = ALL_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectProduct = (id: number) => {
    navigate(`/product/${id}`);
    setSearch("");
    setOpenDropdown(false);
    onCloseFullScreen?.();
  };

  const renderDropdown = () => (
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
        width: isMobile ? "90%" : width,
        margin: isMobile ? "0 auto" : undefined,
      }}
    >
      {filteredProducts.length === 0 && (
        <Typography variant="body2" sx={{ p: 1, color: "text.secondary" }}>
          No results found
        </Typography>
      )}
      {filteredProducts.map((p) => (
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
          {/* Image */}
          <CardMedia
            component="img"
            image={p.images?.[0]}
            alt={p.name}
            sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1 }}
          />

          {/* Info */}
          <CardContent sx={{ flexGrow: 1, py: 0.5, px: 1 }}>
            <Typography
              variant="body2"
              fontWeight={500}
              noWrap
              sx={{ fontSize: "0.9rem" }}
            >
              {p.name}
            </Typography>
            {/* <Typography variant="caption" color="text.secondary" noWrap>
              {p.category}
            </Typography> */}
            <Box
              sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.3 }}
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
                  sx={{ textDecoration: "line-through", fontSize: "0.75rem" }}
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
  );

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
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenDropdown(true);
              }}
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
                  maxHeight: 300,
                  overflowY: "auto",
                  mt: 0.5,
                  p: 1,
                  width: isMobile ? "100%" : width,
                }}
              >
                {filteredProducts.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{ p: 1, color: "text.secondary" }}
                  >
                    No results found
                  </Typography>
                ) : (
                  filteredProducts.map((p) => (
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
                  ))
                )}
              </Paper>
            )}
          </Box>
        </ClickAwayListener>
      </Box>
    );
  }

  // Desktop / normal
  return (
    <ClickAwayListener onClickAway={() => setOpenDropdown(false)}>
      <Box sx={{ position: "relative", width: width }} ref={searchRef}>
        <InputBase
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpenDropdown(true);
          }}
          sx={{
            width: "100%",
            backgroundColor: isMobile
              ? "rgba(0,0,0,0.05)"
              : "rgba(255,255,255,0.15)",
            borderRadius: 1,
            px: 1,
            py: 0.5,
            color: isMobile ? "inherit" : "#fff",
          }}
        />
        {openDropdown && search && renderDropdown()}
      </Box>
    </ClickAwayListener>
  );
};

export default ProductSearch;
