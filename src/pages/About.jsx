const ROADMAP = [
  ["M-Pesa integration", "Rent and lease payments held in escrow until both sides confirm."],
  ["ID & logbook verification", "Real document checks behind the Verified badge."],
  ["In-app chat", "Replace the inquiry inbox with real-time messaging."],
  ["Ratings", "Two-way reviews so good landlords, owners and tenants stand out."],
];

export default function About() {
  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold">
        Trust is the bridge<span className="text-primary">.</span>
      </h1>
      <p className="mb-8 text-gray-500 dark:text-gray-400">
        Closing the gap between asset owners and the people who need them.
      </p>

      <div className="space-y-4 leading-relaxed text-gray-700 dark:text-gray-300">
        <p>
          In Kenya, finding a rental house means word of mouth, endless site
          visits, and agents charging viewing fees for houses that don't
          exist. For drivers and riders, getting a car or motorbike to work
          on Bolt or Uber means knowing someone who knows someone — and for
          the owners of those assets, handing over keys to a stranger on
          trust alone.
        </p>
        <p>
          TrustBridge puts all of it in one place: houses to rent, cars and
          bikes to lease, posted directly by their owners. Seekers browse,
          filter and inquire; owners manage their listings and respond —
          both sides seeing the same clear information.
        </p>
      </div>

      <h2 className="mb-3 mt-10 text-xl font-bold">On the roadmap</h2>
      <ul className="space-y-3">
        {ROADMAP.map(([title, body]) => (
          <li
            key={title}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
          >
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
