import { useState } from "react";
import { useUser } from "../context/UserContext";

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary dark:border-white/15 dark:bg-white/5 dark:placeholder:text-gray-500";

export default function InquiryForm({ listing }) {
  const { user } = useUser();
  const [name, setName] = useState(user?.name ?? "");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); 

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("http://localhost:3001/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          seekerId: user?.id ?? null,
          seekerName: name.trim(),
          message: message.trim(),
          status: "pending",
          createdAt: new Date().toISOString().slice(0, 10),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
        ✓ Inquiry sent. The owner will see it on their dashboard.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
    >
      <h3 className="mb-3 font-semibold">Send an inquiry</h3>
      <input
        className={`${inputCls} mb-3`}
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className={`${inputCls} mb-3 h-24 resize-none`}
        placeholder="I'm interested in this listing…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {status === "error" && (
        <p className="mb-2 text-sm text-red-500">
          Sending failed — check that JSON Server is running, then try again.
        </p>
      )}
      <button
        disabled={status === "sending"}
        className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-royal disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}