// import React from "react";
// import { Paper, Card, CardMedia, CardContent, Typography } from "@mui/material";

// interface SearchResultsProps {
//   products: typeof import("../data/products").ALL_PRODUCTS;
//   width?: string | number;
//   onSelect: (id: number) => void;
// }

// const SearchResults: React.FC<SearchResultsProps> = ({ products, width = 250, onSelect }) => {

//   if (products.length === 0) {
//     return (
//       <Paper
//         sx={{
//           mt: 0.5,
//           maxHeight: 300,
//           overflowY: "auto",
//           width,
//           margin: typeof width === "number" ? undefined : "0 auto",
//           p: 1,
//         }}
//       >
//         <Typography variant="body2" sx={{ p: 1, color: "text.secondary" }}>
//           No results found
//         </Typography>
//       </Paper>
//     );
//   }

//   return (
//     <Paper
//       sx={{
//         mt: 0.5,
//         maxHeight: 300,
//         overflowY: "auto",
//         width,
//         margin: typeof width === "number" ? undefined : "0 auto",
//       }}
//     >
//       {products.map((p) => (
//         <Card
//           key={p.id}
//           onClick={() => onSelect(p.id)}
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             mb: 1,
//             cursor: "pointer",
//             boxShadow: 1,
//             "&:hover": { boxShadow: 3 },
//           }}
//         >
//           <CardMedia
//             component="img"
//             image={p.images?.[0]}
//             alt={p.name}
//             sx={{ width: 80, height: 60, objectFit: "cover", borderRadius: 1 }}
//           />
//           <CardContent sx={{ flexGrow: 1, py: 0.5, px: 1 }}>
//             <Typography variant="body2" fontWeight={600}>
//               {p.name}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               ${p.price} • {p.category}
//             </Typography>
//           </CardContent>
//         </Card>
//       ))}
//     </Paper>
//   );
// };

// export default SearchResults;
