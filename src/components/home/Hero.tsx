import { Container } from "../Container";
import { PrimaryButton, CallButton } from "../Buttons";
import { CheckCircle2 } from "../Icons";
import { site } from "@/lib/site";

const trustPoints = [
  "Free towing, every time",
  "All makes & conditions",
  "Cash paid on pickup",
  "NSW-wide service",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-cash/20 blur-3xl"
        aria-hidden
      />

      <Container className="relative py-20 sm:py-28 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
              NSW&apos;s Trusted Car Removal Team
            </span>
            <h1 className="font-display text-balance mt-6 text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Top Cash For Your Car,{" "}
              <span className="text-brand">Up To $10,000</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-300">
              {site.description} Get a free quote now and have it picked up
              as soon as today.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <PrimaryButton href="/contact">Get Your Free Quote</PrimaryButton>
              <CallButton />
            </div>

            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3">
              {trustPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-300"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Instant Estimate
              </p>
              <p className="font-display mt-2 text-5xl font-bold text-white">
                Up to{" "}
                <span className="text-brand">$10,000</span>
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Based on make, model, condition and current scrap metal &amp;
                parts value.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  ["No Runner", "Still Accepted"],
                  ["Any Age", "No Problem"],
                  ["Same Day", "Pickup"],
                  ["No Fees", "Ever"],
                ].map(([a, b]) => (
                  <div
                    key={a}
                    className="rounded-2xl bg-white/5 p-4 text-center"
                  >
                    <p className="font-display text-lg font-bold text-brand">
                      {a}
                    </p>
                    <p className="text-xs text-zinc-400">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
