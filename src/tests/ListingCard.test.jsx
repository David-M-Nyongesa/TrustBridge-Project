import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ListingCard from "../components/ListingCard";

const LISTING = {
  id: 1, type: "house", title: "2BR apartment, Kilimani",
  price: 45000, priceUnit: "month",
  location: "Kilimani, Nairobi", verified: true, status: "available",
};

function renderCard(listing) {
  return render(
    <MemoryRouter>
      <ListingCard listing={listing} />
    </MemoryRouter>
  );
}

describe("ListingCard", () => {
  it("shows the title, location, and formatted price", () => {
    renderCard(LISTING);
    expect(screen.getByText("2BR apartment, Kilimani")).toBeInTheDocument();
    expect(screen.getByText(/Kilimani, Nairobi/)).toBeInTheDocument();
    expect(screen.getByText("KSh 45,000/mo")).toBeInTheDocument();
  });

  it("shows the Verified badge only for verified listings", () => {
    renderCard(LISTING);
    expect(screen.getByText(/Verified/)).toBeInTheDocument();
  });

  it("hides the Verified badge otherwise", () => {
    renderCard({ ...LISTING, verified: false });
    expect(screen.queryByText(/Verified/)).not.toBeInTheDocument();
  });
});