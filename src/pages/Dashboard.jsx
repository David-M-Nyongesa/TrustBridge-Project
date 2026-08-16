import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useListings } from "../hooks/useListings";
import { useFavorites } from "../hooks/useFavorites";
import MyListings from "../components/MyListings";
import Inquiries from "../components/Inquiries";
import ListingCard from "../components/ListingCard";

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-primary dark:text-indigo-300">{value}</p>
    </div>
  );
}

function Tabs({ tab, setTab, items }) {
  return (
    <div className="mb-5 flex gap-6 border-b border-gray-200 dark:border-white/10">
      {items.map(([key, label]) => (
        <button
          key={key}
          onClick={() => setTab(key)}
          className={`pb-2 text-sm transition-colors ${
            tab === key
              ? "border-b-2 border-primary font-semibold text-primary dark:text-indigo-300"
              : "text-gray-500 hover:text-primary dark:text-gray-400"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function OwnerDashboard({ user }) {
  const { listings, loading, refetch } = useListings({ ownerId: user.id });
  const [tab, setTab] = useState("listings");
  const available = listings.filter((l) => l.status === "available").length;
  const leased = listings.filter((l) => l.status === "leased").length;

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">
        Welcome, {user.name.split(" ")[0]} 👋
      </h1>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Stat label="Total listings" value={listings.length} />
        <Stat label="Available" value={available} />
        <Stat label="Leased out" value={leased} />
      </div>
      <Tabs
        tab={tab}
        setTab={setTab}
        items={[
          ["listings", "My listings"],
          ["inquiries", "Inquiries"],
        ]}
      />
      {tab === "listings" ? (
        <MyListings listings={listings} loading={loading} onChanged={refetch} />
      ) : (
        <Inquiries user={user} isOwner={true} />
      )}
    </section>
  );
}

function SeekerDashboard({ user }) {
  const [tab, setTab] = useState("saved");
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { listings, loading } = useListings({});
  const saved = listings.filter((l) => favorites.includes(l.id));

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">
        Welcome, {user.name.split(" ")[0]} 👋
      </h1>
      <Tabs
        tab={tab}
        setTab={setTab}
        items={[
          ["saved", "Saved listings"],
          ["inquiries", "My inquiries"],
        ]}
      />
      {tab === "saved" ? (
        loading ? (
          <p className="py-10 text-center text-gray-500 dark:text-gray-400">Loading…</p>
        ) : saved.length === 0 ? (
          <p className="py-10 text-center text-gray-500 dark:text-gray-400">
            Nothing saved yet, tap the heart on any{" "}
            <Link to="/" className="text-primary underline">listing</Link>.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                isFavorite={isFavorite(l.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )
      ) : (
        <Inquiries user={user} isOwner={false} />
      )}
    </section>
  );
}

export default function Dashboard() {
  const { user, isOwner } = useUser();

  if (!user) {
    return (
      <p className="py-16 text-center text-gray-500 dark:text-gray-400">
        <Link to="/auth" className="text-primary underline">Sign in</Link>{" "}
        to see your dashboard.
      </p>
    );
  }
  return isOwner ? <OwnerDashboard user={user} /> : <SeekerDashboard user={user} />;
}
