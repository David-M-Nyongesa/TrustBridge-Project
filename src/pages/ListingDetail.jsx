import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import InquiryForm from "../components/InquiryForm";
import { formatPrice } from "../components/ListingCard";

const TYPE_STYLES = {
  house: "bg-primary/10 text-primary dark:bg-primary/25 dark:text-indigo-200",
  car: "bg-royal/10 text-royal dark:bg-royal/40 dark:text-indigo-200",
  bike: "bg-navy/10 text-navy dark:bg-white/10 dark:text-indigo-200",
};

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [owner, setOwner] = useState(null);
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    let active = true;

    async function load() {
      setStatus("loading");
      try {
        const res = await fetch(`http://localhost:3001/listings/${id}`);
        if (!res.ok) throw new Error("Listing not found");
        const data = await res.json();
        const ownerRes = await fetch(`http://localhost:3001/users/${data.ownerId}`);
        const ownerData = ownerRes.ok ? await ownerRes.json() : null;
        if (active) {
          setListing(data);
          setOwner(ownerData);
          setStatus("ready");
        }
      } catch {
        if (active) setStatus("error");
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (status === "loading") {
    return <p className="py-16 text-center text-gray-500 dark:text-gray-400">Loading…</p>;
  }
  if (status === "error") {
    return (
      <p className="py-16 text-center text-gray-500 dark:text-gray-400">
        Listing not found.{" "}
        <Link to="/" className="text-primary underline">Back to Browse</Link>
      </p>
    );
  }

  const d = listing.details ?? {};
  const facts =
    listing.type === "house"
      ? [
          ["Bedrooms", d.bedrooms === 0 ? "Bedsitter" : d.bedrooms],
          ["Bathrooms", d.bathrooms],
          ["Furnished", d.furnished ? "Yes" : "No"],
          ["Parking", d.parking ? "Yes" : "No"],
        ]
      : [
          ["Make", d.make],
          ["Model", d.model],
          ["Year", d.year],
          listing.type === "car"
            ? ["Transmission", d.transmission]
            : ["Engine", `${d.engineCC}cc`],
        ];

  return (
    <section>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-primary">Browse</Link> / {listing.title}
      </p>

      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <img
            src={listing.image || TYPE_IMAGES[listing.type]}
            alt={listing.title}
            className="h-56 w-full rounded-xl object-cover"
          />
          <h1 className="mt-5 text-2xl font-bold">{listing.title}</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">📍 {listing.location}</p>
          <p className="mt-2 text-xl font-bold text-primary dark:text-indigo-300">
            {formatPrice(listing)}
          </p>
          <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">
            {listing.description}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {facts.map(([label, value]) => (
              <div key={label} className="rounded-lg bg-gray-100 p-3 dark:bg-white/5">
                <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
                <dd className="font-medium capitalize">{String(value ?? "—")}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-4 md:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${TYPE_STYLES[listing.type]}`}>
              {listing.type}
            </span>
            {listing.verified && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                ✓ Verified owner
              </span>
            )}
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                listing.status === "available"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
              }`}
            >
              {listing.status}
            </span>
          </div>

          {owner && (
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary dark:bg-primary/25 dark:text-indigo-200">
                {owner.name[0]}
              </div>
              <div>
                <p className="font-medium">{owner.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Owner · member since {owner.joined?.slice(0, 4)}
                </p>
              </div>
            </div>
          )}

          {listing.status === "available" ? (
            <InquiryForm listing={listing} />
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
              This listing is currently leased out — check back later.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}