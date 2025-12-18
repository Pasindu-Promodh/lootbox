import { Box, IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef } from "react";

interface Props {
  children: React.ReactNode;
  snapWidth?: number;
}

const HorizontalScroller: React.FC<Props> = ({
  children,
  snapWidth = 360,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({
      left: dir === "left" ? -snapWidth : snapWidth,
      behavior: "smooth",
    });
  };

  return (
    <Box position="relative">
      {/* TOP RIGHT ARROWS (DESKTOP ONLY) */}
      {isDesktop && (
        <Box
          position="absolute"
          top={0}
          right={8}
          zIndex={2}
          display="flex"
          gap={1}
        >
          <IconButton size="small" onClick={() => scroll("left")}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton size="small" onClick={() => scroll("right")}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      )}

      {/* SCROLLER */}
      <Box
        ref={ref}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          py: 3,
          px: 1,
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {children &&
          Array.isArray(children)
            ? children.map((child, i) => (
                <Box key={i} sx={{ scrollSnapAlign: "start" }}>
                  {child}
                </Box>
              ))
            : children}
      </Box>
    </Box>
  );
};

export default HorizontalScroller;
