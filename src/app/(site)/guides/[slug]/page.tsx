import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { guides, getGuideBySlug } from "@/lib/guides";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(props: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  const url = `${site.url}/guides/${guide.slug}`;
  return {
    title: guide.metaTitle,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: guide.metaTitle,
      description: guide.description,
      url,
      siteName: site.name,
      locale: "en_AU",
      type: "article",
      modifiedTime: guide.updated,
    },
    twitter: { card: "summary_large_image", title: guide.metaTitle, description: guide.description },
  };
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const related = guide.related
    .map((s) => getGuideBySlug(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <>
      <JsonLd data={articleSchema(guide)} />
      <JsonLd data={faqSchema(guide.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ])}
      />
      <PageHero eyebrow="Guide" title={guide.title} description={guide.description} />

      <article className="py-16 sm:py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="max-w-3xl">
            <p className="text-sm text-zinc-500">
              By {site.name} · Updated{" "}
              <time dateTime={guide.updated}>
                {new Date(guide.updated).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>{" "}
              · {guide.readMinutes} min read
            </p>

            <div className="mt-6 rounded-3xl border border-blue/20 bg-blue/5 p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-blue">The short answer</p>
              <p className="mt-2 text-base leading-relaxed text-ink">{guide.summary}</p>
            </div>

            <nav aria-label="On this page" className="mt-8">
              <p className="text-sm font-bold text-ink">In this guide</p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-navy">
                {guide.sections.map((section, i) => (
                  <li key={section.heading}>
                    <a href={`#s${i + 1}`} className="hover:underline">
                      {section.heading}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#faq" className="hover:underline">
                    Frequently asked questions
                  </a>
                </li>
              </ol>
            </nav>

            {guide.sections.map((section, i) => (
              <section key={section.heading} id={`s${i + 1}`} className="mt-12 scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-ink">{section.heading}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p} className="mt-4 text-base leading-relaxed text-zinc-700">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-zinc-700">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section id="faq" className="mt-14 scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-ink">Frequently asked questions</h2>
              <div className="mt-6">
                <FaqAccordion items={guide.faqs} />
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-navy p-6 text-white">
              <p className="font-display text-lg font-bold">Get a free cash offer</p>
              <p className="mt-2 text-sm text-white/75">
                Any make, model or condition. Free towing across {site.areasSummary}.
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
              <p className="font-display text-base font-bold text-ink">Related</p>
              <ul className="mt-3 space-y-3 text-sm">
                {related.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guides/${g.slug}`} className="text-navy hover:underline">
                      {g.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/services/cash-for-cars" className="text-navy hover:underline">
                    Cash for cars
                  </Link>
                </li>
                <li>
                  <Link href="/services/free-car-removal" className="text-navy hover:underline">
                    Free car removal
                  </Link>
                </li>
                <li>
                  <Link href="/locations" className="text-navy hover:underline">
                    All service areas
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </Container>
      </article>

      <CtaBand />
    </>
  );
}
