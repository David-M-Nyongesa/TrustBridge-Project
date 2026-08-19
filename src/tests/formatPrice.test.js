import { describe, it, expect } from "vitest";
import { formatPrice } from "../components/ListingCard";

describe("formatPrice", () => {
  it("formats monthly house prices", () => {
    expect(formatPrice({ price: 45000, priceUnit: "month" }))
      .toBe("KSh 45,000/mo");
  });

  it("formats weekly vehicle prices", () => {
    expect(formatPrice({ price: 4500, priceUnit: "week" }))
      .toBe("KSh 4,500/wk");
  });
});
