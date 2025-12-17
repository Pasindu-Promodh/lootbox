import { Box, Typography } from "@mui/material";
import type { OrderItem } from "../../types/order";

interface Props {
  items: OrderItem[];
  productMap: Record<string, any>;
  onClickProduct: (id: string) => void;
}

const OrderItems: React.FC<Props> = ({ items, productMap, onClickProduct }) => (
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
              src={product.images[0]}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 1,
                objectFit: "cover",
              }}
            />
          )}

          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={600}>
              {product?.name ?? "Product"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Qty: {item.qty} × Rs {item.price.toLocaleString()}
            </Typography>
          </Box>

          <Typography fontWeight={600}>
            Rs {(item.qty * item.price).toLocaleString()}
          </Typography>
        </Box>
      );
    })}
  </>
);

export default OrderItems;
