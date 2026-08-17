import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001";

export function useListings(filters = {}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  const { type, location, maxPrice, ownerId } = filters;

  useEffect(() => {
    let isActive = true;

    async function fetchListings() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (type && type !== "all") params.append("type", type);

        const res = await fetch(`${API_URL}/listings?${params}`);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        let data = await res.json();

        if (location) {
          const q = location.toLowerCase();
          data = data.filter((l) => l.location.toLowerCase().includes(q));
        }
        if (maxPrice) {
          data = data.filter((l) => l.price <= Number(maxPrice));
        }
        if (ownerId) {
          data = data.filter((l) => String(l.ownerId) === String(ownerId));
        }

        if (isActive) setListings(data);
      } catch (err) {
        if (isActive) setError(err.message);
      } finally {
        if (isActive) setLoading(false);
      }
    }

    fetchListings();

    return () => {
      isActive = false;
    };
  }, [type, location, maxPrice, ownerId, reloadCount]);

  function refetch() {
    setReloadCount((c) => c + 1);
  }

  return { listings, loading, error, refetch };
}
