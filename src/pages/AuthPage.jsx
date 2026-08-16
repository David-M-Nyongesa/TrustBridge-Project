import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary dark:border-white/15 dark:bg-white/5 dark:placeholder:text-gray-500";

export default function AuthPage() {
  const { user, login, signup } = useUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); 
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    return (
      <p className="py-16 text-center text-gray-500 dark:text-gray-400">
        You're signed in as {user.name}.{" "}
        <Link to="/dashboard" className="text-primary underline">
          Go to your dashboard
        </Link>
        .
      </p>
    );
  }
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function switchMode(next) {
    setMode(next);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault(); 
    if (mode === "signup" && form.name.trim().length < 2) {
      return setError("Please enter your name.");
    }
    if (!form.email.includes("@")) {
      return setError("Please enter a valid email address.");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setBusy(true);
    const result =
      mode === "login"
        ? await login(form.email.trim().toLowerCase(), form.password)
        : await signup({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            role: form.role,
          });
    setBusy(false);

    if (result.ok) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  }

  return (
    <section className="mx-auto max-w-sm">
      <h1 className="mb-1 text-2xl font-bold">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {mode === "login"
          ? "Log in to manage your listings and inquiries."
          : "Join TrustBridge as a seeker or an owner."}
      </p>

      {/* Mode tabs */}
      <div className="mb-6 grid grid-cols-2 rounded-lg border border-gray-200 p-1 dark:border-white/15">
        {["login", "signup"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`rounded-md py-1.5 text-sm font-medium capitalize transition-colors ${
              mode === m
                ? "bg-primary text-white"
                : "text-gray-500 hover:text-primary dark:text-gray-400"
            }`}
          >
            {m === "login" ? "Log in" : "Sign up"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "signup" && (
          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-medium">Full name</span>
            <input
              className={inputCls}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Barclay Koin"
            />
          </label>
        )}

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input
            className={inputCls}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            className={inputCls}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
          />
        </label>

        {mode === "signup" && (
          <div className="mb-4">
            <span className="mb-1 block text-sm font-medium">I want to…</span>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["seeker", "Find a house, car or bike"],
                ["owner", "List my property or vehicle"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, role: value })}
                  className={`rounded-xl border-2 p-3 text-left text-sm transition-colors ${
                    form.role === value
                      ? "border-primary bg-primary/5 dark:bg-primary/15"
                      : "border-gray-200 hover:border-primary/50 dark:border-white/15"
                  }`}
                >
                  <span className="block font-semibold capitalize">{value}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <button
          disabled={busy}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-royal disabled:opacity-50"
        >
          {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      {mode === "login" && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
          <p className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
            Demo accounts (password: demo1234)
          </p>
          <p>d.nyongesa@gmail.com — owner</p>
          <p>c.muchemi@gmail.com — seeker</p>
        </div>
      )}
    </section>
  );
}
