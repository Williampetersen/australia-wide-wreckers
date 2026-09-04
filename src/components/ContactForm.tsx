"use client";

import { FormEvent, useState } from "react";
import { site } from "@/lib/site";

const fieldClasses =
  "w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm text-ink placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const phone = String(form.get("phone") ?? "");
    const vehicle = String(form.get("vehicle") ?? "");
    const message = String(form.get("message") ?? "");

    const subject = encodeURIComponent(`Free quote request from ${name || "website"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nVehicle: ${vehicle}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label htmlFor="name" className="text-sm font-semibold text-ink-soft">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className={`mt-2 ${fieldClasses}`}
          placeholder="Jane Smith"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="phone" className="text-sm font-semibold text-ink-soft">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className={`mt-2 ${fieldClasses}`}
          placeholder="04xx xxx xxx"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="vehicle" className="text-sm font-semibold text-ink-soft">
          Vehicle make, model & year
        </label>
        <input
          id="vehicle"
          name="vehicle"
          type="text"
          className={`mt-2 ${fieldClasses}`}
          placeholder="e.g. 2008 Toyota Corolla"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="text-sm font-semibold text-ink-soft">
          Tell us about your vehicle
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={`mt-2 ${fieldClasses}`}
          placeholder="Condition, suburb, and best time for pickup"
        />
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="w-full rounded-full bg-brand px-6 py-3.5 text-base font-bold text-ink transition-all hover:-translate-y-0.5 hover:bg-brand-dark sm:w-auto"
        >
          Send My Details
        </button>
        {status === "sent" && (
          <p className="mt-3 text-sm font-medium text-cash-dark">
            Your email app should now open with your details pre-filled. Prefer
            to skip that step? Just call us instead — it&apos;s the fastest way
            to get your quote.
          </p>
        )}
      </div>
    </form>
  );
}
