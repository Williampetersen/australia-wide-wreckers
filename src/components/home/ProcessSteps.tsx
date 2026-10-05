import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { FadeIn } from "../motion/FadeIn";
import { Stagger, StaggerItem } from "../motion/Stagger";

const steps = [
  {
    number: "01",
    title: "Get your free quote",
    description:
      "Call us or fill out our online form with your car's details. We'll give you a fair, obligation-free offer.",
  },
  {
    number: "02",
    title: "Accept the offer",
    description:
      "Happy with the price? Lock it in and book a pickup time that suits you, any day of the week.",
  },
  {
    number: "03",
    title: "We come to you",
    description:
      "Our tow truck arrives at your home, office or roadside location and loads your vehicle at no cost.",
  },
  {
    number: "04",
    title: "Get paid on the spot",
    description:
      "We handle the paperwork and pay you in cash the moment your vehicle is picked up. It's that simple.",
  },
];

export function ProcessSteps() {
  return (
    <section className="bg-zinc-50 py-20 sm:py-28">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="How It Works"
            title="Cash in your hand in four easy steps"
            align="center"
          />
        </FadeIn>
        <Stagger className="relative mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <StaggerItem
              key={step.number}
              className="relative rounded-3xl border border-ink/8 bg-white p-7 transition-transform hover:-translate-y-1"
            >
              <span className="font-display text-4xl font-bold text-brand-dark/50">
                {step.number}
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {step.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
