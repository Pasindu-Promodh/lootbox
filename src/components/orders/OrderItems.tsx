import { Box, Tooltip, Typography } from "@mui/material";
import type { OrderItem } from "../../types/order";

interface Props {
  items: OrderItem[];
  productMap: Record<string, any>;
  onClickProduct: (id: string) => void;
}

const OrderItems: React.FC<Props> = ({ items, productMap, onClickProduct }) => {
 
  return (
    <>
      {items.map((item, i) => {
        const product = productMap[item.product_id];
        return (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              pr: 1.5,
              borderRadius: 2,
              boxShadow: 1,
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.01)" },
            }}
            onClick={() => product && onClickProduct(product.id)}
          >
            {product?.images?.[0] && (
              <Box
                component="img"
                src={product.images[0]?.thumb}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  objectFit: "cover",
                }}
              />
            )}

            {/* <Box sx={{ flex: 1 }}> */}
            <Box
              sx={{
                flexGrow: 1,
                py: 0.5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 80,
                overflow: "hidden",
              }}
            >
              <Tooltip title={product?.name ?? "Product"}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  // noWrap sx={{maxWidth: isDesktop ? "50vw" : "25vw" }}
                  sx={{
                    fontSize: "0.9rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {product?.name ?? "Product"}
                </Typography>
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                Qty: {item.qty} × Rs {item.price.toLocaleString()}
              </Typography>
            </Box>

            <Typography fontWeight={600} sx={{ whiteSpace: "nowrap" }}>
              Rs {(item.qty * item.price).toLocaleString()}
            </Typography>
          </Box>
        );
      })}
    </>
  );
};
export default OrderItems;
