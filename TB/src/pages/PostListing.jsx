import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useForm } from "../hooks/useForm";

const STEPS = ["Type", "Details", "Review"];
const TYPE_OPTIONS = [
  { value: "house", label: "House" },
  { value: "car", label: "Car" },
  { value: "bike", label: "Bike" },
];

const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary dark:border-white/15 dark:bg-white/5 dark:placeholder:text-gray-500";
function validate(values, step) {
  const errors = {};
  if (step === 0 && !values.type) {
    errors.type = "Choose what you're listing.";
  }
  if (step === 1) {
    if (!values.title.trim()) errors.title = "Title is required.";
    if (!values.location.trim()) errors.location = "Location is required.";
    if (!values.price || Number(values.price) <= 0) {
      errors.price = "Enter a price above zero.";
    }
    if (values.type === "house") {
      if (values.bedrooms === "") {
        errors.bedrooms = "Bedrooms is required (0 = bedsitter).";
      }
    } else {
      if (!values.make.trim()) errors.make = "Make is required.";
      if (!values.model.trim()) errors.model = "Model is required.";
    }
  }
  return errors;
}

function Gate({ children }) {
  return (
    <p className="py-16 text-center text-gray-500 dark:text-gray-400">{children}</p>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </label>
  );
}

export default function PostListing() {
  const { user, isOwner } = useUser();
  const navigate = useNavigate();
  const [submitState, setSubmitState] = useState("idle"); 
  const form = useForm(
    {
      type: "",
      title: "",
      location: "",
      price: "",
      description: "",
      bedrooms: "",
      make: "",
      model: "",
      year: "",
    },
    validate
  );

  if (!user) {
    return (
      <Gate>
        <Link to="/auth" className="text-primary underline">Sign in</Link>{" "}
        to post a listing.
      </Gate>
    );
  }
  if (!isOwner) {
    return (
      <Gate>
        Only owners can post listings — your account is a seeker account.
        Create an owner account from the{" "}
        <Link to="/auth" className="text-primary underline">signup page</Link>{" "}
        to list your assets.
      </Gate>
    );
  }

  const v = form.values;
  const isHouse = v.type === "house";

  async function handleSubmit() {
    const details = isHouse
      ? {
          bedrooms: Number(v.bedrooms),
          bathrooms: 1,
          furnished: false,
          parking: false,
        }
      : {
          make: v.make.trim(),
          model: v.model.trim(),
          year: v.year ? Number(v.year) : null,
        };

    setSubmitState("sending");
    try {
      const res = await fetch("http://localhost:3001/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: v.type,
          title: v.title.trim(),
          price: Number(v.price),
          priceUnit: isHouse ? "month" : "week",
          location: v.location.trim(),
          description: v.description.trim(),
          details,
          ownerId: user.id,
          status: "available",
          verified: false, 
          createdAt: new Date().toISOString().slice(0, 10),
        }),
      });
      if (!res.ok) throw new Error();
      navigate("/dashboard"); 
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <section className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold">Post a listing</h1>
      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                i <= form.step
                  ? "bg-primary text-white"
                  : "border border-gray-300 text-gray-400 dark:border-white/20"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`text-sm ${
                i === form.step ? "font-semibold" : "text-gray-400"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
            )}
          </li>
        ))}
      </ol>

      {form.step === 0 && (
        <div>
          <h2 className="mb-4 font-semibold">What are you listing?</h2>
          <div className="grid grid-cols-3 gap-3">
            {TYPE_OPTIONS.map((t) => (
              <button
                key={t.value}
                onClick={() => form.setField("type", t.value)}
                className={`rounded-xl border-2 p-5 text-center transition-colors ${
                  v.type === t.value
                    ? "border-primary bg-primary/5 dark:bg-primary/15"
                    : "border-gray-200 hover:border-primary/50 dark:border-white/15"
                }`}
              >
                <div className="text-3xl">{t.icon}</div>
                <div className="mt-2 text-sm font-medium">{t.label}</div>
              </button>
            ))}
          </div>
          {form.errors.type && (
            <p className="mt-2 text-sm text-red-500">{form.errors.type}</p>
          )}
        </div>
      )}
    
      {form.step === 1 && (
        <div>
          <Field label="Title" error={form.errors.title}>
            <input
              className={inputCls}
              name="title"
              value={v.title}
              onChange={form.handleChange}
              placeholder={
                isHouse ? "2BR apartment, Kilimani" : "Toyota Axio 2017 for Uber/Bolt"
              }
            />
          </Field>
          <Field label="Location" error={form.errors.location}>
            <input
              className={inputCls}
              name="location"
              value={v.location}
              onChange={form.handleChange}
              placeholder="Neighbourhood, town"
            />
          </Field>
          <Field
            label={`Price (KSh per ${isHouse ? "month" : "week"})`}
            error={form.errors.price}
          >
            <input
              className={inputCls}
              name="price"
              type="number"
              min="0"
              value={v.price}
              onChange={form.handleChange}
            />
          </Field>

          {isHouse ? (
            <Field label="Bedrooms (0 = bedsitter)" error={form.errors.bedrooms}>
              <input
                className={inputCls}
                name="bedrooms"
                type="number"
                min="0"
                value={v.bedrooms}
                onChange={form.handleChange}
              />
            </Field>
          ) : (
            <>
              <Field label="Make" error={form.errors.make}>
                <input
                  className={inputCls}
                  name="make"
                  value={v.make}
                  onChange={form.handleChange}
                  placeholder={v.type === "car" ? "Toyota" : "Bajaj"}
                />
              </Field>
              <Field label="Model" error={form.errors.model}>
                <input
                  className={inputCls}
                  name="model"
                  value={v.model}
                  onChange={form.handleChange}
                  placeholder={v.type === "car" ? "Axio" : "Boxer 150"}
                />
              </Field>
              <Field label="Year (optional)">
                <input
                  className={inputCls}
                  name="year"
                  type="number"
                  value={v.year}
                  onChange={form.handleChange}
                />
              </Field>
            </>
          )}

          <Field label="Description (optional)">
            <textarea
              className={`${inputCls} h-24 resize-none`}
              name="description"
              value={v.description}
              onChange={form.handleChange}
              placeholder="Condition, terms, what makes it a good deal…"
            />
          </Field>
        </div>
      )}

      {form.step === 2 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <h2 className="mb-4 font-semibold">Review your listing</h2>
          <dl className="space-y-2 text-sm">
            {[
              ["Type", v.type],
              ["Title", v.title],
              ["Location", v.location],
              [
                "Price",
                `KSh ${Number(v.price).toLocaleString()} / ${isHouse ? "month" : "week"}`,
              ],
              ...(isHouse
                ? [["Bedrooms", v.bedrooms === "0" ? "Bedsitter" : v.bedrooms]]
                : [
                    ["Make & model", `${v.make} ${v.model}`],
                    ["Year", v.year || "—"],
                  ]),
              ["Description", v.description || "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-6">
                <dt className="shrink-0 text-gray-500 dark:text-gray-400">{label}</dt>
                <dd className="text-right font-medium">{String(value)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-gray-400">
            New listings start unverified — document verification is on the
            roadmap.
          </p>
          {submitState === "error" && (
            <p className="mt-2 text-sm text-red-500">
              Publish failed — is JSON Server running on port 3001?
            </p>
          )}
        </div>
      )}
      <div className="mt-8 flex justify-between">
        {form.step > 0 ? (
          <button
            onClick={form.prevStep}
            className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-primary hover:text-primary dark:border-white/15 dark:text-gray-300"
          >
            Back
          </button>
        ) : (
          <span />
        )}
        {form.step < STEPS.length - 1 ? (
          <button
            onClick={form.nextStep}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-royal"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitState === "sending"}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-royal disabled:opacity-50"
          >
            {submitState === "sending" ? "Publishing…" : "Publish listing"}
          </button>
        )}
      </div>
    </section>
  );
}
