import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Checkbox,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";
import CartItem from "../components/cart/CartItem";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, total, shipping, clearCart } = useCart();
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

  // FORM STATE
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    district: "",
    phone1: "",
    phone2: "",
  });

  const [formOriginal, setFormOriginal] = useState({
    fullName: "",
    address: "",
    district: "",
    phone1: "",
    phone2: "",
  });

  const [user, setUser] = useState<User | null>(null);
  const [editable, setEditable] = useState(true); // guest default editable

  // PAYMENT
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const PARTIAL_DISCOUNT = 0.02;
  const FULL_DISCOUNT = 0.05;

  // ---- PRICE CALCULATIONS ---- //
  const originalTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountTotal = originalTotal - total;
  const subtotal = originalTotal - discountTotal;
  const finalTotal = subtotal + shipping;

  const fullDiscountAmount = subtotal * FULL_DISCOUNT;
  const fullPayAmount = subtotal - fullDiscountAmount + shipping;

  const partialDiscountAmount = subtotal * PARTIAL_DISCOUNT;
  const partialPayAmount = subtotal - partialDiscountAmount;

  // LOAD PROFILE
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Guest mode
      setUser(null);
      setEditable(true);
      return;
    }

    setUser(session.user);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (profile) {
      setForm({
        fullName: profile.full_name || "",
        address: profile.address || "",
        district: profile.district || "",
        phone1: profile.phone1 || "",
        phone2: profile.phone2 || "",
      });

      setFormOriginal({
        fullName: profile.full_name || "",
        address: profile.address || "",
        district: profile.district || "",
        phone1: profile.phone1 || "",
        phone2: profile.phone2 || "",
      });

      const isEmpty =
        profile.full_name === "" ||
        profile.address === "" ||
        profile.district === "" ||
        profile.phone1 === "" ||
        profile.phone2 === "";

      setEditable(isEmpty); // logged-in info locked by default
    }
  };

  // Generic form handler
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClickProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const validatePhone = (value: string) => {
    if (value === "") return true; // allow empty for phone2
    const pattern = /^07\d{8}$/; // strictly 07XXXXXXXX
    return pattern.test(value);
  };
  // VALIDATION – all required fields must be filled
  const isFormValid = () => {
    return (
      form.fullName.trim() !== "" &&
      form.address.trim() !== "" &&
      form.district.trim() !== "" &&
      form.phone1.trim() !== "" &&
      form.phone2.trim() !== "" &&
      validatePhone(form.phone1) &&
      validatePhone(form.phone2)
    );
  };

  const isGuest = !user;

  const placeOrder = async () => {
    try {
      const res = await fetch(
        "https://fdlwfmzzlshcjhsoqftd.supabase.co/functions/v1/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            user_id: user?.id ?? null,
            items: cart.map((i) => ({
              product_id: i.id,
              qty: i.quantity,
            })),
            customer: {
              name: form.fullName,
              address: form.address,
              district: form.district,
              phone1: form.phone1,
              phone2: form.phone2,
            },
            payment_method: paymentMethod,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      // alert("Order successful!");
      showNotification(`Order successful!`, "success");
      navigate("/");
      clearCart();
    } catch (err) {
      //alert(`Order failed: ${(err as Error).message}`);
      showNotification(`Order failed: ${(err as Error).message}`, "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 950, mx: "auto", p: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Checkout
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* LEFT SIDE – CUSTOMER INFO */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Customer Information
            </Typography>

            {!isGuest && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editable}
                    onChange={() => {
                      editable ? setForm(formOriginal) : null;
                      setEditable(!editable);
                    }}
                  />
                }
                label="Edit Information"
              />
            )}

            {isGuest && (
              <Box
                sx={{
                  background: "#fff3cd",
                  borderRadius: 2,
                  p: 1.5,
                  mb: 2,
                }}
              >
                <Typography color="warning.dark" fontWeight={600}>
                  You are checking out as a guest. Please fill all required
                  fields.
                </Typography>
              </Box>
            )}

            <TextField
              label="Full Name"
              fullWidth
              disabled={!editable}
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              error={form.fullName === ""}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Address"
              fullWidth
              disabled={!editable}
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter your delivery address"
              error={form.address === ""}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="district-label" error={form.district === ""}>
                District
              </InputLabel>
              <Select
                labelId="district-label"
                disabled={!editable}
                value={form.district}
                label="District *"
                onChange={(e) => handleChange("district", e.target.value)}
                error={form.district === ""}
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
              disabled={!editable}
              value={form.phone1}
              onChange={(e) => handleChange("phone1", e.target.value)}
              error={
                (form.phone1 !== "" && !validatePhone(form.phone1)) ||
                form.phone1 === ""
              }
              helperText={
                form.phone1 !== "" && !validatePhone(form.phone1)
                  ? "Invalid phone number format"
                  : null
              }
              placeholder="07XXXXXXXX"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Telephone Number 2"
              fullWidth
              disabled={!editable}
              value={form.phone2}
              onChange={(e) => handleChange("phone2", e.target.value)}
              error={
                (form.phone2 !== "" && !validatePhone(form.phone2)) ||
                form.phone2 === ""
              }
              helperText={
                form.phone2 !== "" && !validatePhone(form.phone2)
                  ? "Invalid phone number format"
                  : null
              }
              placeholder="07XXXXXXXX"
              sx={{ mb: 2 }}
            />
          </CardContent>
        </Card>

        {/* RIGHT SIDE – ORDER SUMMARY */}
        <Card sx={{ width: { xs: "100%", md: 380 } }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Order Summary
            </Typography>

            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onClickProduct={handleClickProduct}
              />
            ))}

            <Divider sx={{ my: 2 }} />

            {/* PRICE BREAKDOWN */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Subtotal</Typography>
                <Typography>Rs {originalTotal.toLocaleString()}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Discount</Typography>
                <Typography color="error.main">
                  - Rs {discountTotal.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Discounted Subtotal</Typography>
                <Typography>Rs {subtotal.toLocaleString()}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Shipping</Typography>
                <Typography>Rs {shipping.toLocaleString()}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={700}>Total</Typography>
                <Typography fontWeight={700} color="primary">
                  Rs {finalTotal.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            {/* PAYMENT METHODS */}
            <Typography mt={2} mb={1} fontWeight={600}>
              Choose Payment Method
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                {
                  key: "full",
                  title: "Pay Full Amount Online  (5% Discount)",
                  description: `Pay Rs ${fullPayAmount.toLocaleString()} now.`,
                },
                {
                  key: "partial",
                  title: "Pay Only Shipping (2% Discount)",
                  description: `Pay Rs ${shipping.toLocaleString()} now. Remaining: Rs ${partialPayAmount.toLocaleString()}.`,
                },
                {
                  key: "cod",
                  title: "Cash on Delivery",
                  description: `Pay Rs ${finalTotal.toLocaleString()} when items arrive.`,
                },
              ].map((pm) => (
                <Card
                  key={pm.key}
                  onClick={() => setPaymentMethod(pm.key)}
                  sx={{
                    p: 2,
                    border:
                      paymentMethod === pm.key
                        ? "2px solid #1976d2"
                        : "1px solid #ccc",
                    cursor: "pointer",
                    borderRadius: 2,
                  }}
                >
                  <Typography fontWeight={600}>{pm.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {pm.description}
                  </Typography>
                </Card>
              ))}
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={!isFormValid()}
              onClick={placeOrder}
            >
              {/* {paymentMethod === "cod" &&
                `Place Order (Pay Rs ${amountToPayLater.toFixed(
                  2
                )} on delivery)`}

              {paymentMethod === "full" &&
                `Pay Rs ${amountDueNow.toFixed(2)} Now`}

              {paymentMethod === "partial" &&
                `Pay Rs ${amountDueNow.toFixed(2)} Now`} */}
              Place Order
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
