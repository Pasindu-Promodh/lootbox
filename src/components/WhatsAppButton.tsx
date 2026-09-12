import { Fab, Tooltip, Zoom } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { getWhatsAppLink } from "../utils/whatsapp";
import { useDrawerVisibility } from "../context/DrawerVisibilityContext";

export default function WhatsAppButton() {
  const href = getWhatsAppLink();
  const { isAnyDrawerOpen } = useDrawerVisibility();

  return (
    // Hidden while a drawer (cart, wishlist, shop categories) is open so it
    // never sits on top of that content, e.g. the cart's Total/Checkout area.
    <Zoom in={!isAnyDrawerOpen}>
      <Tooltip title="Chat with us on WhatsApp" placement="left">
        <Fab
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          sx={{
            position: "fixed",
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            bgcolor: "#25D366",
            color: "#fff",
            zIndex: 1300,
            "&:hover": { bgcolor: "#1ebe57" },
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 32 }} />
        </Fab>
      </Tooltip>
    </Zoom>
  );
}
