"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { Check, ChevronLeft, PhoneCall } from "lucide-react";
import { site } from "@/lib/site";
import {
  conditions,
  getVehicleType,
  vehicleTypes,
  vehicleYears,
  type ConditionId,
  type VehicleTypeId,
} from "@/lib/quote";

const steps = ["Vehicle", "Condition", "Details", "Location", "Contact"] as const;


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

const emptyForm: FormState = {
  vehicleType: "",
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
};

const inputClass =
  "mt-2 w-full rounded-xl border border-[#d9e3ee] bg-white px-4 py-3 text-base text-ink placeholder:text-zinc-400 focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue/15";
const labelClass = "block text-sm font-semibold text-ink";

function validate(step: number, form: FormState): string | null {
  if (step === 0 && !form.vehicleType) return "Choose the type of vehicle you want to sell.";
  if (step === 1 && !form.condition) return "Choose the condition that best describes your vehicle.";
  if (step === 2) {
    if (!form.make.trim() || !form.model.trim()) return "Enter the make and model.";
    if (!form.year) return "Choose the year of manufacture.";
  }
  if (step === 3) {
    if (!form.suburb.trim()) return "Enter the suburb where the vehicle is located.";
    if (!/^\d{4}$/.test(form.postalCode.trim())) return "Enter a valid 4-digit postcode.";
  }
  if (step === 4) {
    if (!form.name.trim()) return "Enter your name.";
    if (form.phone.replace(/\D/g, "").length < 8) return "Enter a phone number we can call you on.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Enter a valid email address.";
    if (!form.consent) return "Please agree to the privacy policy so we can contact you.";
  }
  return null;
}

export function QuoteWizard({ initialVehicleType }: { initialVehicleType?: VehicleTypeId }) {
  const startType = initialVehicleType && getVehicleType(initialVehicleType) ? initialVehicleType : "";
  const [form, setForm] = useState<FormState>({ ...emptyForm, vehicleType: startType });
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const goNext = () => {
    const problem = validate(step, form);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setStep((current) => current + 1);
  };

  const goBack = () => {
    setError(null);
    setStep((current) => Math.max(0, current - 1));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = validate(step, form);
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
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cash/15 text-cash-dark">
          <Check className="h-7 w-7" aria-hidden />
        </span>
        <h2 className="font-display mt-5 text-2xl font-bold text-ink sm:text-3xl">
          Thanks {form.name.split(" ")[0]}, your request is in
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-600">
          We&apos;ll call you on <strong className="text-ink">{form.phone}</strong> to confirm your cash offer
          for your {form.year} {form.make} {form.model}. Want it sooner? Call us now.
        </p>
        <a
          href={site.landlineHref}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base font-bold text-navy shadow-[0_14px_34px_rgba(254,186,2,0.35)] transition hover:brightness-105"
        >
          <PhoneCall className="h-5 w-5" aria-hidden />
          Call {site.landlineDisplay}
        </a>
      </Card>
    );
  }

  const isLast = step === steps.length - 1;

  return (
    <Card>
      <ol className="flex flex-wrap items-center gap-2" aria-label="Quote progress">
        {steps.map((label, index) => {
          const done = index < step;
          const current = index === step;
          return (
            <li
              key={label}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                current
                  ? "bg-navy text-white"
                  : done
                    ? "bg-blue/10 text-navy"
                    : "bg-zinc-100 text-zinc-500"
              }`}
              aria-current={current ? "step" : undefined}
            >
              <span className="flex h-4 w-4 items-center justify-center text-[10px]">
                {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : index + 1}
              </span>
              {label}
            </li>
          );
        })}
      </ol>

      <form onSubmit={isLast ? submit : (event) => event.preventDefault()} className="mt-8" noValidate>
        {step === 0 && (
          <StepHeading
            title="We buy all types of vehicles"
            description="Start by telling us what you want to sell."
          >
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {vehicleTypes.map((type) => {
                const selected = form.vehicleType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update("vehicleType", type.id)}
                    className={`group flex flex-col items-center gap-3 rounded-2xl border bg-white p-5 text-center transition hover:-translate-y-0.5 hover:border-blue ${
                      selected ? "border-blue ring-2 ring-blue/25" : "border-[#d9e3ee]"
                    }`}
                  >
                    <span className="relative block h-16 w-full">
                      <Image src={type.image} alt="" fill sizes="160px" className="object-contain" />
                    </span>
                    <span className="text-sm font-bold text-ink">{type.label}</span>
                    <span className="text-xs leading-snug text-zinc-500">{type.description}</span>
                  </button>
                );
              })}
            </div>
          </StepHeading>
        )}

        {step === 1 && (
          <StepHeading title="What condition is your vehicle in?" description="Be honest. Condition is what sets your offer.">
            <div className="mt-6 grid gap-3">
              {conditions.map((item) => {
                const selected = form.condition === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update("condition", item.id)}
                    className={`flex items-center justify-between gap-4 rounded-2xl border bg-white px-5 py-4 text-left transition hover:border-blue ${
                      selected ? "border-blue ring-2 ring-blue/25" : "border-[#d9e3ee]"
                    }`}
                  >
                    <span>
                      <span className="block font-bold text-ink">{item.label}</span>
                      <span className="block text-sm text-zinc-500">{item.description}</span>
                    </span>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                        selected ? "border-blue bg-blue text-white" : "border-[#c3d2e2]"
                      }`}
                    >
                      {selected && <Check className="h-3.5 w-3.5" aria-hidden />}
                    </span>
                  </button>
                );
              })}
            </div>
          </StepHeading>
        )}

        {step === 2 && (
          <StepHeading title="Tell us about your vehicle" description="Make, model and year help us price it accurately.">
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Make</span>
                <input className={inputClass} value={form.make} onChange={(e) => update("make", e.target.value)} placeholder="e.g. Toyota" autoComplete="off" />
              </label>
              <label className="block">
                <span className={labelClass}>Model</span>
                <input className={inputClass} value={form.model} onChange={(e) => update("model", e.target.value)} placeholder="e.g. Hilux" autoComplete="off" />
              </label>
              <label className="block">
                <span className={labelClass}>Year</span>
                <select className={inputClass} value={form.year} onChange={(e) => update("year", e.target.value)}>
                  <option value="">Select year</option>
                  {vehicleYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>
                  Registration <span className="font-normal text-zinc-400">(optional)</span>
                </span>
                <input className={`${inputClass} uppercase`} value={form.rego} onChange={(e) => update("rego", e.target.value)} placeholder="e.g. ABC123" maxLength={12} autoComplete="off" />
              </label>
            </div>
          </StepHeading>
        )}

        {step === 3 && (
          <StepHeading title="Where is the vehicle?" description="We come to you. Free towing is included in your offer.">
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Suburb</span>
                <input className={inputClass} value={form.suburb} onChange={(e) => update("suburb", e.target.value)} placeholder="e.g. Maitland" autoComplete="address-level2" />
              </label>
              <label className="block">
                <span className={labelClass}>Postcode</span>
                <input className={inputClass} value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} placeholder="e.g. 2320" inputMode="numeric" maxLength={4} autoComplete="postal-code" />
              </label>
            </div>
          </StepHeading>
        )}

        {step === 4 && (
          <StepHeading title="Where should we send your offer?" description="We only use these details to contact you about your vehicle.">
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Full name</span>
                <input className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" />
              </label>
              <label className="block">
                <span className={labelClass}>Phone</span>
                <input className={inputClass} type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" />
              </label>
              <label className="block sm:col-span-2">
                <span className={labelClass}>Email</span>
                <input className={inputClass} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" />
              </label>
              <label className="block sm:col-span-2">
                <span className={labelClass}>
                  Anything else? <span className="font-normal text-zinc-400">(optional)</span>
                </span>
                <textarea className={`${inputClass} min-h-24`} rows={3} value={form.note} onChange={(e) => update("note", e.target.value)} placeholder="Known faults, keys, preferred pickup time" />
              </label>
            </div>

            <label className="mt-5 flex items-start gap-3 text-sm text-zinc-600">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => update("consent", e.target.checked)}
                className="mt-1 h-4 w-4 accent-blue"
              />
              <span>
                I agree to be contacted about this request and have read the{" "}
                <a href="/privacy-policy" className="font-semibold text-blue underline">
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
          </StepHeading>
        )}

        {error && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            We couldn&apos;t send your request. Please call{" "}
            <a href={site.landlineHref} className="underline">
              {site.landlineDisplay}
            </a>{" "}
            and we&apos;ll take it over the phone.
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#e6edf5] pt-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-blue/10"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Back
            </button>
          ) : (
            <span />
          )}

          {isLast ? (
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-full bg-gradient-to-r from-brand to-brand-dark px-7 py-3.5 text-base font-bold text-navy shadow-[0_14px_34px_rgba(254,186,2,0.35)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Get my cash offer"}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="rounded-full bg-gradient-to-r from-brand to-brand-dark px-7 py-3.5 text-base font-bold text-navy shadow-[0_14px_34px_rgba(254,186,2,0.35)] transition hover:brightness-105"
            >
              Continue
            </button>
          )}
        </div>
      </form>
    </Card>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col rounded-3xl border border-[#d9e3ee] bg-white p-6 shadow-[0_24px_80px_rgba(0,35,80,0.12)] sm:p-9">
      {children}
    </div>
  );
}

function StepHeading({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
      <p className="mt-2 text-base text-zinc-600">{description}</p>
      {children}
    </div>
  );
}
