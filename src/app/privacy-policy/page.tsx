import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects your personal information.`,
};

const lastUpdated = "6 September 2026";

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description={`Last updated: ${lastUpdated}`}
      />
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-8 text-base leading-relaxed text-zinc-600">
            <p>
              {site.name} (ABN: {site.abn}, &ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your
              privacy and is committed to handling personal information in
              accordance with the Australian Privacy Principles under the
              Privacy Act 1988 (Cth). This policy explains what we collect,
              why, and how you can contact us about it.
            </p>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Information we collect
              </h2>
              <p className="mt-3">
                When you request a quote through our website, phone or email,
                we collect the information you provide, which may include your
                name, phone number, email address, suburb and postal code, and
                details about your vehicle (make, model, year and condition).
                We also collect standard technical information automatically,
                such as pages visited and general location, through analytics
                tools described below.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                How we use your information
              </h2>
              <p className="mt-3">We use your information to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Prepare and provide a cash offer for your vehicle</li>
                <li>Arrange and confirm free vehicle removal or pickup</li>
                <li>Respond to enquiries sent via our contact form, phone or email</li>
                <li>Improve our website and services</li>
              </ul>
              <p className="mt-3">
                We do not sell your personal information to third parties. We
                only share it with service providers who help us run our
                business — for example, the email delivery provider that
                routes quote requests to our team — and only to the extent
                needed for that purpose.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Cookies and analytics
              </h2>
              <p className="mt-3">
                Our website may use Google Analytics and, where enabled, the
                Meta (Facebook) Pixel to understand how visitors use our site
                and to measure the effectiveness of our advertising. These
                tools use cookies and similar technologies and may collect
                information such as your IP address, device type and browsing
                behaviour on our site. You can control or disable cookies
                through your browser settings at any time.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Data storage and security
              </h2>
              <p className="mt-3">
                We take reasonable steps to protect the personal information
                we hold from misuse, loss, and unauthorised access,
                modification or disclosure. Quote request details are
                retained only as long as needed to provide our service and
                meet our legal obligations.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Access and correction
              </h2>
              <p className="mt-3">
                You can ask us for access to, or correction of, the personal
                information we hold about you at any time by contacting us
                using the details below.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Contact us
              </h2>
              <p className="mt-3">
                If you have any questions about this policy or how we handle
                your information, contact us at{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-semibold text-brand-dark hover:underline"
                >
                  {site.email}
                </a>{" "}
                or call{" "}
                <a
                  href={site.phoneHref}
                  className="font-semibold text-brand-dark hover:underline"
                >
                  {site.phoneDisplay}
                </a>
                . If you remain unsatisfied, you can lodge a complaint with
                the Office of the Australian Information Commissioner (OAIC)
                at oaic.gov.au.
              </p>
            </div>

            <p className="text-sm text-zinc-500">
              This policy is a general template and has not been reviewed by a
              lawyer. We recommend having it checked against your specific
              data practices before relying on it.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
