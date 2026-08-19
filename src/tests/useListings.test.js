import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useListings } from "../hooks/useListings";

const FAKE_LISTINGS = [
  { id: 1, type: "house", title: "2BR Kilimani", price: 45000,
    location: "Kilimani, Nairobi", ownerId: 2 },
  { id: 2, type: "car", title: "Axio for Bolt", price: 15000,
    location: "Westlands, Nairobi", ownerId: 3 },

  { id: "7o_LMV-RnLg", type: "house", title: "Bedsitter Rongai",
    price: 9000, location: "Rongai", ownerId: "2" },
];

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async () => ({
    ok: true,
    json: async () => FAKE_LISTINGS,
  })));
});

describe("useListings", () => {
  it("loads listings and turns off the loading flag", async () => {
    const { result } = renderHook(() => useListings({}));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.listings).toHaveLength(3);
    expect(result.current.error).toBeNull();
  });

  it("filters by max price on the client", async () => {
    const { result } = renderHook(() => useListings({ maxPrice: "10000" }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.listings.map((l) => l.title))
      .toEqual(["Bedsitter Rongai"]);
  });

  it("REGRESSION: ownerId matches even when stored as a string", async () => {
    const { result } = renderHook(() => useListings({ ownerId: 2 }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.listings).toHaveLength(2);
  });

  it("exposes the error instead of crashing when the server is down", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    const { result } = renderHook(() => useListings({}));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeTruthy();
    expect(result.current.listings).toEqual([]);
  });
});
