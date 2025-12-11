import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import type { User } from "@supabase/supabase-js";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const districts = [
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Kandy",
    "Matale",
    "Nuwara Eliya",
    "Galle",
    "Matara",
    "Hambantota",
    "Jaffna",
    "Kilinochchi",
    "Mannar",
    "Vavuniya",
    "Mullaitivu",
    "Batticaloa",
    "Ampara",
    "Trincomalee",
    "Kurunegala",
    "Puttalam",
    "Anuradhapura",
    "Polonnaruwa",
    "Badulla",
    "Monaragala",
    "Ratnapura",
    "Kegalle",
  ];

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileUpdatedAt, setProfileUpdatedAt] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");

  // Original values to track changes
  const [originalAddress, setOriginalAddress] = useState("");
  const [originalDistrict, setOriginalDistrict] = useState("");
  const [originalPhone1, setOriginalPhone1] = useState("");
  const [originalPhone2, setOriginalPhone2] = useState("");

  // --- Phone validation helper ---
  // const validatePhone = (value: string) => {
  //   if (value === "") return true; // Allow empty
  //   const sriLankaPattern = /^(?:\+94|94|0)?7\d{8}$/; // 07XXXXXXXX / +947XXXXXXXX / 947XXXXXXXX
  //   const international = /^[0-9]{7,15}$/;
  //   return sriLankaPattern.test(value);
  //   //  || international.test(value);
  // };

  const validatePhone = (value: string) => {
    if (value === "") return true; // allow empty for phone2
    const pattern = /^07\d{8}$/; // strictly 07XXXXXXXX
    return pattern.test(value);
  };

  // Check if there are changes
  const hasChanges =
    address !== originalAddress ||
    district !== originalDistrict ||
    phone1 !== originalPhone1 ||
    phone2 !== originalPhone2;

  // Check if all fields are valid
  const isValid = validatePhone(phone1) && validatePhone(phone2);

  const isSaveDisabled = saving || !hasChanges || !isValid;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/");
      return;
    }

    setUser(session.user);

    // Load profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (profile) {
      setProfileUpdatedAt(profile.updated_at || null);
      setAddress(profile.address || "");
      setDistrict(profile.district || "");
      setPhone1(profile.phone1 || "");
      setPhone2(profile.phone2 || "");

      // Store original values
      setOriginalAddress(profile.address || "");
      setOriginalDistrict(profile.district || "");
      setOriginalPhone1(profile.phone1 || "");
      setOriginalPhone2(profile.phone2 || "");
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (isSaveDisabled) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          // user_id: user?.id,
          full_name: user?.user_metadata?.full_name || "",
          address,
          district,
          phone1,
          phone2,
        })
        .eq("user_id", user?.id);

      if (error) {
        console.error(error.message);
        showNotification("Failed to save profile: " + error.message, "error");
      } else {
        showNotification("Profile saved successfully!", "success");

        // Update original values after successful save
        setOriginalAddress(address);
        setOriginalDistrict(district);
        setOriginalPhone1(phone1);
        setOriginalPhone2(phone2);
      }
    } catch (err) {
      showNotification("An unexpected error occurred", "error");
    } finally {
      setSaving(false);
    }
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

  const { user_metadata, email, created_at, last_sign_in_at } = user;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            justifyContent: "space-between",
          }}
        >
          {/* Left side: Avatar + Name + Email + Member Since */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              src={user_metadata?.avatar_url}
              alt={user_metadata?.full_name || email}
              sx={{ width: 80, height: 80 }}
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
              <Typography variant="body2" color="text.secondary">
                Member Since: {new Date(created_at || "").toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {/* Right side: Last Sign-In & Last Updated */}
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Last Sign-In: {new Date(last_sign_in_at || "").toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last Updated:{" "}
              {profileUpdatedAt
                ? new Date(profileUpdatedAt).toLocaleString()
                : "N/A"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Editable Info */}
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <TextField
            label="Address"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
          />

          <FormControl fullWidth>
            <InputLabel id="district-label">District *</InputLabel>
            <Select
              labelId="district-label"
              value={district}
              label="District *"
              onChange={(e) => setDistrict(e.target.value)}
            >
              {districts.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Telephone Number 1"
            fullWidth
            value={phone1}
            onChange={(e) => setPhone1(e.target.value)}
            error={phone1 !== "" && !validatePhone(phone1)}
            helperText={
              phone1 !== "" && !validatePhone(phone1)
                ? "Invalid phone number format"
                : "Format: 07XXXXXXXX"
            }
            placeholder="07XXXXXXXX"
          />
          <TextField
            label="Telephone Number 2"
            fullWidth
            value={phone2}
            onChange={(e) => setPhone2(e.target.value)}
            error={phone2 !== "" && !validatePhone(phone2)}
            helperText={
              phone2 !== "" && !validatePhone(phone2)
                ? "Invalid phone number format"
                : "Alternative contact number"
            }
            placeholder="07XXXXXXXX"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Action Buttons */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isSaveDisabled}
          fullWidth
        >
          {saving ? "Saving..." : "Save Profile"}
        </Button>

        {!hasChanges && isValid && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1, textAlign: "center" }}
          >
            No changes to save
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
