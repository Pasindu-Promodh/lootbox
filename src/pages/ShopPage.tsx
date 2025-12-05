// import React, { useState } from 'react';
// import {
//   Container,
//   Grid,
//   Typography,
//   Card,
//   CardContent,
//   CardMedia,
//   Button,
//   Box,
//   Chip,
//   FormControl,
//   Select,
//   MenuItem,
//   InputLabel,
// } from '@mui/material';
// import { useNavigate, useLocation } from 'react-router-dom';

// const products = [
//   { id: 1, name: 'Wireless Earbuds', price: 25, category: 'Electronics', img: 'https://placehold.co/300x200?text=Earbuds&bg=eee&fg=333' },
//   { id: 2, name: 'Smartwatch', price: 50, category: 'Electronics', img: 'https://placehold.co/300x200?text=Smartwatch&bg=eee&fg=333' },
//   { id: 3, name: 'Phone Case', price: 10, category: 'Accessories', img: 'https://placehold.co/300x200?text=Phone+Case&bg=eee&fg=333' },
//   { id: 4, name: 'USB Charger', price: 15, category: 'Electronics', img: 'https://placehold.co/300x200?text=USB+Charger&bg=eee&fg=333' },
//   { id: 5, name: 'Bluetooth Speaker', price: 30, category: 'Electronics', img: 'https://placehold.co/300x200?text=Speaker&bg=eee&fg=333' },
//   { id: 6, name: 'LED Lamp', price: 20, category: 'Home', img: 'https://placehold.co/300x200?text=LED+Lamp&bg=eee&fg=333' },
// ];

// const categories = ['All', 'Electronics', 'Accessories', 'Home'];

// const ShopPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const queryParams = new URLSearchParams(location.search);
//   const searchQuery = queryParams.get('search')?.toLowerCase() || '';

//   const [category, setCategory] = useState('All');
//   const [sort, setSort] = useState('default');

//   let filteredProducts = products.filter(
//     (p) =>
//       (category === 'All' || p.category === category) &&
//       p.name.toLowerCase().includes(searchQuery)
//   );

//   if (sort === 'price-asc') filteredProducts.sort((a, b) => a.price - b.price);
//   else if (sort === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price);

//   const handleAddToCart = (event: React.MouseEvent, productId: number) => {
//     event.stopPropagation();
//     console.log(`Product ${productId} added to cart`);
//   };

//   return (
//     <Container sx={{ mt: 6, mb: 6 }}>
//       <Typography variant="h4" gutterBottom textAlign="center" fontWeight={700}>
//         LootBox Shop
//       </Typography>
//       <Typography variant="subtitle1" gutterBottom textAlign="center" color="text.secondary">
//         Discover amazing products. Filter by category, sort by price, or search your favorites.
//       </Typography>

//       {/* Categories */}
//       <Box
//         sx={{
//           display: 'flex',
//           overflowX: 'auto',
//           py: 2,
//           gap: 1,
//           mb: 4,
//           justifyContent: { xs: 'flex-start', sm: 'center' },
//         }}
//       >
//         {categories.map((cat) => (
//           <Chip
//             key={cat}
//             label={cat}
//             clickable
//             color={category === cat ? 'primary' : 'default'}
//             onClick={() => setCategory(cat)}
//             sx={{
//               px: 2,
//               py: 1,
//               boxShadow: 1,
//               cursor: 'pointer',
//               fontWeight: category === cat ? 'bold' : 'normal',
//             }}
//           />
//         ))}
//       </Box>

//       {/* Sort */}
//       <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
//         <FormControl sx={{ minWidth: 150 }}>
//           <InputLabel>Sort</InputLabel>
//           <Select value={sort} label="Sort" onChange={(e) => setSort(e.target.value)}>
//             <MenuItem value="default">Default</MenuItem>
//             <MenuItem value="price-asc">Price: Low to High</MenuItem>
//             <MenuItem value="price-desc">Price: High to Low</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       {/* Products Grid */}
//       <Grid container spacing={4} justifyContent="center">
//         {filteredProducts.map((product) => (
//           <Grid item xs={12} sm={6} md={4} key={product.id} display="flex" justifyContent="center">
//             <Card
//               onClick={() => navigate(`/product/${product.id}`)}
//               sx={{
//                 maxWidth: 345,
//                 cursor: 'pointer',
//                 transition: 'transform 0.3s',
//                 '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
//                 display: 'flex',
//                 flexDirection: 'column',
//                 height: '100%',
//                 borderRadius: 3,
//                 overflow: 'hidden',
//               }}
//             >
//               <CardMedia
//                 component="img"
//                 height="200"
//                 image={product.img}
//                 alt={product.name}
//                 sx={{ objectFit: 'cover' }}
//               />
//               <CardContent sx={{ flexGrow: 1 }}>
//                 <Typography gutterBottom variant="h6" fontWeight={700}>
//                   {product.name}
//                 </Typography>
//                 <Typography variant="body1" color="primary" fontWeight={600}>
//                   ${product.price}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   {product.category}
//                 </Typography>
//               </CardContent>
//               <Button
//                 fullWidth
//                 variant="contained"
//                 color="primary"
//                 sx={{ borderRadius: 0 }}
//                 onClick={(e) => handleAddToCart(e, product.id)}
//               >
//                 Add to Cart
//               </Button>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default ShopPage;



import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const products = [
  { id: 1, name: 'Wireless Earbuds', price: 25, category: 'Electronics', img: 'https://placehold.co/300x200?text=Earbuds&bg=eee&fg=333' },
  { id: 2, name: 'Smartwatch', price: 50, category: 'Electronics', img: 'https://placehold.co/300x200?text=Smartwatch&bg=eee&fg=333' },
  { id: 3, name: 'Phone Case', price: 10, category: 'Accessories', img: 'https://placehold.co/300x200?text=Phone+Case&bg=eee&fg=333' },
  { id: 4, name: 'USB Charger', price: 15, category: 'Electronics', img: 'https://placehold.co/300x200?text=USB+Charger&bg=eee&fg=333' },
  { id: 5, name: 'Bluetooth Speaker', price: 30, category: 'Electronics', img: 'https://placehold.co/300x200?text=Speaker&bg=eee&fg=333' },
  { id: 6, name: 'LED Lamp', price: 20, category: 'Home', img: 'https://placehold.co/300x200?text=LED+Lamp&bg=eee&fg=333' },
];

const categories = ['All', 'Electronics', 'Accessories', 'Home'];

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search')?.toLowerCase() || '';

  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('default');

  let filteredProducts = products.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      p.name.toLowerCase().includes(searchQuery)
  );

  if (sort === 'price-asc') filteredProducts.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price);

  const handleAddToCart = (event: React.MouseEvent, productId: number) => {
    event.stopPropagation();
    console.log(`Product ${productId} added to cart`);
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight={700}>
        LootBox Shop
      </Typography>
      <Typography variant="subtitle1" gutterBottom textAlign="center" color="text.secondary">
        Discover amazing products. Filter by category, sort by price, or search your favorites.
      </Typography>

      {/* Categories */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          py: 2,
          gap: 1,
          mb: 4,
          justifyContent: { xs: 'flex-start', sm: 'center' },
        }}
      >
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            clickable
            color={category === cat ? 'primary' : 'default'}
            onClick={() => setCategory(cat)}
            sx={{
              px: 2,
              py: 1,
              boxShadow: 1,
              cursor: 'pointer',
              fontWeight: category === cat ? 'bold' : 'normal',
            }}
          />
        ))}
      </Box>

      {/* Sort */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort</InputLabel>
          <Select value={sort} label="Sort" onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Products */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center',
        }}
      >
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            sx={{
              width: { xs: '100%', sm: 'calc(50% - 16px)', md: 345 },
              cursor: 'pointer',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={product.img}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" fontWeight={700}>
                {product.name}
              </Typography>
              <Typography variant="body1" color="primary" fontWeight={600}>
                ${product.price}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {product.category}
              </Typography>
            </CardContent>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ borderRadius: 0 }}
              onClick={(e) => handleAddToCart(e, product.id)}
            >
              Add to Cart
            </Button>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default ShopPage;
