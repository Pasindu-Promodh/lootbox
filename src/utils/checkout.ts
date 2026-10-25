// Shared by checkout, profile and cart. The create-order edge function keeps
// its own copy of these rules — keep the two in sync.

export const SHIPPING_FEE = 350;

// Matches MAX_QTY_PER_ITEM in the create-order edge function.
export const MAX_QTY_PER_ITEM = 10;

// Max distinct products per order. Raise to allow multi-product carts.
export const MAX_CART_ITEMS = 1;

export const DISTRICTS = [
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

/** Empty is allowed here; callers decide whether a number is required. */
export const validatePhone = (value: string) =>
  value === "" || /^07\d{8}$/.test(value); // strictly 07XXXXXXXX

/** Only enforced when both numbers are filled in. */
export const arePhonesDifferent = (p1: string, p2: string) =>
  p1 === "" || p2 === "" || p1 !== p2;

export const formatPrice = (amount: number) => `Rs ${amount.toLocaleString()}`;

/** Percentage saved, or 0 when there's no valid original price. */
export const discountPercent = (preDiscountPrice: number, price: number) =>
  preDiscountPrice > 0
    ? Math.round(((preDiscountPrice - price) / preDiscountPrice) * 100)
    : 0;
