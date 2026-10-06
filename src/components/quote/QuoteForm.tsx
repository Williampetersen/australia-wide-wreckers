"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Check, PhoneCall } from "lucide-react";
import { site } from "@/lib/site";
import { conditions, getVehicleType, vehicleTypes, vehicleYears, type ConditionId, type VehicleTypeId } from "@/lib/quote";

type FormState = {
  vehicleType: VehicleTypeId | "";
  condition: ConditionId | "";
  make: string;
  model: string;
  year: string;
  rego: string;
  suburb: string;
  postalCode: string;
  name: string;
  phone: string;
  email: string;
  note: string;
  consent: boolean;
};

const inputClass =
  "mt-2 w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3 text-base text-white placeholder:text-white/60 backdrop-blur-sm focus:border-sky-300 focus:bg-white/20 focus:outline-none focus:ring-4 focus:ring-sky-300/25 [color-scheme:dark]";
const selectClass =
  "mt-2 w-full rounded-xl border border-white/30 bg-white px-4 py-3 text-base text-ink focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-300/25";
const labelClass = "block text-sm font-semibold text-white/90";

function validate(form: FormState): string | null {
  if (!form.vehicleType) return "Choose the type of vehicle you want to sell.";
  if (!form.condition) return "Choose the condition of your vehicle.";
  if (!form.make.trim() || !form.model.trim()) return "Enter the make and model.";
  if (!form.year) return "Choose the year of manufacture.";
  if (!form.suburb.trim()) return "Enter the suburb where the vehicle is located.";
  if (!/^\d{4}$/.test(form.postalCode.trim())) return "Enter a valid 4-digit postcode.";
  if (!form.name.trim()) return "Enter your name.";
  if (form.phone.replace(/\D/g, "").length < 8) return "Enter a phone number we can call you on.";
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Enter a valid email address.";
  if (!form.consent) return "Please agree to the privacy policy so we can contact you.";
  return null;
}

export function QuoteForm({ initialVehicleType }: { initialVehicleType?: VehicleTypeId }) {
  const startType = initialVehicleType && getVehicleType(initialVehicleType) ? initialVehicleType : "";
  const [form, setForm] = useState<FormState>({
    vehicleType: startType,
    condition: "",
    make: "",
    model: "",
    year: "",
    rego: "",
    suburb: "",
    postalCode: "",
    name: "",
    phone: "",
    email: "",
    note: "",
    consent: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = validate(form);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setStatus("sending");

    const vehicle = getVehicleType(form.vehicleType);
    const condition = conditions.find((item) => item.id === form.condition);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleType: vehicle?.label ?? "",
          condition: condition?.label ?? "",
          make: form.make.trim(),
          model: form.model.trim(),
          carModel: `${form.make.trim()} ${form.model.trim()}`,
          carYear: form.year,
          rego: form.rego.trim(),
          suburb: form.suburb.trim(),
          postalCode: form.postalCode.trim(),
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          note: form.note.trim(),
          honeypot: (event.currentTarget.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "",
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <Card>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/25 text-emerald-200">
          <Check className="h-7 w-7" aria-hidden />
        </span>
        <h2 className="font-display mt-5 text-2xl font-bold text-white sm:text-3xl">
          Thanks {form.name.trim().split(" ")[0]}, your request is in
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-white/85">
          We&apos;ll call you on <strong className="text-white">{form.phone}</strong> to confirm your cash offer for
          your {form.year} {form.make} {form.model}.
        </p>
        <a
          href={site.landlineHref}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#0284c7] px-6 py-3.5 text-base font-bold text-white shadow-[0_14px_34px_rgba(14,165,233,0.45)] transition hover:brightness-110"
        >
          <PhoneCall className="h-5 w-5" aria-hidden />
          Call {site.landlineDisplay}
        </a>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="font-display text-xl font-bold text-white sm:text-2xl">Get Cash Offer Now</h2>
      <p className="mt-1 text-sm text-white/75">Fill in your details once and we&apos;ll call you back with your offer.</p>

      <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5" noValidate>
        <label className="block sm:col-span-2">
          <span className={labelClass}>Vehicle type</span>
          <select className={selectClass} value={form.vehicleType} onChange={(e) => update("vehicleType", e.target.value as VehicleTypeId)}>
            <option value="">Select vehicle type</option>
            {vehicleTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className={labelClass}>Condition</span>
          <select className={selectClass} value={form.condition} onChange={(e) => update("condition", e.target.value as ConditionId)}>
            <option value="">Select condition</option>
            {conditions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <Field label="Make">
          <input className={inputClass} value={form.make} onChange={(e) => update("make", e.target.value)} placeholder="e.g. Toyota" autoComplete="off" />
        </Field>
        <Field label="Model">
          <input className={inputClass} value={form.model} onChange={(e) => update("model", e.target.value)} placeholder="e.g. Hilux" autoComplete="off" />
        </Field>

        <Field label="Year">
          <select className={selectClass} value={form.year} onChange={(e) => update("year", e.target.value)}>
            <option value="">Select year</option>
            {vehicleYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </Field>
        <Field label={<>Registration <span className="font-normal text-white/60">(optional)</span></>}>
          <input className={`${inputClass} uppercase`} value={form.rego} onChange={(e) => update("rego", e.target.value)} placeholder="e.g. ABC123" maxLength={12} autoComplete="off" />
        </Field>

        <Field label="Suburb">
          <input className={inputClass} value={form.suburb} onChange={(e) => update("suburb", e.target.value)} placeholder="e.g. Maitland" autoComplete="address-level2" />
        </Field>
        <Field label="Postal code">
          <input className={inputClass} value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} placeholder="e.g. 2320" inputMode="numeric" maxLength={4} autoComplete="postal-code" />
        </Field>

        <Field label="Your name">
          <input className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" autoComplete="name" />
        </Field>
        <Field label="Your phone number">
          <input className={inputClass} type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone number" autoComplete="tel" />
        </Field>

        <Field label="Email address" wide>
          <input className={inputClass} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" autoComplete="email" />
        </Field>

        <Field label={<>Extra details <span className="font-normal text-white/60">(optional)</span></>} wide>
          <textarea
            className={`${inputClass} min-h-24`}
            rows={3}
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder="Condition notes, keys, preferred pickup time"
          />
        </Field>

        <label className="flex items-start gap-3 text-sm text-white/85 sm:col-span-2">
          <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} className="mt-1 h-4 w-4 accent-sky-400" />
          <span>
            I agree to be contacted about this request and have read the{" "}
            <a href="/privacy-policy" className="font-semibold text-sky-200 underline">
              privacy policy
            </a>
            .
          </span>
        </label>

        {/* Hidden from people, filled in only by bots. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company">Leave this field empty</label>
          <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-500/25 px-4 py-3 text-sm font-medium text-white sm:col-span-2">
            {error}
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="rounded-xl bg-red-500/25 px-4 py-3 text-sm font-medium text-white sm:col-span-2">
            We couldn&apos;t send your request. Please call{" "}
            <a href={site.landlineHref} className="underline">
              {site.landlineDisplay}
            </a>{" "}
            and we&apos;ll take it over the phone.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-2 w-full rounded-full bg-gradient-to-r from-[#38bdf8] to-[#0284c7] px-7 py-4 text-base font-bold text-white shadow-[0_14px_34px_rgba(14,165,233,0.45)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
        >
          {status === "sending" ? "Sending…" : "Get Cash Offer Now"}
        </button>
      </form>
    </Card>
  );
}

function Field({ label, children, wide = false }: { label: ReactNode; children: ReactNode; wide?: boolean }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/25 bg-white/10 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8">
      {children}
    </div>
  );
}
