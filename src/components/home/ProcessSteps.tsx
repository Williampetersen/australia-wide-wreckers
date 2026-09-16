import { Container } from "../Container";
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
    <section className="bg-ink-glow relative py-20 sm:py-28">
      <Container className="relative">
        <FadeIn>
          <span className="mx-auto flex w-fit items-center justify-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white">
            How it works
          </span>
          <h2 className="font-display text-balance mx-auto mt-4 max-w-2xl text-center text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl">
            Cash in your hand in four easy steps
          </h2>
        </FadeIn>
        <Stagger className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <StaggerItem
              key={step.number}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              <span className="font-display text-brand text-3xl">
                {step.number}
              </span>
              <h3 className="font-display mt-4 text-lg text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {step.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
