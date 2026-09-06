import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms and conditions for using the ${site.name} website and quote service.`,
};

const lastUpdated = "6 September 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description={`Last updated: ${lastUpdated}`}
      />
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-8 text-base leading-relaxed text-zinc-600">
            <p>
              These terms govern your use of the {site.name} website (
              {site.url}) and the quote and vehicle removal service we
              advertise on it. By using our website or requesting a quote, you
              agree to these terms.
            </p>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Quotes are estimates
              </h2>
              <p className="mt-3">
                Any cash offer given over the phone, by email or through our
                website form — including any figure up to {site.cashOfferMax}{" "}
                — is a preliminary estimate based on the information you
                provide. The final offer is confirmed once we or our team
                have inspected the vehicle in person, and may differ from the
                initial estimate if the vehicle&apos;s condition, completeness
                or documentation differs from what was described.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Ownership and paperwork
              </h2>
              <p className="mt-3">
                You must be the legal owner of the vehicle, or have the
                owner&apos;s authorisation, to accept an offer and arrange
                pickup. You are responsible for providing accurate proof of
                ownership and identification as requested at the time of
                pickup. We reserve the right to decline a pickup if ownership
                cannot be reasonably confirmed.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Free removal service
              </h2>
              <p className="mt-3">
                Vehicle towing is provided free of charge as described on our
                website within our stated service area. Availability of
                same-day or next-day pickup depends on your location,
                vehicle access and current scheduling, and is not guaranteed.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Website content
              </h2>
              <p className="mt-3">
                We aim to keep the information on this website accurate and
                up to date, including service areas, pricing information and
                contact details, but we do not guarantee it is free of errors
                at all times. Content on this site, including text, images
                and branding, remains the property of {site.name} and may not
                be reproduced without permission.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Limitation of liability
              </h2>
              <p className="mt-3">
                To the extent permitted by law, {site.name} is not liable for
                any indirect or consequential loss arising from your use of
                this website or reliance on an estimated quote. Nothing in
                these terms limits any consumer guarantee that cannot be
                excluded under the Australian Consumer Law.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Governing law
              </h2>
              <p className="mt-3">
                These terms are governed by the laws of New South Wales,
                Australia.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Contact us
              </h2>
              <p className="mt-3">
                Questions about these terms can be sent to{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-semibold text-brand-dark hover:underline"
                >
                  {site.email}
                </a>{" "}
                or {site.phoneDisplay}.
              </p>
            </div>

            <p className="text-sm text-zinc-500">
              This is a general template and has not been reviewed by a
              lawyer. We recommend having it checked against your specific
              business practices before relying on it.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
