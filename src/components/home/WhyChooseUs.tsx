import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { CheckCircle2 } from "../Icons";
import { FadeIn } from "../motion/FadeIn";
import { Stagger, StaggerItem } from "../motion/Stagger";

const reasons = [
  {
    title: "Fair, transparent quotes",
    description:
      "No lowball tactics. We assess your vehicle honestly and explain exactly how we arrived at your offer.",
  },
  {
    title: "Zero cost to you",
    description:
      "Free towing, free paperwork assistance and no hidden fees, ever. What we quote is what you get.",
  },
  {
    title: "Fast, flexible scheduling",
    description:
      "We work around your availability, with same-day and after-hours pickups available across our service area.",
  },
  {
    title: "Responsible recycling",
    description:
      "Vehicles are dismantled at a licensed facility, with usable parts resold and materials recycled properly.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
        <FadeIn>
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Straightforward car removal, done right"
            description="We've built our process around what actually matters to you: a fair price, a fast pickup, and cash in your hand without the runaround."
          />
        </FadeIn>
        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {reasons.map((reason) => (
            <StaggerItem key={reason.title} className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cash/15 text-cash-dark">
                <CheckCircle2 className="h-4.5 w-4.5" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-ink">
                  {reason.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                  {reason.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
