import React, { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  InputBase,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Paper,
  ClickAwayListener,
  useTheme,
  useMediaQuery,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

// Sample products for live search (with image + price)
const products = [
  { id: 1, name: 'Wireless Earbuds', price: 25, category: 'Electronics', img: 'https://placehold.co/100x70?text=Earbuds' },
  { id: 2, name: 'Smartwatch', price: 50, category: 'Electronics', img: 'https://placehold.co/100x70?text=Smartwatch' },
  { id: 3, name: 'Phone Case', price: 10, category: 'Accessories', img: 'https://placehold.co/100x70?text=Phone+Case' },
  { id: 4, name: 'USB Charger', price: 15, category: 'Electronics', img: 'https://placehold.co/100x70?text=USB+Charger' },
  { id: 5, name: 'Bluetooth Speaker', price: 30, category: 'Electronics', img: 'https://placehold.co/100x70?text=Speaker' },
  { id: 6, name: 'LED Lamp', price: 20, category: 'Home', img: 'https://placehold.co/100x70?text=LED+Lamp' },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const searchRef = useRef<HTMLDivElement | null>(null);

  // Filter products live
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectProduct = (id: number) => {
    navigate(`/product/${id}`);
    setSearch('');
    setOpenDropdown(false);
    setDrawerOpen(false);
  };

  const menuItems = [
    { text: 'Home', onClick: () => { navigate('/'); setDrawerOpen(false); } },
    { text: 'Shop', onClick: () => { navigate('/shop'); setDrawerOpen(false); } },
    { text: 'Cart', onClick: () => { alert('Cart clicked'); setDrawerOpen(false); } },
    { text: 'Login', onClick: () => { alert('Login clicked'); setDrawerOpen(false); } },
  ];

  const renderLiveSearch = () => (
    <Paper
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 10,
        maxHeight: 300,
        overflowY: 'auto',
        mt: 0.5,
        p: 1,
      }}
    >
      {filteredProducts.length === 0 && (
        <Typography variant="body2" sx={{ p: 1, color: 'text.secondary' }}>
          No results found
        </Typography>
      )}
      {filteredProducts.map((p) => (
        <Card
          key={p.id}
          onClick={() => handleSelectProduct(p.id)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1,
            cursor: 'pointer',
            boxShadow: 1,
            '&:hover': { boxShadow: 3 },
          }}
        >
          <CardMedia
            component="img"
            image={p.img}
            alt={p.name}
            sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1 }}
          />
          <CardContent sx={{ flexGrow: 1, py: 0.5, px: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              {p.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ${p.price} • {p.category}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Paper>
  );

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{ cursor: 'pointer' }}
            onClick={() => { navigate('/'); setDrawerOpen(false); }}
          >
            LootBox
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box sx={{ width: 250, p: 2 }}>
                  {/* Search bar */}
                  <ClickAwayListener onClickAway={() => setOpenDropdown(false)}>
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <InputBase
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setOpenDropdown(true); }}
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          padding: '4px 8px',
                          borderRadius: 1,
                          width: '100%',
                        }}
                      />
                      {openDropdown && search && renderLiveSearch()}
                    </Box>
                  </ClickAwayListener>

                  <Divider sx={{ mb: 1 }} />
                  <List>
                    {menuItems.map((item) => (
                      <ListItem key={item.text} disablePadding>
                        <ListItemButton onClick={item.onClick}>
                          <ListItemText primary={item.text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }} ref={searchRef}>
              <ClickAwayListener onClickAway={() => setOpenDropdown(false)}>
                <Box sx={{ position: 'relative' }}>
                  <InputBase
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setOpenDropdown(true); }}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      padding: '4px 8px',
                      borderRadius: 1,
                      color: '#fff',
                      minWidth: 250,
                    }}
                  />
                  {openDropdown && search && renderLiveSearch()}
                </Box>
              </ClickAwayListener>

              {menuItems.map((item) => (
                <Button key={item.text} color="inherit" onClick={item.onClick}>
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
