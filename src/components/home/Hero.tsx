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
    <section className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-ink sm:min-h-[720px]">
      <Image
        src="/images/gallery/handing-over-keys.jpg"
        alt="Handing over car keys after a cash sale"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

      <Container className="relative py-20 sm:py-28 lg:py-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
            NSW&apos;s Trusted Car Removal Team
          </span>
          <h1 className="font-display text-balance mt-6 text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Top Cash For Your Car,{" "}
            <span className="text-brand">Up To {site.cashOfferMax}</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-200">
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
                className="flex items-center gap-2 text-sm font-medium text-zinc-200"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
