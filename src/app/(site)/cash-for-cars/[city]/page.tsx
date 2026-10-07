import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { PrimaryButton } from "@/components/Buttons";
import { cities, getCityBySlug } from "@/lib/cities";
import { guides } from "@/lib/guides";
import { vehicleTypes } from "@/lib/quote";
import { breadcrumbSchema, cityServiceSchema, faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata(props: PageProps<"/cash-for-cars/[city]">): Promise<Metadata> {
  const { city: slug } = await props.params;
  const city = getCityBySlug(slug);
  if (!city) return {};
  const url = `${site.url}/cash-for-cars/${city.slug}`;
  return {
    title: city.metaTitle,
    description: city.description,
    keywords: city.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: city.metaTitle,
      description: city.description,
      url,
      siteName: site.name,
      locale: "en_AU",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: city.metaTitle, description: city.description },
  };
}

export default async function CityPage(props: PageProps<"/cash-for-cars/[city]">) {
  const { city: slug } = await props.params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const nearby = city.nearby.map((s) => getCityBySlug(s)).filter((c): c is NonNullable<typeof c> => Boolean(c));

  const steps = [
    { title: "Get a quote", text: `Use the form or call us with your vehicle details and your ${city.name} suburb.` },
    { title: "Receive your cash offer", text: "We call you with an offer based on make, model, year and condition." },
    { title: "Free pick-up", text: `We collect from your home, work or roadside in ${city.name}, or you can drop it at a depot.` },
    { title: "Get paid", text: "The final price is confirmed on inspection and you are paid on pick-up as agreed." },
  ];

  return (
    <>
      <JsonLd data={cityServiceSchema(city)} />
      <JsonLd data={faqSchema(city.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: `Cash for cars ${city.name}`, path: `/cash-for-cars/${city.slug}` },
        ])}
      />
      <PageHero eyebrow={`Cash for cars ${city.name}`} title={city.h1} description={city.intro}>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <PrimaryButton href="/get-quote">Get my cash offer</PrimaryButton>
          <a
            href={site.phoneHref}
            className="inline-flex items-center justify-center rounded-full border-2 border-ink/20 px-6 py-3.5 text-base font-bold text-ink"
          >
            Call {site.phoneDisplay}
          </a>
        </div>
      </PageHero>

      <section className="py-16 sm:py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="max-w-3xl space-y-14">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                We buy every type of vehicle in {city.name}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-700">
                Running or not, registered or not, we make an offer on vehicles in any condition around {city.area}.
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {vehicleTypes.map((type) => (
                  <li key={type.id}>
                    <Link
                      href={`/get-quote?type=${type.id}`}
                      className="block rounded-2xl border border-ink/8 p-4 transition hover:border-brand"
                    >
                      <span className="font-bold text-ink">
                        Sell your {type.label.toLowerCase()} in {city.name}
                      </span>
                      <span className="mt-1 block text-sm text-zinc-600">{type.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-ink">How selling to us works</h2>
              <ol className="mt-5 space-y-4">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-ink">{step.title}</p>
                      <p className="text-sm leading-relaxed text-zinc-600">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-base leading-relaxed text-zinc-700">{city.pickup}</p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-ink">{city.localNote.heading}</h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-700">{city.localNote.text}</p>
              <p className="mt-4 text-base leading-relaxed text-zinc-700">{city.depot}</p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                {city.name} suburbs and towns we service
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {city.suburbs.map((suburb) => (
                  <li key={suburb} className="rounded-full bg-blue/10 px-4 py-1.5 text-sm font-semibold text-navy">
                    {suburb}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-zinc-600">
                Not on the list? Call {site.phoneDisplay} and we will confirm whether we can collect from your address.
                See all <Link href={city.locationHref} className="font-semibold text-navy underline">service locations</Link>.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Helpful guides for {city.name} car sellers
              </h2>
              <ul className="mt-5 space-y-3">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guides/${g.slug}`} className="font-semibold text-navy hover:underline">
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Cash for cars {city.name}: frequently asked questions
              </h2>
              <div className="mt-6">
                <FaqAccordion items={city.faqs} />
              </div>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-navy p-6 text-white">
              <p className="font-display text-lg font-bold">Free cash offer in {city.name}</p>
              <p className="mt-2 text-sm text-white/75">
                Any make, model or condition. Free towing. Final price confirmed on inspection.
              </p>
              <Link
                href="/get-quote"
                className="mt-4 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-bold text-navy"
              >
                Start my cash offer
              </Link>
              <a href={site.phoneHref} className="mt-4 block text-sm font-semibold text-white/90 hover:text-brand">
                Or call {site.phoneDisplay}
              </a>
            </div>
            <div className="rounded-3xl border border-ink/8 bg-white p-6">
              <p className="font-display text-base font-bold text-ink">Also servicing</p>
              <ul className="mt-3 space-y-3 text-sm">
                {nearby.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/cash-for-cars/${c.slug}`} className="text-navy hover:underline">
                      Cash for cars {c.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/services/scrap-car-removal" className="text-navy hover:underline">
                    Scrap car removal
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </Container>
      </section>

      <CtaBand
        title={`Ready to sell your car in ${city.name}?`}
        description="Get a free, no-obligation cash offer in minutes and arrange pick-up as soon as today."
      />
    </>
  );
}
