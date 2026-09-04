import Link from "next/link";
import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { PrimaryButton } from "../Buttons";
import { FadeIn } from "../motion/FadeIn";
import { Stagger, StaggerItem } from "../motion/Stagger";
import { regions } from "@/lib/locations";
import { MapPin } from "../Icons";

export function ServiceAreas() {
  return (
    <section className="bg-zinc-50 py-20 sm:py-28">
      <Container>
        <FadeIn className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Where We Operate"
            title="Proudly covering Newcastle, Lake Macquarie & the Hunter"
            description="Don't see your suburb listed? Give us a call, chances are we still service your area."
          />
          <PrimaryButton href="/locations" className="shrink-0">
            View All Locations
          </PrimaryButton>
        </FadeIn>

        <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {regions.map((region) => (
            <StaggerItem
              key={region.slug}
              className="rounded-3xl border border-ink/8 bg-white p-7"
            >
              <div id={region.slug} className="flex items-center gap-3 scroll-mt-28">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-brand">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-display text-xl font-bold text-ink">
                  {region.name}
                </h3>
              </div>
              <p className="mt-3 text-sm text-zinc-600">{region.blurb}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {region.locations.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/locations/${loc.slug}`}
                    className="rounded-full border border-ink/10 bg-zinc-50 px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-brand hover:text-ink"
                  >
                    {loc.name}
                  </Link>
                ))}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
