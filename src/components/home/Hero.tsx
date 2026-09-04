import Image from "next/image";
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
              <span className="text-brand">Up To {site.cashOfferMax}</span>
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

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <Image
                src="/images/gallery/tow-truck-loading.jpg"
                alt="Australia Wide Wreckers tow truck loading a car for free removal"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 560px, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
            </div>

            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-ink/80 p-5 shadow-xl backdrop-blur-md sm:left-8 sm:right-auto sm:w-72">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Instant Estimate
              </p>
              <p className="font-display mt-1 text-3xl font-bold text-white">
                Up to <span className="text-brand">{site.cashOfferMax}</span>
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Based on make, model and condition
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
