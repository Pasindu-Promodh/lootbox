// import React from 'react';
// import { Container, Grid, Typography, Button, Card, CardContent, CardMedia, Box } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const products = [
//   { id: 1, name: 'Wireless Earbuds', price: 25, img: 'https://placehold.co/300x200?text=Earbuds&bg=eee&fg=333' },
//   { id: 2, name: 'Smartwatch', price: 50, img: 'https://placehold.co/300x200?text=Smartwatch&bg=eee&fg=333' },
//   { id: 3, name: 'Phone Case', price: 10, img: 'https://placehold.co/300x200?text=Phone+Case&bg=eee&fg=333' },
//   { id: 4, name: 'USB Charger', price: 15, img: 'https://placehold.co/300x200?text=USB+Charger&bg=eee&fg=333' },
//   { id: 5, name: 'Bluetooth Speaker', price: 30, img: 'https://placehold.co/300x200?text=Speaker&bg=eee&fg=333' },
//   { id: 6, name: 'LED Lamp', price: 20, img: 'https://placehold.co/300x200?text=LED+Lamp&bg=eee&fg=333' },
// ];

// const HomePage: React.FC = () => {
//   const navigate = useNavigate();

//   const handleAddToCart = (event: React.MouseEvent, productId: number) => {
//     event.stopPropagation(); // <-- prevents Card click
//     console.log(`Product ${productId} added to cart`);
//     // TODO: Add your cart logic here
//   };

//   return (
//     <div>
//       {/* Hero Section */}
//       <Box
//         sx={{
//           backgroundImage: 'url(https://placehold.co/1200x400?text=LootBox&bg=555&fg=fff)',
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           color: '#fff',
//           py: { xs: 6, md: 12 },
//           textAlign: 'center',
//         }}
//       >
//         <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
//           Shop the Best Deals!
//         </Typography>
//         <Typography variant="h6" sx={{ mb: 3, px: { xs: 2, md: 0 } }}>
//           Find your favorite gadgets, accessories, and more at amazing prices.
//         </Typography>
//         <Button variant="contained" color="secondary" size="large">
//           Start Shopping
//         </Button>
//       </Box>

//       {/* Featured Products */}
//       <Container sx={{ my: 6 }}>
//         <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
//           Featured Products
//         </Typography>
//         <Grid container spacing={4} justifyContent="center">
//           {products.map((product) => (
//             <Grid item xs={12} sm={6} md={4} key={product.id} display="flex" justifyContent="center">
//               <Card
//                 onClick={() => navigate(`/product/${product.id}`)}
//                 sx={{
//                   maxWidth: 345,
//                   cursor: 'pointer',
//                   transition: 'transform 0.3s',
//                   '&:hover': { transform: 'scale(1.05)' },
//                   display: 'flex',
//                   flexDirection: 'column',
//                   height: '100%',
//                 }}
//               >
//                 <CardMedia
//                   component="img"
//                   height="200"
//                   image={product.img}
//                   alt={product.name}
//                 />
//                 <CardContent sx={{ flexGrow: 1 }}>
//                   <Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
//                     {product.name}
//                   </Typography>
//                   <Typography variant="body1" color="text.secondary">
//                     ${product.price}
//                   </Typography>
//                 </CardContent>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   color="primary"
//                   sx={{ borderRadius: 0 }}
//                   onClick={(e) => handleAddToCart(e, product.id)}
//                 >
//                   Add to Cart
//                 </Button>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </div>
//   );
// };

// export default HomePage;


import React from 'react';
import { Container, Typography, Button, Card, CardContent, CardMedia, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const products = [
  { id: 1, name: 'Wireless Earbuds', price: 25, img: 'https://placehold.co/300x200?text=Earbuds&bg=eee&fg=333' },
  { id: 2, name: 'Smartwatch', price: 50, img: 'https://placehold.co/300x200?text=Smartwatch&bg=eee&fg=333' },
  { id: 3, name: 'Phone Case', price: 10, img: 'https://placehold.co/300x200?text=Phone+Case&bg=eee&fg=333' },
  { id: 4, name: 'USB Charger', price: 15, img: 'https://placehold.co/300x200?text=USB+Charger&bg=eee&fg=333' },
  { id: 5, name: 'Bluetooth Speaker', price: 30, img: 'https://placehold.co/300x200?text=Speaker&bg=eee&fg=333' },
  { id: 6, name: 'LED Lamp', price: 20, img: 'https://placehold.co/300x200?text=LED+Lamp&bg=eee&fg=333' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddToCart = (event: React.MouseEvent, productId: number) => {
    event.stopPropagation(); // prevents Card click
    console.log(`Product ${productId} added to cart`);
    // TODO: Add your cart logic here
  };

  return (
    <div>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'url(https://placehold.co/1200x400?text=LootBox&bg=555&fg=fff)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          py: { xs: 6, md: 12 },
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          Shop the Best Deals!
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, px: { xs: 2, md: 0 } }}>
          Find your favorite gadgets, accessories, and more at amazing prices.
        </Typography>
        <Button variant="contained" color="secondary" size="large">
          Start Shopping
        </Button>
      </Box>

      {/* Featured Products */}
      <Container sx={{ my: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Featured Products
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center',
          }}
        >
          {products.map((product) => (
            <Card
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              sx={{
                width: { xs: '100%', sm: 'calc(50% - 16px)', md: 345 },
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.img}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  ${product.price}
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
    </div>
  );
};

export default HomePage;
