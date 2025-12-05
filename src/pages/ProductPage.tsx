// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Container, Typography, Button, Grid, CardMedia } from '@mui/material';

// const products = [
//   { id: 1, name: 'Wireless Earbuds', price: 25, img: 'https://placehold.co/500x400?text=Earbuds&bg=eee&fg=333', description: 'High quality wireless earbuds with long battery life.' },
//   { id: 2, name: 'Smartwatch', price: 50, img: 'https://placehold.co/500x400?text=Smartwatch&bg=eee&fg=333', description: 'Track your fitness and notifications with style.' },
//   { id: 3, name: 'Phone Case', price: 10, img: 'https://placehold.co/500x400?text=Phone+Case&bg=eee&fg=333', description: 'Durable and stylish phone case to protect your device.' },
//   { id: 4, name: 'USB Charger', price: 15, img: 'https://placehold.co/500x400?text=USB+Charger&bg=eee&fg=333', description: 'Fast USB charger for all your devices.' },
//   { id: 5, name: 'Bluetooth Speaker', price: 30, img: 'https://placehold.co/500x400?text=Speaker&bg=eee&fg=333', description: 'Portable Bluetooth speaker with clear sound.' },
//   { id: 6, name: 'LED Lamp', price: 20, img: 'https://placehold.co/500x400?text=LED+Lamp&bg=eee&fg=333', description: 'Stylish LED lamp to brighten up any room.' },
// ];

// const ProductPage: React.FC = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const product = products.find((p) => p.id === Number(id));

//   if (!product) {
//     return (
//       <Container sx={{ mt: 6, textAlign: 'center' }}>
//         <Typography variant="h4" gutterBottom>
//           Product not found
//         </Typography>
//         <Button variant="contained" onClick={() => navigate('/')}>
//           Back to Home
//         </Button>
//       </Container>
//     );
//   }

//   const handleAddToCart = () => {
//     console.log(`Added ${product.name} to cart`);
//     // TODO: Implement cart logic
//   };

//   return (
//     <Container sx={{ mt: 6 }}>
//       <Button variant="outlined" onClick={() => navigate('/')} sx={{ mb: 3 }}>
//         &larr; Back to Home
//       </Button>
//       <Grid container spacing={4}>
//         {/* Product Image */}
//         <Grid item xs={12} md={6}>
//           <CardMedia
//             component="img"
//             image={product.img}
//             alt={product.name}
//             sx={{ borderRadius: 2 }}
//           />
//         </Grid>

//         {/* Product Details */}
//         <Grid item xs={12} md={6}>
//           <Typography variant="h4" gutterBottom>
//             {product.name}
//           </Typography>
//           <Typography variant="h5" color="primary" gutterBottom>
//             ${product.price}
//           </Typography>
//           <Typography variant="body1" sx={{ mb: 4 }}>
//             {product.description}
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             size="large"
//             onClick={handleAddToCart}
//           >
//             Add to Cart
//           </Button>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default ProductPage;



import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, CardMedia } from '@mui/material';

const products = [
  { id: 1, name: 'Wireless Earbuds', price: 25, img: 'https://placehold.co/500x400?text=Earbuds&bg=eee&fg=333', description: 'High quality wireless earbuds with long battery life.' },
  { id: 2, name: 'Smartwatch', price: 50, img: 'https://placehold.co/500x400?text=Smartwatch&bg=eee&fg=333', description: 'Track your fitness and notifications with style.' },
  { id: 3, name: 'Phone Case', price: 10, img: 'https://placehold.co/500x400?text=Phone+Case&bg=eee&fg=333', description: 'Durable and stylish phone case to protect your device.' },
  { id: 4, name: 'USB Charger', price: 15, img: 'https://placehold.co/500x400?text=USB+Charger&bg=eee&fg=333', description: 'Fast USB charger for all your devices.' },
  { id: 5, name: 'Bluetooth Speaker', price: 30, img: 'https://placehold.co/500x400?text=Speaker&bg=eee&fg=333', description: 'Portable Bluetooth speaker with clear sound.' },
  { id: 6, name: 'LED Lamp', price: 20, img: 'https://placehold.co/500x400?text=LED+Lamp&bg=eee&fg=333', description: 'Stylish LED lamp to brighten up any room.' },
];

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <Container sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Product not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const handleAddToCart = () => {
    console.log(`Added ${product.name} to cart`);
    // TODO: Implement cart logic
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Button variant="outlined" onClick={() => navigate('/')} sx={{ mb: 3 }}>
        &larr; Back to Home
      </Button>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        {/* Product Image */}
        <Box sx={{ flex: 1 }}>
          <CardMedia
            component="img"
            image={product.img}
            alt={product.name}
            sx={{ borderRadius: 2, width: '100%' }}
          />
        </Box>

        {/* Product Details */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {product.description}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductPage;
