"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Check, PhoneCall } from "lucide-react";
import { site } from "@/lib/site";
import { vehicleYears } from "@/lib/quote";

type FormState = {
  name: string;
  phone: string;
  email: string;
  suburb: string;
  postalCode: string;
  carModel: string;
  carYear: string;
  note: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  email: "",
  suburb: "",
  postalCode: "",
  carModel: "",
  carYear: "",
  note: "",
};

const inputClass =
  "h-10 w-full rounded-md border border-white/35 bg-white/15 px-3 text-sm text-white placeholder:text-white/80 backdrop-blur-sm focus:border-sky-300 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-sky-300/40 [color-scheme:dark]";

function validate(form: FormState): string | null {
  if (!form.name.trim()) return "Please enter your name.";
  if (form.phone.replace(/\D/g, "").length < 8) return "Please enter a phone number we can call you on.";
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Please enter a valid email address.";
  if (!form.suburb.trim()) return "Please enter your suburb.";
  if (!/^\d{4}$/.test(form.postalCode.trim())) return "Please enter a 4-digit postcode.";
  if (!form.carModel.trim()) return "Please enter the car brand and model.";
  if (!form.carYear) return "Please choose the car year.";
  return null;
}

export function QuoteForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
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

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
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
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/25 text-emerald-200">
          <Check className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="font-display mt-4 text-xl font-bold text-white">Thanks, your request is in</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          We&apos;ll call you on <strong className="text-white">{form.phone}</strong> with your cash offer.
        </p>
        <a
          href={site.landlineHref}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#0284c7] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(14,165,233,0.4)]"
        >
          <PhoneCall className="h-4 w-4" aria-hidden />
          Call {site.landlineDisplay}
        </a>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="font-display text-lg font-bold text-white">Get Cash Offer Now</h2>

      <form onSubmit={submit} className="mt-3 flex flex-col gap-2.5" noValidate>
        <input className={inputClass} aria-label="Your name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your Name" autoComplete="name" />
        <input className={inputClass} aria-label="Your phone number" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Your Phone Number" autoComplete="tel" />
        <input className={inputClass} aria-label="Email address" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Email address" autoComplete="email" />

        <div className="grid grid-cols-2 gap-2.5">
          <input className={inputClass} aria-label="Suburb" value={form.suburb} onChange={(e) => update("suburb", e.target.value)} placeholder="Suburb" autoComplete="address-level2" />
          <input className={inputClass} aria-label="Postal code" value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} placeholder="Postal Code" inputMode="numeric" maxLength={4} autoComplete="postal-code" />
        </div>

        <input className={inputClass} aria-label="Car brand and model" value={form.carModel} onChange={(e) => update("carModel", e.target.value)} placeholder="Car Brand / Model" autoComplete="off" />

        <select
          aria-label="Car year"
          value={form.carYear}
          onChange={(e) => update("carYear", e.target.value)}
          className="h-10 w-full rounded-md border border-white/30 bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-sky-300/40"
        >
          <option value="">Car Year</option>
          {vehicleYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <textarea
          aria-label="Extra details"
          className={`${inputClass} h-16 resize-none py-2`}
          value={form.note}
          onChange={(e) => update("note", e.target.value)}
          placeholder="Extra details (condition, location notes, special requests)"
        />

        {/* Hidden from people, filled in only by bots. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company">Leave this field empty</label>
          <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {(error || status === "error") && (
          <p role="alert" className="rounded-md bg-red-500/25 px-3 py-2 text-xs font-medium text-white">
            {error ?? (
              <>
                Couldn&apos;t send. Please call{" "}
                <a href={site.landlineHref} className="underline">
                  {site.landlineDisplay}
                </a>
                .
              </>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-1 h-11 w-full rounded-full bg-gradient-to-r from-[#38bdf8] to-[#0284c7] text-sm font-bold text-white shadow-[0_10px_24px_rgba(14,165,233,0.4)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Get Cash Offer Now"}
        </button>

        <p className="text-center text-[11px] leading-snug text-white/65">
          We only use your details to contact you about your vehicle. See our{" "}
          <a href="/privacy-policy" className="underline">
            privacy policy
          </a>
          .
        </p>
      </form>
    </Card>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="w-full rounded-2xl border border-white/25 bg-navy/45 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-5">
      {children}
    </div>
  );
}
