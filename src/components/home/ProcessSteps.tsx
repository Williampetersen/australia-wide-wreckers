import { Banknote, ClipboardCheck, Phone, Truck } from "lucide-react";
import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { FadeIn } from "../motion/FadeIn";
import { Stagger, StaggerItem } from "../motion/Stagger";

const steps = [
  {
    number: "01",
    icon: Phone,
    title: "Get your free quote",
    description:
      "Call us or fill out our online form with your car's details. We'll give you a fair, obligation-free offer.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Accept the offer",
    description:
      "Happy with the price? Lock it in and book a pickup time that suits you, any day of the week.",
  },
  {
    number: "03",
    icon: Truck,
    title: "We come to you",
    description:
      "Our tow truck arrives at your home, office or roadside location and loads your vehicle at no cost.",
  },
  {
    number: "04",
    icon: Banknote,
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
        <div className="relative mt-14">
          <div
            className="pointer-events-none absolute top-[3.1rem] right-[12%] left-[12%] hidden border-t-2 border-dashed border-brand/60 lg:block"
            aria-hidden
          />
          <Stagger className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <StaggerItem
                  key={step.number}
                  className="group relative rounded-3xl border border-ink/8 bg-white p-7 pt-9 text-center transition-all hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,35,80,0.12)]"
                >
                  <span className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-navy text-sm font-bold text-white shadow-md">
                    {step.number}
                  </span>
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/20 text-ink transition-transform group-hover:scale-110 group-hover:-rotate-6">
                    <Icon className="h-8 w-8" aria-hidden />
                  </span>
                  <h3 className="font-display mt-5 text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{step.description}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
