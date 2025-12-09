import { useEffect } from "react";
import { Box, Modal, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface FullscreenViewerProps {
  open: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  zoomed: boolean;
  toggleZoom: () => void;
}

export default function FullscreenViewer({
  open,
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  zoomed,
  toggleZoom,
}: FullscreenViewerProps) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onNext, onPrev, onClose]);

  if (images.length === 0) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(0,0,0,0.92)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
        onClick={onClose}
      >
        {/* Close button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          sx={{ position: "absolute", top: 20, right: 20, color: "white" }}
        >
          <CloseIcon />
        </IconButton>

        {/* Prev button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          sx={{
            position: "absolute",
            left: 20,
            color: "white",
            bgcolor: "rgba(255,255,255,0.1)",
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        {/* Next button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          sx={{
            position: "absolute",
            right: 20,
            color: "white",
            bgcolor: "rgba(255,255,255,0.1)",
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>

        {/* Fullscreen image */}
        <Box
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={toggleZoom}
          sx={{
            width: zoomed ? "180vh" : "90vh",
            height: zoomed ? "180vh" : "90vh",
            transition: "0.3s",
            cursor: zoomed ? "grab" : "zoom-in",
            overflow: "hidden",
          }}
        >
          <img
            src={images[currentIndex]}
            alt={`image ${currentIndex + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              userSelect: "none",
            }}
          />
        </Box>

        {/* Image index */}
        <Typography
          sx={{
            position: "absolute",
            bottom: 20,
            color: "white",
            fontWeight: 600,
            fontSize: "1.2rem",
          }}
        >
          {currentIndex + 1} / {images.length}
        </Typography>
      </Box>
    </Modal>
  );
}
