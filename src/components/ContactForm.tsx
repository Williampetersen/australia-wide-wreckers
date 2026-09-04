"use client";

import { FormEvent, useState } from "react";
import { site } from "@/lib/site";

const fieldClasses =
  "w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm text-ink placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

const currentYear = new Date().getFullYear();
const carYears = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("your-name") ?? "");
    const phone = String(form.get("your-phone") ?? "");
    const email = String(form.get("your-email") ?? "");
    const suburb = String(form.get("suburb") ?? "");
    const postalCode = String(form.get("postal-code") ?? "");
    const carModel = String(form.get("car-model") ?? "");
    const carYear = String(form.get("car-year") ?? "");
    const note = String(form.get("your-note") ?? "");

    const subject = encodeURIComponent(
      `New Quote — ${name} – ${carModel} – ${carYear}`
    );
    const body = encodeURIComponent(
      `Car Brand / Model: ${carModel}\nCar Year: ${carYear}\nSuburb: ${suburb}\nPostal Code: ${postalCode}\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nExtra details:\n${note}`
    );

    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label htmlFor="your-name" className="text-sm font-semibold text-ink-soft">
          Your name
        </label>
        <input
          id="your-name"
          name="your-name"
          type="text"
          required
          className={`mt-2 ${fieldClasses}`}
          placeholder="Jane Smith"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="your-phone" className="text-sm font-semibold text-ink-soft">
          Your phone number
        </label>
        <input
          id="your-phone"
          name="your-phone"
          type="tel"
          required
          className={`mt-2 ${fieldClasses}`}
          placeholder="04xx xxx xxx"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="your-email" className="text-sm font-semibold text-ink-soft">
          Email address
        </label>
        <input
          id="your-email"
          name="your-email"
          type="email"
          required
          className={`mt-2 ${fieldClasses}`}
          placeholder="you@example.com"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="suburb" className="text-sm font-semibold text-ink-soft">
          Suburb
        </label>
        <input
          id="suburb"
          name="suburb"
          type="text"
          required
          className={`mt-2 ${fieldClasses}`}
          placeholder="e.g. Mayfield"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="postal-code" className="text-sm font-semibold text-ink-soft">
          Postal code
        </label>
        <input
          id="postal-code"
          name="postal-code"
          type="text"
          required
          inputMode="numeric"
          className={`mt-2 ${fieldClasses}`}
          placeholder="e.g. 2304"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="car-model" className="text-sm font-semibold text-ink-soft">
          Car brand / model
        </label>
        <input
          id="car-model"
          name="car-model"
          type="text"
          required
          className={`mt-2 ${fieldClasses}`}
          placeholder="e.g. Toyota Corolla"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="car-year" className="text-sm font-semibold text-ink-soft">
          Car year
        </label>
        <select
          id="car-year"
          name="car-year"
          required
          defaultValue=""
          className={`mt-2 ${fieldClasses}`}
        >
          <option value="" disabled>
            Select year
          </option>
          {carYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="your-note" className="text-sm font-semibold text-ink-soft">
          Extra details
        </label>
        <textarea
          id="your-note"
          name="your-note"
          rows={4}
          className={`mt-2 ${fieldClasses}`}
          placeholder="Condition, location notes, special requests"
        />
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="w-full rounded-full bg-brand px-6 py-3.5 text-base font-bold text-ink transition-all hover:-translate-y-0.5 hover:bg-brand-dark sm:w-auto"
        >
          Get Cash Offer Now
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
