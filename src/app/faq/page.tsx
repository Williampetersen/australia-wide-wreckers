import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { FaqAccordion } from "@/components/FaqAccordion";
import { CtaBand } from "@/components/CtaBand";
import { FadeIn } from "@/components/motion/FadeIn";
import { JsonLd } from "@/components/JsonLd";
import { faqs } from "@/lib/faqs";
import { site } from "@/lib/site";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: `Answers to common questions about ${site.name}'s cash-for-cars and free car removal service.`,
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Can't find what you're looking for? Give our team a call and we'll be happy to help."
      />
      <section className="py-20 sm:py-28">
        <Container className="max-w-3xl">
          <FadeIn>
            <FaqAccordion items={faqs} />
          </FadeIn>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
