import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { PrimaryButton, CallButton } from "@/components/Buttons";
import { CtaBand } from "@/components/CtaBand";
import { ServiceCard } from "@/components/ServiceCard";
import { CheckCircle2 } from "@/components/Icons";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/JsonLd";
import { allLocations, getLocationBySlug } from "@/lib/locations";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { locationSchema } from "@/lib/schema";

export function generateStaticParams() {
  return allLocations.map((loc) => ({ slug: loc.slug }));
}

export async function generateMetadata(
  props: PageProps<"/locations/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const location = getLocationBySlug(slug);
  if (!location) return {};
  return {
    title: `Cash For Cars ${location.name}`,
    description: `Free car removal and top cash offers in ${location.name}. Same-day pickup available across ${location.region}.`,
  };
}

export default async function LocationDetailPage(
  props: PageProps<"/locations/[slug]">
) {
  const { slug } = await props.params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  const featuredServices = services.slice(0, 3);

  return (
    <>
      <JsonLd data={locationSchema(location)} />
      <PageHero
        eyebrow={location.region}
        title={`Cash For Cars in ${location.name}`}
        description={`Get a free quote and same-day, no-cost vehicle removal in ${location.name} and surrounding suburbs. Any make, model or condition.`}
        image={location.heroImage}
      >
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <PrimaryButton href="/contact">Get Your Free Quote</PrimaryButton>
          <CallButton variant="onLight" />
        </div>
      </PageHero>

      <section className="py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-3">
          <FadeIn className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-ink">
              Trusted car removal for {location.name} locals
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600">
              Whether your vehicle is old, damaged or simply unwanted, our
              team provides fast, fair quotes and free towing anywhere in{" "}
              {location.name} and the wider {location.region} area. Book a
              pickup time that suits you and get paid cash the moment we
              arrive.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                `Free towing anywhere in ${location.name}`,
                "Same-day and next-day pickup available",
                "Cash paid on the spot, no waiting",
                "All makes, models and conditions accepted",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cash-dark" aria-hidden />
                  <span className="text-base text-zinc-700">{point}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <aside className="rounded-3xl border border-ink/8 bg-zinc-50 p-7 lg:sticky lg:top-28 lg:h-fit">
            <h3 className="font-display text-lg font-bold text-ink">
              Other nearby areas
            </h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {allLocations
                .filter((l) => l.slug !== location.slug && l.region === location.region)
                .map((l) => (
                  <Link
                    key={l.slug}
                    href={`/locations/${l.slug}`}
                    className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-brand hover:text-ink"
                  >
                    {l.name}
                  </Link>
                ))}
            </div>
            <Link
              href="/locations"
              className="mt-5 inline-block text-sm font-bold text-brand-dark"
            >
              View all locations →
            </Link>
          </aside>
        </Container>
      </section>

      <section className="bg-zinc-50 py-20 sm:py-28">
        <Container>
          <FadeIn>
            <h2 className="font-display text-2xl font-bold text-ink">
              Popular services in {location.name}
            </h2>
          </FadeIn>
          <Stagger className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((s) => (
              <StaggerItem key={s.slug} className="h-full">
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <CtaBand
        title={`Get cash for your car in ${location.name} today`}
        description={`Call ${site.phoneDisplay} or request a free quote online and we'll organise pickup at a time that works for you.`}
      />
    </>
  );
}
