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
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const isGlass = variant === "glass";

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

  const fieldClasses = isGlass
    ? "w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 backdrop-blur-sm transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
    : "w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm text-ink placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

  const labelClasses = isGlass
    ? "sr-only"
    : "text-sm font-semibold text-ink-soft";

  const gridClasses = isGlass
    ? "grid grid-cols-1 gap-3"
    : "grid grid-cols-1 gap-5 sm:grid-cols-2";

  const fields: Array<{
    id: string;
    label: string;
    span?: boolean;
    node: React.ReactNode;
  }> = [
    {
      id: "your-name",
      label: "Your name",
      node: (
        <input
          id="your-name"
          name="your-name"
          type="text"
          required
          className={fieldClasses}
          placeholder="Your Name"
        />
      ),
    },
    {
      id: "your-phone",
      label: "Your phone number",
      node: (
        <input
          id="your-phone"
          name="your-phone"
          type="tel"
          required
          className={fieldClasses}
          placeholder="Your Phone Number"
        />
      ),
    },
    {
      id: "your-email",
      label: "Email address",
      span: true,
      node: (
        <input
          id="your-email"
          name="your-email"
          type="email"
          required
          className={fieldClasses}
          placeholder="Email Address"
        />
      ),
    },
    {
      id: "suburb",
      label: "Suburb",
      node: (
        <input
          id="suburb"
          name="suburb"
          type="text"
          required
          className={fieldClasses}
          placeholder="Suburb"
        />
      ),
    },
    {
      id: "postal-code",
      label: "Postal code",
      node: (
        <input
          id="postal-code"
          name="postal-code"
          type="text"
          required
          inputMode="numeric"
          className={fieldClasses}
          placeholder="Postal Code"
        />
      ),
    },
    {
      id: "car-model",
      label: "Car brand / model",
      node: (
        <input
          id="car-model"
          name="car-model"
          type="text"
          required
          className={fieldClasses}
          placeholder="Car Brand / Model"
        />
      ),
    },
    {
      id: "car-year",
      label: "Car year",
      node: (
        <select
          id="car-year"
          name="car-year"
          required
          defaultValue=""
          className={`${fieldClasses} ${isGlass ? "[&>option]:text-ink" : ""}`}
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
      ),
    },
    {
      id: "your-note",
      label: "Extra details",
      span: true,
      node: (
        <textarea
          id="your-note"
          name="your-note"
          rows={isGlass ? 2 : 4}
          className={fieldClasses}
          placeholder="Extra details (condition, location notes, special requests)"
        />
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit} className={gridClasses}>
      {fields.map((field) => (
        <div key={field.id} className={!isGlass && field.span ? "sm:col-span-2" : undefined}>
          <label htmlFor={field.id} className={labelClasses}>
            {field.label}
          </label>
          <div className={isGlass ? undefined : "mt-2"}>{field.node}</div>
        </div>
      ))}

      <div className={isGlass ? undefined : "sm:col-span-2"}>
        <button
          type="submit"
          className={`rounded-full bg-brand px-6 py-3.5 text-base font-bold text-ink transition-all hover:-translate-y-0.5 hover:bg-brand-dark ${isGlass ? "w-full" : "w-full sm:w-auto"}`}
        >
          Get Cash Offer Now
        </button>
        {status === "sent" && (
          <p
            className={`mt-3 text-sm font-medium ${isGlass ? "text-white" : "text-cash-dark"}`}
          >
            Your email app should now open with your details pre-filled. Prefer
            to skip that step? Just call us instead — it&apos;s the fastest way
            to get your quote.
          </p>
        )}
      </div>
    </form>
  );
}
