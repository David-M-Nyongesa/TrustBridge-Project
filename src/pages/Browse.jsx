import { useState } from "react";
import { useListings } from "../hooks/useListings";
import { useFavorites } from "../hooks/useFavorites";
import FilterBar from "../components/FilterBar";
import ListingCard from "../components/ListingCard";

export default function Browse() {
  const [filters, setFilters] = useState({ type: "all", location: "", maxPrice: "" });
  const { listings, loading, error } = useListings(filters);
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <section>
      <h1 className="mb-1 text-2xl font-bold">
        Find your next home, car or bike
      </h1>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        Rentals and ride-hailing leases, straight from the owners.
      </p>

      <FilterBar filters={filters} onFilterChange={setFilters} />

      {loading && (
        <p className="py-16 text-center text-gray-500 dark:text-gray-400">Loading listings…</p>
      )}
      {error && (
        <p className="py-16 text-center text-red-500">
          Couldn't load listings ({error}). Is JSON Server running on port 3001?
        </p>
      )}
      {!loading && !error && listings.length === 0 && (
        <p className="py-16 text-center text-gray-500 dark:text-gray-400">
          No listings match those filters — try widening them.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <ListingCard
            key={l.id}
            listing={l}
            isFavorite={isFavorite(l.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}