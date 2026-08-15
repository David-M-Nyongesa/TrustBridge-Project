import { Link } from "react-router-dom";
import { TYPE_IMAGES } from "../assets/images";

const TYPE_STYLES = {
  house: "bg-primary/10 text-primary dark:bg-primary/25 dark:text-indigo-200",
  car: "bg-royal/10 text-royal dark:bg-royal/40 dark:text-indigo-200",
  bike: "bg-navy/10 text-navy dark:bg-white/10 dark:text-indigo-200",
};

export function formatPrice(listing) {
  const unit = listing.priceUnit === "month" ? "mo" : "wk";
  return `KSh ${listing.price.toLocaleString()}/${unit}`;
}

export default function ListingCard({ listing, isFavorite, onToggleFavorite }) {
  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg hover:shadow-primary/10 dark:border-white/10 dark:bg-white/5"
    >
       <img
         src={listing.image || TYPE_IMAGES[listing.type]}
         alt={listing.title}
         className="h-28 w-full object-cover"
         loading="lazy"
       />

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_STYLES[listing.type]}`}>
            {listing.type}
          </span>
          {listing.verified && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ Verified</span>
          )}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(listing.id);
              }}
              aria-label={isFavorite ? "Remove from saved" : "Save listing"}
              className="ml-auto text-lg leading-none transition-transform hover:scale-110"
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
          )}
        </div>

        <h3 className="font-semibold transition-colors group-hover:text-primary">
          {listing.title}
        </h3>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          📍 {listing.location}
        </p>
        <p className="mt-2 font-semibold text-primary dark:text-indigo-300">
          {formatPrice(listing)}
        </p>
      </div>
    </Link>
  );
}