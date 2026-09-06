import { Container } from "../Container";
import { ContactForm } from "../ContactForm";
import { CheckCircle2 } from "../Icons";
import { FadeIn } from "../motion/FadeIn";
import { Stagger, StaggerItem } from "../motion/Stagger";

const trustPoints = [
  "Free towing, every time",
  "All makes & conditions",
  "Cash paid on pickup",
  "NSW-wide service",
];

export function QuoteSection() {
  return (
    <section className="bg-zinc-50 py-20 sm:py-28">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <FadeIn>
          <span className="inline-flex items-center rounded-full bg-brand/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-soft">
            Free, No-Obligation Quote
          </span>
          <h2 className="font-display mt-5 text-3xl font-bold text-ink sm:text-4xl">
            Get cash for your car today
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-600">
            Tell us about your vehicle and we&apos;ll get back to you with a
            fair cash offer, or call us directly for an instant quote.
          </p>
          <Stagger className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
            {trustPoints.map((point) => (
              <StaggerItem
                key={point}
                className="flex items-center gap-2 text-sm font-medium text-ink-soft"
              >
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-brand-dark"
                  aria-hidden
                />
                {point}
              </StaggerItem>
            ))}
          </Stagger>
        </FadeIn>

        <FadeIn className="rounded-3xl border border-ink/8 bg-white p-7 shadow-xl sm:p-9">
          <h3 className="font-display text-lg font-bold text-ink sm:text-xl">
            Get Cash Offer Now
          </h3>
          <div className="mt-5">
            <ContactForm variant="light" />
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
