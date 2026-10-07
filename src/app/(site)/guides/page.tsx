import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { guides } from "@/lib/guides";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Car Selling Guides",
  description: `Practical guides on selling a damaged, old or unwanted car for cash in NSW, and where to get the best price. From ${site.name}.`,
  alternates: { canonical: `${site.url}/guides` },
};

export default function GuidesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ])}
      />
      <PageHero
        eyebrow="Guides"
        title="Car selling guides"
        description="Straight answers on selling a damaged, old or unwanted vehicle, getting a good price and what to do about the paperwork."
      />
      <section className="py-20 sm:py-28">
        <Container>
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {guides.map((guide) => (
              <StaggerItem key={guide.slug} className="h-full">
                <Link
                  href={`/guides/${guide.slug}`}
                  className="flex h-full flex-col rounded-3xl border border-ink/8 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-soft"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-blue">
                    {guide.readMinutes} min read
                  </span>
                  <h2 className="font-display mt-3 text-xl font-bold text-ink">{guide.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600">{guide.description}</p>
                  <span className="mt-5 text-sm font-bold text-navy">Read the guide →</span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
