import React from "react";
import { Card, CardContent, Box, Skeleton } from "@mui/material";

type Props = {
  sx?: object;
};

const ProductCardSkeleton: React.FC<Props> = ({sx}) => {
  return (
    <Card
      sx={{
        ...sx,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* 1:1 Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          pt: "100%",
          bgcolor: "grey.100",
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={20} />
        {/* <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="20%" height={20} />
          <Skeleton variant="text" width="20%" height={20} />
        </Box> */}
      </CardContent>

      {/* Add to Cart Button */}
      <Skeleton variant="rectangular" height={40} />
    </Card>
  );
};

export default ProductCardSkeleton;
