import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { PhoneCall, Mail, Clock, MapPin } from "@/components/Icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get a free quote from ${site.name}. Call, email, or send us your vehicle details online.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Get your free, no-obligation quote"
        description="Tell us about your vehicle and we'll get back to you with a fair cash offer, or call us directly for an instant quote."
      />

      <section className="py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-5">
          <div className="rounded-3xl border border-ink/8 bg-zinc-50 p-7 sm:p-10 lg:col-span-3">
            <h2 className="font-display text-2xl font-bold text-ink">
              Get Cash Offer Now
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Fill in your vehicle and contact details below and we&apos;ll
              get back to you with a cash offer as soon as possible.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-3xl border border-ink/8 bg-white p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-brand">
                <PhoneCall className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-ink">
                Call us
              </h3>
              <div className="mt-2 space-y-1 text-sm text-zinc-600">
                <a href={site.phoneHref} className="block font-semibold text-ink hover:text-brand-dark">
                  {site.phoneDisplay}
                </a>
                <a href={site.phoneHrefSecondary} className="block font-semibold text-ink hover:text-brand-dark">
                  {site.phoneDisplaySecondary}
                </a>
                <a href={site.landlineHref} className="block font-semibold text-ink hover:text-brand-dark">
                  {site.landlineDisplay}
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-ink/8 bg-white p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-brand">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-ink">
                Email us
              </h3>
              <a
                href={`mailto:${site.email}`}
                className="mt-2 block text-sm font-semibold text-ink hover:text-brand-dark"
              >
                {site.email}
              </a>
            </div>

            <div className="rounded-3xl border border-ink/8 bg-white p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-brand">
                <Clock className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-ink">
                Hours
              </h3>
              <div className="mt-2 space-y-1 text-sm text-zinc-600">
                {site.hours.map((h) => (
                  <p key={h.days}>
                    {h.days}: {h.time}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-ink/8 bg-white p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-brand">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-ink">
                Service area
              </h3>
              <p className="mt-2 text-sm text-zinc-600">{site.areasSummary}</p>
            </div>

            <div className="rounded-3xl border border-ink/8 bg-white p-7">
              <h3 className="font-display text-lg font-bold text-ink">
                Our depots
              </h3>
              <div className="mt-3 space-y-3">
                {site.depots.map((depot) => (
                  <div key={depot.name}>
                    <p className="text-sm font-semibold text-ink">{depot.name}</p>
                    <p className="text-sm text-zinc-600">{depot.address}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
