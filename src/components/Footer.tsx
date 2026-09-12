import { Box, Container, Typography, Link, Stack, Divider } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link as RouterLink } from "react-router-dom";
import { getWhatsAppLink } from "../utils/whatsapp";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 4,
        background: "linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%)",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 3, sm: 4 }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "flex-start" }}
        >
          {/* Brand */}
          <Box>
            <Box
              component="img"
              src="/Pickio_Logo.png"
              alt="Pickio"
              sx={{ height: 32, mb: 1 }}
            />
            <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 280 }}>
              Find the best products and deals, effortlessly.
            </Typography>
          </Box>

          {/* Quick links */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
              Quick Links
            </Typography>
            <Stack spacing={0.75}>
              <Link component={RouterLink} to="/" color="inherit" underline="hover">
                Home
              </Link>
              <Link component={RouterLink} to="/shop" color="inherit" underline="hover">
                Shop
              </Link>
              <Link component={RouterLink} to="/orders" color="inherit" underline="hover">
                My Orders
              </Link>
            </Stack>
          </Box>

          {/* Contact */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
              Contact Us
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              component={Link}
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
            >
              <WhatsAppIcon sx={{ fontSize: 20, color: "#25D366" }} />
              <Typography variant="body2">+94 75 700 7562</Typography>
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.15)" }} />

        <Typography variant="body2" textAlign="center" sx={{ opacity: 0.6 }}>
          © {year} Pickio. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
