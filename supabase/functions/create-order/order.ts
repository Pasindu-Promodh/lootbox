// Pure order logic for the create-order edge function: request validation
// and pricing. No Deno or Supabase APIs here, so it is unit-tested with
// Vitest from the storefront (tests/order.test.ts).

export interface CartItem {
  product_id: string;
  qty: number;
}

export interface Customer {
  name: string;
  address: string;
  district: string;
  phone1: string;
  phone2: string;
}

export interface ProductRow {
  id: string;
  name: string;
  original_price: number | string;
  pre_discount_price: number | string;
  price: number | string;
  in_stock: boolean;
  /** null = stock isn't tracked for this product (in_stock flag only). */
  stock?: number | null;
}

export const SHIPPING_FEE = 350;
export const MAX_LINE_ITEMS = 20;
export const MAX_QTY_PER_ITEM = 10;
export const PAYMENT_METHODS = ["cod"];
const PHONE_PATTERN = /^07\d{8}$/;

export const DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Monaragala", "Ratnapura", "Kegalle",
];

/** Errors whose message is safe to show the customer (sent as HTTP 400). */
export class ValidationError extends Error {}

function isNonEmptyString(value: unknown, maxLength: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

/** Validates the request body and merges duplicate product lines. */
export function parseOrderRequest(body: unknown): {
  items: CartItem[];
  customer: Customer;
  paymentMethod: string;
} {
  const { items, customer, payment_method } = (body ?? {}) as Record<string, unknown>;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError("Cart is empty");
  }
  if (items.length > MAX_LINE_ITEMS) {
    throw new ValidationError("Too many items in cart");
  }

  const merged = new Map<string, number>();
  for (const item of items as Partial<CartItem>[]) {
    if (!isNonEmptyString(item?.product_id, 64)) {
      throw new ValidationError("Invalid product");
    }
    const qty = item.qty;
    if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1) {
      throw new ValidationError("Invalid quantity");
    }
    merged.set(item.product_id, (merged.get(item.product_id) ?? 0) + qty);
  }
  for (const qty of merged.values()) {
    if (qty > MAX_QTY_PER_ITEM) {
      throw new ValidationError(`Maximum ${MAX_QTY_PER_ITEM} of each item per order`);
    }
  }

  const c = (customer ?? {}) as Record<string, unknown>;
  if (!isNonEmptyString(c.name, 100)) throw new ValidationError("Name is required");
  if (!isNonEmptyString(c.address, 300)) throw new ValidationError("Address is required");
  if (typeof c.district !== "string" || !DISTRICTS.includes(c.district)) {
    throw new ValidationError("Invalid district");
  }
  if (typeof c.phone1 !== "string" || !PHONE_PATTERN.test(c.phone1)) {
    throw new ValidationError("Invalid phone number");
  }
  if (typeof c.phone2 !== "string" || !PHONE_PATTERN.test(c.phone2) || c.phone2 === c.phone1) {
    throw new ValidationError("Invalid alternative phone number");
  }

  if (typeof payment_method !== "string" || !PAYMENT_METHODS.includes(payment_method)) {
    throw new ValidationError("Invalid payment method");
  }

  return {
    items: [...merged].map(([product_id, qty]) => ({ product_id, qty })),
    customer: {
      name: c.name.trim(),
      address: c.address.trim(),
      district: c.district,
      phone1: c.phone1,
      phone2: c.phone2,
    },
    paymentMethod: payment_method,
  };
}

/**
 * Prices an order from database rows only — client-sent prices are never
 * used. Throws ValidationError for missing or unavailable products.
 */
export function priceOrder(items: CartItem[], products: ProductRow[]) {
  let subtotal = 0;
  let preDiscountSubtotal = 0;
  let profit = 0;

  const verifiedItems = items.map((item) => {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) throw new ValidationError("A product in your cart no longer exists");
    if (!product.in_stock) throw new ValidationError(`${product.name} is out of stock`);
    if (product.stock != null && product.stock < item.qty) {
      throw new ValidationError(
        product.stock > 0
          ? `Only ${product.stock} of ${product.name} left in stock`
          : `${product.name} is out of stock`
      );
    }

    const originalPrice = Number(product.original_price);
    const preDiscountPrice = Number(product.pre_discount_price);
    const price = Number(product.price);

    preDiscountSubtotal += preDiscountPrice * item.qty;
    subtotal += price * item.qty;

    const itemProfit = (price - originalPrice) * item.qty;
    profit += itemProfit;

    return {
      product_id: item.product_id,
      product_name: product.name,
      qty: item.qty,
      original_price: originalPrice,
      pre_discount_price: preDiscountPrice,
      price,
      profit: itemProfit,
    };
  });

  return {
    verifiedItems,
    subtotal,
    preDiscountSubtotal,
    discount: preDiscountSubtotal - subtotal,
    shipping: SHIPPING_FEE,
    total: subtotal + SHIPPING_FEE,
    profit,
  };
}

/**
 * Strips WhatsApp formatting characters so customer input can't restyle or
 * spoof parts of the owner notification.
 */
export function plain(text: string) {
  return text.replace(/[*_~`]/g, "");
}
