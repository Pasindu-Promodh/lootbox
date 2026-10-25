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
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import CartItem from "../components/cart/CartItem";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { getWhatsAppLink } from "../utils/whatsapp";
import { usePageTitle } from "../utils/usePageTitle";
import { clickable } from "../utils/a11y";
import {
  DISTRICTS,
  arePhonesDifferent,
  formatPrice,
  validatePhone,
} from "../utils/checkout";


const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  usePageTitle("Checkout");
  const { cart, total, shipping, clearCart, refreshCart } = useCart();
  const { showNotification } = useNotification();

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
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  // PAYMENT
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // ---- PRICE CALCULATIONS ---- //
  const originalTotal = React.useMemo(
    () => cart.reduce((sum, item) => sum + item.pre_discount_price * item.quantity, 0),
    [cart]
  );

  const discountTotal = React.useMemo(
    () => originalTotal - total,
    [originalTotal, total]
  );
  const subtotal = React.useMemo(
    () => originalTotal - discountTotal,
    [originalTotal, discountTotal]
  );
  const finalTotal = React.useMemo(
    () => subtotal + shipping,
    [subtotal, shipping]
  );

  // LOAD PROFILE, then refresh cart prices
  useEffect(() => {
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

        // Null and "" both count as missing, so an incomplete profile opens
        // in edit mode instead of a locked, empty form.
        const isIncomplete =
          !profile.full_name ||
          !profile.address ||
          !profile.district ||
          !profile.phone1 ||
          !profile.phone2;

        setEditable(isIncomplete); // complete logged-in info is locked by default
      }
    };

    loadProfile().then(() => refreshCart());
  }, [refreshCart]);

  // Generic form handler
  const handleChange = React.useCallback((field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleClickProduct = (productId: string) => {
    navigate(`/product/${productId}`);
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
      validatePhone(form.phone2) &&
      arePhonesDifferent(form.phone1, form.phone2)
    );
  };

  const isGuest = !user;

  const placeOrder = async () => {
    if (isPlacingOrder) return; // prevent double clicks
    setIsPlacingOrder(true);

    try {
      // Signed-in users send their own access token so the server can tie
      // the order to them; guests send the anon key.
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY
            }`,
          },
          body: JSON.stringify({
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

      const orderRef = String(data.order_id).slice(0, 8).toUpperCase();
      showNotification(
        `Order placed! Your order ID is #${orderRef}. We'll contact you to confirm.`,
        "success",
        6000
      );
      clearCart();
      navigate(user ? "/orders" : "/");
    } catch (err) {
      showNotification(`Order failed: ${(err as Error).message}`, "error");
    } finally {
      setIsPlacingOrder(false);
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
                      if (editable) setForm(formOriginal);
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
                label="District"
                onChange={(e) => handleChange("district", e.target.value)}
                error={form.district === ""}
              >
                {DISTRICTS.map((d) => (
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
                  : "Format: 07XXXXXXXX"
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
                form.phone2 === "" ||
                !validatePhone(form.phone2) ||
                !arePhonesDifferent(form.phone1, form.phone2)
              }
              helperText={
                form.phone2 === ""
                  ? "Alternative contact number is required"
                  : !validatePhone(form.phone2)
                  ? "Invalid phone number format"
                  : !arePhonesDifferent(form.phone1, form.phone2)
                  ? "Telephone Number 2 must be different from Telephone Number 1"
                  : "Alternative contact number"
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
                <Typography>{formatPrice(originalTotal)}</Typography>
              </Box>
              {discountTotal > 0 && (
                <>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Discount</Typography>
                    <Typography color="error.main">
                      - {formatPrice(discountTotal)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Discounted Subtotal</Typography>
                    <Typography>{formatPrice(subtotal)}</Typography>
                  </Box>
                </>
              )}

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Shipping</Typography>
                <Typography>{formatPrice(shipping)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={700}>Total</Typography>
                <Typography fontWeight={700} color="primary">
                  {formatPrice(finalTotal)}
                </Typography>
              </Box>
            </Box>

            {/* PAYMENT METHODS */}
            <Typography id="payment-method-label" mt={2} mb={1} fontWeight={600}>
              Choose Payment Method
            </Typography>

            <Box
              role="radiogroup"
              aria-labelledby="payment-method-label"
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              {[
                {
                  key: "cod",
                  title: "Cash on Delivery",
                  description: `Pay ${formatPrice(finalTotal)} when items arrive.`,
                },
              ].map((pm) => (
                <Card
                  key={pm.key}
                  {...clickable(() => setPaymentMethod(pm.key))}
                  role="radio"
                  aria-checked={paymentMethod === pm.key}
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
              disabled={!isFormValid() || cart.length === 0 || isPlacingOrder}
              onClick={placeOrder}
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </Button>

            <Button
              fullWidth
              variant="text"
              size="small"
              startIcon={<WhatsAppIcon sx={{ color: "#25D366" }} />}
              href={getWhatsAppLink("Hi, I need help with my order")}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mt: 1 }}
            >
              Need help? Chat with us on WhatsApp
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
