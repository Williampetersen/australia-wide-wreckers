import type { Metadata } from "next";
import Image from "next/image";
import { PhoneCall } from "@/components/Icons";
import { Container } from "@/components/Container";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a Cash Offer For Your Car",
  description: `Sell your car, ute, van, truck or motorbike to ${site.name}. Send us a few details and we'll call you with a cash offer. Free towing across ${site.areasSummary}.`,
  alternates: {
    canonical: `${site.url}/get-quote`,
  },
};

export default function GetQuotePage() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden py-6">
      <Image src="/images/hero/hero.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover scale-110 blur-md" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-navy/55" aria-hidden />

      <Container className="flex flex-col items-center gap-4">
        <div className="w-full max-w-sm">
          <QuoteForm />
        </div>
        <a
          href={site.landlineHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
        >
          <PhoneCall className="h-4 w-4 text-brand" aria-hidden />
          Or call {site.landlineDisplay}
        </a>
      </Container>
    </section>
  );
}
