import { describe, expect, it } from "vitest";
import {
  DISTRICTS,
  SHIPPING_FEE,
  arePhonesDifferent,
  discountPercent,
  formatPrice,
  validatePhone,
} from "../src/utils/checkout";
import * as server from "../supabase/functions/create-order/order.ts";

describe("checkout helpers", () => {
  it("validates Sri Lankan mobile numbers", () => {
    expect(validatePhone("0771234567")).toBe(true);
    expect(validatePhone("")).toBe(true); // emptiness is checked by callers
    expect(validatePhone("771234567")).toBe(false);
    expect(validatePhone("07712345678")).toBe(false);
    expect(validatePhone("+94771234567")).toBe(false);
  });

  it("only compares phones when both are filled", () => {
    expect(arePhonesDifferent("0771234567", "0771234567")).toBe(false);
    expect(arePhonesDifferent("0771234567", "")).toBe(true);
  });

  it("formats prices and discount percentages", () => {
    expect(formatPrice(1500)).toBe(`Rs ${(1500).toLocaleString()}`);
    expect(discountPercent(1500, 1200)).toBe(20);
    expect(discountPercent(0, 1200)).toBe(0); // no divide-by-zero
  });
});

// The client and the edge function each keep a copy of these rules.
describe("client and server rules stay in sync", () => {
  it("uses the same shipping fee", () => {
    expect(SHIPPING_FEE).toBe(server.SHIPPING_FEE);
  });

  it("uses the same district list", () => {
    expect([...DISTRICTS].sort()).toEqual([...server.DISTRICTS].sort());
  });
});
