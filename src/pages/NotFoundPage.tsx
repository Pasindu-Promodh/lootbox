import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle";

export default function NotFoundPage() {
  const navigate = useNavigate();
  usePageTitle("Page not found");

  return (
    <Box sx={{ mt: 10, mb: 10, px: 2, textAlign: "center" }}>
      <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        The page you're looking for doesn't exist or has moved.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/shop")}>
        Browse products
      </Button>
    </Box>
  );
}
