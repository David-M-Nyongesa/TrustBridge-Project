import { Link } from "react-router-dom";
import { formatPrice } from "./ListingCard";

export default function MyListings({ listings, loading, onChanged }) {
  async function handleDelete(id) {
    if (!window.confirm("Delete this listing? This can't be undone.")) return;
    await fetch(`http://localhost:3001/listings/${id}`, { method: "DELETE" });
    onChanged();
  }

  async function toggleStatus(listing) {
    await fetch(`http://localhost:3001/listings/${listing.id}`, {
      // PATCH = partial update: only the fields in the body change.
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: listing.status === "available" ? "leased" : "available",
      }),
    });
    onChanged();
  }

  if (loading) {
    return <p className="py-10 text-center text-gray-500 dark:text-gray-400">Loading…</p>;
  }
  if (listings.length === 0) {
    return (
      <p className="py-10 text-center text-gray-500 dark:text-gray-400">
        No listings yet —{" "}
        <Link to="/post" className="text-primary underline">post your first one</Link>.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100 dark:divide-white/10">
      {listings.map((l) => (
        <li key={l.id} className="flex flex-wrap items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            <Link to={`/listing/${l.id}`} className="font-medium hover:text-primary">
              {l.title}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {l.type} · {formatPrice(l)}
            </p>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              l.status === "available"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
            }`}
          >
            {l.status}
          </span>
          <button
            onClick={() => toggleStatus(l)}
            className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
          >
            Mark {l.status === "available" ? "leased" : "available"}
          </button>
          <button
            onClick={() => handleDelete(l.id)}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
