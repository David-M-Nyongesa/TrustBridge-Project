const TYPES = ["all", "house", "car", "bike"];

const inputCls =
  "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary dark:border-white/15 dark:bg-white/5 dark:placeholder:text-gray-500";

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => onFilterChange({ ...filters, type: t })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              filters.type === t
                ? "bg-primary text-white"
                : "border border-gray-200 text-gray-600 hover:border-primary hover:text-primary dark:border-white/15 dark:text-gray-300"
            }`}
          >
            {t === "all" ? "All" : `${t}s`}
          </button>
        ))}
      </div>
      <input
        className={`${inputCls} w-44`}
        placeholder="Location…"
        value={filters.location}
        onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
      />
      <input
        className={`${inputCls} w-40`}
        type="number"
        min="0"
        placeholder="Max price (KSh)"
        value={filters.maxPrice}
        onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
      />
    </div>
  );
}