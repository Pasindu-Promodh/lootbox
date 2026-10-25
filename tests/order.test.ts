import { describe, expect, it } from "vitest";
import {
  MAX_QTY_PER_ITEM,
  SHIPPING_FEE,
  ValidationError,
  parseOrderRequest,
  plain,
  priceOrder,
  type ProductRow,
} from "../supabase/functions/create-order/order.ts";

const validBody = () => ({
  items: [{ product_id: "p1", qty: 1 }],
  customer: {
    name: "  Nimal Perera ",
    address: "12 Galle Road",
    district: "Colombo",
    phone1: "0771234567",
    phone2: "0712345678",
  },
  payment_method: "cod",
});

const product = (overrides: Partial<ProductRow> = {}): ProductRow => ({
  id: "p1",
  name: "Phone Case",
  original_price: 600,
  pre_discount_price: 1500,
  price: 1200,
  in_stock: true,
  ...overrides,
});

describe("parseOrderRequest", () => {
  it("accepts a valid order and trims customer text", () => {
    const parsed = parseOrderRequest(validBody());
    expect(parsed.items).toEqual([{ product_id: "p1", qty: 1 }]);
    expect(parsed.customer.name).toBe("Nimal Perera");
    expect(parsed.paymentMethod).toBe("cod");
  });

  it("merges duplicate product lines", () => {
    const body = validBody();
    body.items = [
      { product_id: "p1", qty: 2 },
      { product_id: "p1", qty: 3 },
    ];
    expect(parseOrderRequest(body).items).toEqual([{ product_id: "p1", qty: 5 }]);
  });

  it.each([
    ["negative", -5],
    ["zero", 0],
    ["fractional", 1.5],
    ["string", "2"],
  ])("rejects a %s quantity", (_label, qty) => {
    const body = validBody();
    body.items = [{ product_id: "p1", qty: qty as number }];
    expect(() => parseOrderRequest(body)).toThrow(ValidationError);
  });

  it("rejects more than the per-item maximum, including across merged lines", () => {
    const body = validBody();
    body.items = [
      { product_id: "p1", qty: MAX_QTY_PER_ITEM },
      { product_id: "p1", qty: 1 },
    ];
    expect(() => parseOrderRequest(body)).toThrow(/Maximum/);
  });

  it("rejects an empty cart and a missing body", () => {
    expect(() => parseOrderRequest({ ...validBody(), items: [] })).toThrow(/empty/);
    expect(() => parseOrderRequest(undefined)).toThrow(ValidationError);
  });

  it("rejects bad customer details", () => {
    const cases: Array<Partial<ReturnType<typeof validBody>["customer"]>> = [
      { name: "" },
      { address: "   " },
      { district: "Atlantis" },
      { phone1: "123" },
      { phone2: "0771234567" }, // same as phone1
    ];
    for (const change of cases) {
      const body = validBody();
      body.customer = { ...body.customer, ...change };
      expect(() => parseOrderRequest(body)).toThrow(ValidationError);
    }
  });

  it("rejects unknown payment methods", () => {
    expect(() => parseOrderRequest({ ...validBody(), payment_method: "free" })).toThrow(
      /payment/
    );
  });
});

describe("priceOrder", () => {
  it("computes totals from database prices", () => {
    const priced = priceOrder([{ product_id: "p1", qty: 2 }], [product()]);

    expect(priced.preDiscountSubtotal).toBe(3000);
    expect(priced.subtotal).toBe(2400);
    expect(priced.discount).toBe(600);
    expect(priced.shipping).toBe(SHIPPING_FEE);
    expect(priced.total).toBe(2400 + SHIPPING_FEE);
    expect(priced.profit).toBe((1200 - 600) * 2);
    expect(priced.verifiedItems[0]).toMatchObject({ product_name: "Phone Case", qty: 2 });
  });

  it("coerces numeric strings returned by Postgres", () => {
    const priced = priceOrder(
      [{ product_id: "p1", qty: 1 }],
      [product({ price: "1200.00", pre_discount_price: "1500", original_price: "600" })]
    );
    expect(priced.total).toBe(1200 + SHIPPING_FEE);
  });

  it("rejects missing and out-of-stock products", () => {
    expect(() => priceOrder([{ product_id: "nope", qty: 1 }], [product()])).toThrow(
      /no longer exists/
    );
    expect(() =>
      priceOrder([{ product_id: "p1", qty: 1 }], [product({ in_stock: false })])
    ).toThrow(/out of stock/);
  });

  it("enforces tracked stock but ignores untracked (null) stock", () => {
    expect(() =>
      priceOrder([{ product_id: "p1", qty: 3 }], [product({ stock: 2 })])
    ).toThrow(/Only 2/);
    expect(() =>
      priceOrder([{ product_id: "p1", qty: 3 }], [product({ stock: null })])
    ).not.toThrow();
  });
});

describe("plain", () => {
  it("strips WhatsApp formatting characters", () => {
    expect(plain("*Total: Rs 0* _x_ ~y~ `z`")).toBe("Total: Rs 0 x y z");
  });
});
