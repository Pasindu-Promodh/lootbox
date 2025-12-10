// import React from "react";
// import { Box, Typography, IconButton, Button, CardMedia } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useCart, type CartItem as CartItemType } from "../context/CartContext";

// interface Props {
//   item: CartItemType;
// }

// const CartItem: React.FC<Props> = ({ item }) => {
//   const { removeFromCart, updateQty } = useCart();

//   const handleIncrease = () => updateQty(item.id, item.quantity + 1);
//   const handleDecrease = () =>
//     updateQty(item.id, Math.max(item.quantity - 1, 1));

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         gap: 2,
//         mb: 2,
//         // p: 1.5,
//         borderRadius: 2,
//         boxShadow: 1,
//         transition: "transform 0.2s",
//         "&:hover": { transform: "scale(1.01)" },
//       }}
//     >
//       {item.image && (
//         <CardMedia
//           component="img"
//           src={item.image}
//           alt={item.name}
//           sx={{ width: 80, height: 80, borderRadius: 1, objectFit: "cover" }}
//         />
//       )}

//       <Box sx={{ flex: 1 }}>
//         <Typography
//           variant="body2"
//           fontWeight={500}
//           noWrap
//           sx={{ fontSize: "0.9rem" }}
//         >
//           {item.name}
//         </Typography>
//         <Typography variant="body2"
//             fontWeight={500}
//             sx={{ fontSize: "1.1rem", color: "primary.main" }}>
//           Rs {item.price} x {item.quantity} = Rs{" "}
//           {(item.price * item.quantity)}
//         </Typography>

//         <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
//           <Button
//             variant="outlined"
//             size="small"
//             onClick={handleDecrease}
//             sx={{ minWidth: 32 }}
//           >
//             -
//           </Button>
//           <Button
//             variant="outlined"
//             size="small"
//             onClick={handleIncrease}
//             sx={{ minWidth: 32 }}
//           >
//             +
//           </Button>
//         </Box>
//       </Box>

//       <IconButton onClick={() => removeFromCart(item.id)} color="error">
//         <DeleteIcon />
//       </IconButton>
//     </Box>
//   );
// };

// export default CartItem;

import React from "react";
import { Box, Typography, IconButton, Button, CardMedia } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart, type CartItem as CartItemType } from "../context/CartContext";

interface Props {
  item: CartItemType;
}

const CartItem: React.FC<Props> = ({ item }) => {
  const { removeFromCart, updateQty } = useCart();

  const handleIncrease = () => updateQty(item.id, item.quantity + 1);
  const handleDecrease = () =>
    updateQty(item.id, Math.max(item.quantity - 1, 1));

  // Calculate discount percentage if originalPrice exists
  // const discount =
  //   item.originalPrice && item.originalPrice > item.price
  //     ? Math.round(
  //         ((item.originalPrice - item.price) / item.originalPrice) * 100
  //       )
  //     : 0;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 2,
        borderRadius: 2,
        boxShadow: 1,
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.01)" },
      }}
    >
      {item.image && (
        <CardMedia
          component="img"
          src={item.image}
          alt={item.name}
          sx={{ width: 80, height: 80, borderRadius: 1, objectFit: "cover" }}
        />
      )}

      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body2"
          fontWeight={500}
          noWrap
          sx={{ fontSize: "0.9rem" }}
        >
          {item.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* <Typography
            variant="body2"
            fontWeight={500}
            sx={{ fontSize: "1.1rem", color: "primary.main" }}
          >
            Rs {item.price} x {item.quantity} = Rs {item.price * item.quantity}
          </Typography> */}

          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ fontSize: "1.1rem", color: "primary.main" }}
          >
            Rs {item.price}
          </Typography>

          {/* {discount > 0 && (
            <Typography
              variant="body2"
              sx={{ fontSize: "0.8rem", color: "text.secondary", ml: 1, textDecoration: "line-through" }}
            >
              Rs {item.originalPrice * item.quantity}
            </Typography>
          )}

          {discount > 0 && (
            <Typography
              variant="body2"
              color="error"
              sx={{ fontWeight: 600, ml: 1 }}
            >
              -{discount}%
            </Typography>
          )} */}
          {item.originalPrice && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through", fontSize: "0.75rem" }}
            >
              Rs {item.originalPrice}
            </Typography>
          )}
          {item.originalPrice && (
            <Typography
              variant="body2"
              color="error"
              fontWeight={600}
              sx={{ fontSize: "0.8rem" }}
            >
              {Math.round(
                ((item.originalPrice - item.price) / item.originalPrice) * 100
              )}
              % OFF
            </Typography>
          )}
        </Box>

        

        <Box sx={{ display: "flex", gap: 1, alignItems: "center"}}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDecrease}
            sx={{ minWidth: 32 }}
          >
            -
          </Button>
          <Typography
          variant="body2"
          fontWeight={500}
          sx={{ fontSize: "1.1rem", color: "text.primary" }}
        >
          {item.quantity}
        </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleIncrease}
            sx={{ minWidth: 32 }}
          >
            +
          </Button>

          <Typography
          variant="body2"
          fontWeight={500}
          sx={{ fontSize: "1.1rem", color: "primary.main" }}
        >
          = Rs {item.price * item.quantity}
        </Typography>
        </Box>
      </Box>

      <IconButton onClick={() => removeFromCart(item.id)} color="error">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default CartItem;
