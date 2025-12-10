// pages/ProfilePage.tsx
import React from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          You are not logged in.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </Box>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 8, p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Avatar
          src={user.user_metadata?.avatar_url || ""}
          alt={user.user_metadata?.full_name || "User"}
          sx={{ width: 80, height: 80 }}
        />
        <Box>
          <Typography variant="h5">{user.user_metadata?.full_name}</Typography>
          <Typography variant="body1" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePage;
