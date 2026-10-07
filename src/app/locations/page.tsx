import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { CtaBand } from "@/components/CtaBand";
import { VisitUs } from "@/components/VisitUs";
import { MapPin } from "@/components/Icons";
import { regions } from "@/lib/locations";
import { cities } from "@/lib/cities";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Service Locations",
  description: `${site.name} provides free car removal and top cash offers across ${site.areasSummary}.`,
  alternates: {
    canonical: `${site.url}/locations`,
  },
};

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Service Locations"
        title="Visit us or we come to you"
        description="Visit one of our two depots, or we come to you. We cover a wide area across NSW, so select your region below or call to check your suburb."
      />
      <VisitUs />
      <section className="py-20 sm:py-28">
        <Container className="space-y-14">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Cash for cars by city</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {cities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/cash-for-cars/${c.slug}`}
                  className="rounded-2xl border border-ink/8 bg-zinc-50 p-5 font-bold text-ink transition-colors hover:border-brand"
                >
                  Cash for cars {c.name}
                </Link>
              ))}
            </div>
          </div>
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
              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
                {region.locations.map((loc) => (
                  <li key={loc.slug}>
                    <Link
                      href={`/locations/${loc.slug}`}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-brand/15 hover:text-navy"
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-dark" aria-hidden />
                      {loc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
