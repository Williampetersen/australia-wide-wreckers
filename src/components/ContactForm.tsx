"use client";

import { FormEvent, useState } from "react";
import { site } from "@/lib/site";

const currentYear = new Date().getFullYear();
const carYears = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

export function ContactForm({
  variant = "light",
}: {
  variant?: "light" | "glass";
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const isGlass = variant === "glass";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentForm = event.currentTarget;
    const form = new FormData(currentForm);

    // Honeypot: real visitors never see or fill this field.
    if (String(form.get("company") ?? "").trim()) {
      setStatus("sent");
      currentForm.reset();
      return;
    }

    setStatus("sending");

    const payload = {
      name: String(form.get("your-name") ?? ""),
      phone: String(form.get("your-phone") ?? ""),
      email: String(form.get("your-email") ?? ""),
      suburb: String(form.get("suburb") ?? ""),
      postalCode: String(form.get("postal-code") ?? ""),
      carModel: String(form.get("car-model") ?? ""),
      carYear: String(form.get("car-year") ?? ""),
      note: String(form.get("your-note") ?? ""),
    };

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Request failed");

      setStatus("sent");
      currentForm.reset();
    } catch {
      setStatus("error");
    }
  }

  const fieldClasses = isGlass
    ? "w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/60 backdrop-blur-md transition-colors focus:border-white/50 focus:outline-none"
    : "w-full rounded-xl border border-transparent bg-field px-4 py-3.5 text-sm text-ink placeholder:text-ink-soft/50 transition-colors focus:border-brand focus:bg-white focus:outline-none";

  const selectClasses = isGlass
    ? "w-full rounded-xl border border-white/40 bg-white px-4 py-3.5 text-sm text-ink transition-colors focus:border-brand focus:outline-none [&>option]:text-ink"
    : fieldClasses;

  return (
    <div
      className={
        isGlass
          ? "shadow-soft-lg rounded-2xl border border-white/20 bg-ink/45 p-7 backdrop-blur-xl sm:p-8"
          : "shadow-soft-lg rounded-2xl bg-white p-7 sm:p-9"
      }
    >
      <h3 className={`font-display text-2xl ${isGlass ? "text-white" : "text-ink"}`}>
        Get Cash Offer Now
      </h3>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
        <input
          name="your-name"
          type="text"
          required
          placeholder="Your Name"
          className={fieldClasses}
        />
        <input
          name="your-phone"
          type="tel"
          required
          placeholder="Your Phone Number"
          className={fieldClasses}
        />
        <input
          name="your-email"
          type="email"
          required
          placeholder="Email address"
          className={fieldClasses}
        />
        <input
          name="suburb"
          type="text"
          required
          placeholder="Suburb"
          className={fieldClasses}
        />
        <input
          name="postal-code"
          type="text"
          required
          inputMode="numeric"
          placeholder="Postal Code"
          className={fieldClasses}
        />
        <input
          name="car-model"
          type="text"
          required
          placeholder="Car Brand / Model"
          className={fieldClasses}
        />
        <select
          name="car-year"
          required
          defaultValue=""
          className={selectClasses}
        >
          <option value="" disabled>
            Car Year
          </option>
          {carYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <textarea
          name="your-note"
          rows={3}
          placeholder="Extra details (condition, location notes, special requests)"
          className={fieldClasses}
        />

        <div className="hidden" aria-hidden="true">
          <label htmlFor="company">Leave this field empty</label>
          <input
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-1 flex w-full items-center justify-center rounded-full bg-brand px-6 py-4 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {status === "sending" ? "Sending…" : "Get Cash Offer Now"}
        </button>

        {status === "sent" && (
          <p className={`text-sm font-medium ${isGlass ? "text-white" : "text-success"}`}>
            Thanks — your request is in. We&apos;ll call or email you back
            with a cash offer shortly.
          </p>
        )}
        {status === "error" && (
          <p className={`text-sm font-medium ${isGlass ? "text-white" : "text-red-600"}`}>
            Something went wrong sending your request. Please call{" "}
            <a href={site.phoneHref} className="underline">
              {site.phoneDisplay}
            </a>{" "}
            or email{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>{" "}
            instead.
          </p>
        )}
      </form>
    </div>
  );
}
