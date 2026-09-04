import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { CtaBand } from "@/components/CtaBand";
import { MapPin } from "@/components/Icons";
import { regions } from "@/lib/locations";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Service Locations",
  description: `${site.name} provides free car removal and top cash offers across ${site.areasSummary}.`,
};

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Service Locations"
        title="Find your nearest car removal service"
        description="We service a wide area across NSW. Select your region below, or call us to check if we cover your suburb."
      />
      <section className="py-20 sm:py-28">
        <Container className="space-y-14">
          {regions.map((region) => (
            <div key={region.slug} id={region.slug}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-brand">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">
                    {region.name}
                  </h2>
                  <p className="text-sm text-zinc-600">{region.blurb}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {region.locations.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/locations/${loc.slug}`}
                    className="group rounded-2xl border border-ink/8 bg-zinc-50 p-5 transition-colors hover:border-brand"
                  >
                    <p className="font-display font-bold text-ink">
                      {loc.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      {loc.region}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
