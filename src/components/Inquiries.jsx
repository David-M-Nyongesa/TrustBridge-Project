import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Inquiries({ user, isOwner }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const [inqRes, listRes] = await Promise.all([
          fetch("http://localhost:3001/inquiries"),
          fetch("http://localhost:3001/listings"),
        ]);
        const [inquiries, listings] = await Promise.all([
          inqRes.json(),
          listRes.json(),
        ]);

        const byId = Object.fromEntries(listings.map((l) => [l.id, l]));
        const mine = inquiries.filter((i) =>
          isOwner
            ? String(byId[i.listingId]?.ownerId) === String(user.id)
            : String(i.seekerId) === String(user.id)
        );
        if (active) {
          setItems(mine.map((i) => ({ ...i, listing: byId[i.listingId] })));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [user.id, isOwner]);

  async function markResponded(id) {
    await fetch(`http://localhost:3001/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "responded" }),
    });
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "responded" } : i))
    );
  }

  if (loading) {
    return <p className="py-10 text-center text-gray-500 dark:text-gray-400">Loading…</p>;
  }
  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-gray-500 dark:text-gray-400">
        {isOwner ? "No inquiries on your listings yet." : "You haven't sent any inquiries yet."}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li
          key={i.id}
          className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
        >
          <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold">
              {isOwner ? i.seekerName : "You"}
            </span>
            <span className="text-gray-400">·</span>
            {i.listing ? (
              <Link to={`/listing/${i.listing.id}`} className="text-primary hover:underline">
                {i.listing.title}
              </Link>
            ) : (
              <span className="text-gray-400">Listing removed</span>
            )}
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${
                i.status === "pending"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
              }`}
            >
              {i.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{i.message}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
            <span>{i.createdAt}</span>
            {isOwner && i.status === "pending" && (
              <button
                onClick={() => markResponded(i.id)}
                className="font-medium text-primary hover:underline"
              >
                Mark responded
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}