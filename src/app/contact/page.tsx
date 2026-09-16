import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { PhoneCall, Mail, Clock, MapPin } from "@/components/Icons";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
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
        image="/images/gallery/cash-in-hand.png"
      />

      <section className="py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-5">
          <FadeIn className="lg:col-span-3">
            <ContactForm />
          </FadeIn>

          <Stagger className="space-y-5 lg:col-span-2">
            <StaggerItem className="rounded-2xl border border-ink/8 bg-white p-7">
              <span className="bg-brand-soft flex h-11 w-11 items-center justify-center rounded-xl text-brand">
                <PhoneCall className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-display mt-4 text-lg text-ink">Call us</h3>
              <div className="mt-2 space-y-1 text-sm text-ink-soft">
                <a href={site.phoneHref} className="block font-semibold text-ink hover:text-brand">
                  {site.phoneDisplay}
                </a>
                <a href={site.phoneHrefSecondary} className="block font-semibold text-ink hover:text-brand">
                  {site.phoneDisplaySecondary}
                </a>
                <a href={site.landlineHref} className="block font-semibold text-ink hover:text-brand">
                  {site.landlineDisplay}
                </a>
              </div>
            </StaggerItem>

            <StaggerItem className="rounded-2xl border border-ink/8 bg-white p-7">
              <span className="bg-brand-soft flex h-11 w-11 items-center justify-center rounded-xl text-brand">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-display mt-4 text-lg text-ink">Email us</h3>
              <a
                href={`mailto:${site.email}`}
                className="mt-2 block text-sm font-semibold text-ink hover:text-brand"
              >
                {site.email}
              </a>
            </StaggerItem>

            <StaggerItem className="rounded-2xl border border-ink/8 bg-white p-7">
              <span className="bg-brand-soft flex h-11 w-11 items-center justify-center rounded-xl text-brand">
                <Clock className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-display mt-4 text-lg text-ink">Hours</h3>
              <div className="mt-2 space-y-1 text-sm text-ink-soft">
                {site.hours.map((h) => (
                  <p key={h.days}>
                    {h.days}: {h.time}
                  </p>
                ))}
              </div>
            </StaggerItem>

            <StaggerItem className="rounded-2xl border border-ink/8 bg-white p-7">
              <span className="bg-brand-soft flex h-11 w-11 items-center justify-center rounded-xl text-brand">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-display mt-4 text-lg text-ink">Service area</h3>
              <p className="mt-2 text-sm text-ink-soft">{site.areasSummary}</p>
            </StaggerItem>

            <StaggerItem className="rounded-2xl border border-ink/8 bg-white p-7">
              <h3 className="font-display text-lg text-ink">Our depots</h3>
              <div className="mt-4 space-y-4">
                {site.depots.map((depot) => (
                  <div key={depot.name} className="flex items-center gap-3">
                    <div className="relative h-8 w-20 shrink-0">
                      <Image
                        src={depot.logo}
                        alt={depot.name}
                        fill
                        className="object-contain object-left"
                        sizes="80px"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{depot.name}</p>
                      <p className="text-sm text-ink-soft">{depot.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </StaggerItem>
          </Stagger>
        </Container>
      </section>
    </>
  );
}
