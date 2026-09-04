import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
                    className="group overflow-hidden rounded-2xl border border-ink/8 bg-zinc-50 transition-colors hover:border-brand"
                  >
                    {loc.heroImage && (
                      <div className="relative h-24 w-full overflow-hidden bg-zinc-100">
                        <Image
                          src={loc.heroImage}
                          alt=""
                          fill
                          className="object-cover object-[50%_20%] transition-transform group-hover:scale-105"
                          sizes="240px"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="font-display font-bold text-ink">
                        {loc.name}
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        {loc.region}
                      </p>
                    </div>
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
