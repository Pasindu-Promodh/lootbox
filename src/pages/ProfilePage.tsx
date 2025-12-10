// // pages/ProfilePage.tsx
// import React from "react";
// import { Box, Typography, Button, Avatar } from "@mui/material";
// import { useAuth } from "../AuthContext";
// import { supabase } from "../supabase";
// import { useNavigate } from "react-router-dom";

// const ProfilePage: React.FC = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   if (!user) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "70vh",
//         }}
//       >
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           You are not logged in.
//         </Typography>
//         <Button variant="contained" onClick={() => navigate("/")}>
//           Go to Home
//         </Button>
//       </Box>
//     );
//   }

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     navigate("/");
//   };

//   return (
//     <Box sx={{ maxWidth: 600, mx: "auto", mt: 8, p: 2 }}>
//       <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
//         <Avatar
//           src={user.user_metadata?.avatar_url || ""}
//           alt={user.user_metadata?.full_name || "User"}
//           sx={{ width: 80, height: 80 }}
//         />
//         <Box>
//           <Typography variant="h5">{user.user_metadata?.full_name}</Typography>
//           <Typography variant="body1" color="text.secondary">
//             {user.email}
//           </Typography>
//         </Box>
//       </Box>

//       <Box sx={{ display: "flex", gap: 2 }}>
//         <Button variant="contained" color="primary" onClick={handleLogout}>
//           Logout
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default ProfilePage;

// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Container,
//   Paper,
//   Avatar,
//   Typography,
//   Button,
//   CircularProgress,
//   Divider,
//   Grid,
// } from '@mui/material';
// import { supabase } from '../supabase';
// import { useNavigate } from 'react-router-dom';
// import type { User } from '@supabase/supabase-js';

// const Profile: React.FC = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkUser();
//   }, []);

//   const checkUser = async () => {
//     const { data: { session } } = await supabase.auth.getSession();

//     if (!session) {
//       navigate('/');
//       return;
//     }

//     setUser(session.user);
//     setLoading(false);
//   };

//   const handleSignOut = async () => {
//     await supabase.auth.signOut();
//     navigate('/');
//   };

//   if (loading) {
//     return (
//       <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
//         <CircularProgress />
//       </Container>
//     );
//   }

//   if (!user) {
//     return null;
//   }

//   const { user_metadata, email, created_at } = user;

//   return (
//     <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//           <Avatar
//             src={user_metadata?.avatar_url}
//             alt={user_metadata?.full_name || email}
//             sx={{ width: 80, height: 80, mr: 3 }}
//           >
//             {user_metadata?.full_name?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase()}
//           </Avatar>
//           <Box>
//             <Typography variant="h5" fontWeight={600}>
//               {user_metadata?.full_name || 'User'}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {email}
//             </Typography>
//           </Box>
//         </Box>

//         <Divider sx={{ my: 3 }} />

//         <Typography variant="h6" gutterBottom>
//           Account Information
//         </Typography>

//         <Grid container spacing={2} sx={{ mt: 1 }}>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="body2" color="text.secondary">
//               Full Name
//             </Typography>
//             <Typography variant="body1" fontWeight={500}>
//               {user_metadata?.full_name || 'Not provided'}
//             </Typography>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <Typography variant="body2" color="text.secondary">
//               Email
//             </Typography>
//             <Typography variant="body1" fontWeight={500}>
//               {email}
//             </Typography>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <Typography variant="body2" color="text.secondary">
//               Provider
//             </Typography>
//             <Typography variant="body1" fontWeight={500}>
//               Google
//             </Typography>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <Typography variant="body2" color="text.secondary">
//               Member Since
//             </Typography>
//             <Typography variant="body1" fontWeight={500}>
//               {new Date(created_at || '').toLocaleDateString()}
//             </Typography>
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 3 }} />

//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             variant="outlined"
//             color="error"
//             onClick={handleSignOut}
//           >
//             Sign Out
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={() => navigate('/orders')}
//           >
//             View Orders
//           </Button>
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/");
      return;
    }

    setUser(session.user);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!user) return null;

  const { user_metadata, email, created_at } = user;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            src={user_metadata?.avatar_url}
            alt={user_metadata?.full_name || email}
            sx={{ width: 80, height: 80, mr: 3 }}
          >
            {user_metadata?.full_name?.charAt(0).toUpperCase() ||
              email?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {user_metadata?.full_name || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Account Info */}
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            gap: 3,
            mt: 1,
          }}
        >
          {/* Full Name */}
          <Box sx={{ flex: "1 1 45%" }}>
            <Typography variant="body2" color="text.secondary">
              Full Name
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {user_metadata?.full_name || "Not provided"}
            </Typography>
          </Box>

          {/* Email */}
          <Box sx={{ flex: "1 1 45%" }}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {email}
            </Typography>
          </Box>

          {/* Provider */}
          <Box sx={{ flex: "1 1 45%" }}>
            <Typography variant="body2" color="text.secondary">
              Provider
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              Google
            </Typography>
          </Box>

          {/* Member Since */}
          <Box sx={{ flex: "1 1 45%" }}>
            <Typography variant="body2" color="text.secondary">
              Member Since
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {new Date(created_at || "").toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" color="error" onClick={handleSignOut}>
            Sign Out
          </Button>
          <Button variant="outlined" onClick={() => navigate("/orders")}>
            View Orders
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
