import React from "react";
import { Menu, MenuItem, Divider, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useNotification } from "../context/NotificationContext";

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ anchorEl, open, onClose }) => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const { showNotification } = useNotification();

  const userName = session?.user?.user_metadata?.full_name || session?.user?.email;
  const userEmail = session?.user?.email;

  const handleProfileClick = () => {
    navigate("/profile");
    onClose();
  };

  const handleOrdersClick = () => {
    navigate("/orders");
    onClose();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showNotification("Logged out successfully", "success");
      navigate("/");
      onClose();
    } catch (error) {
      showNotification("Failed to logout", "error");
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem disabled sx={{ opacity: 1 }}>
        <Box>
          <Box sx={{ fontWeight: 600 }}>{userName}</Box>
          <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
            {userEmail}
          </Box>
        </Box>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
      <MenuItem onClick={handleOrdersClick}>My Orders</MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );
};

export default ProfileMenu;