import { Container } from "./Container";
import { PillButton, CallButton } from "./Buttons";
import { FadeIn } from "./motion/FadeIn";

export function CtaBand({
  title = "Ready to turn your car into cash today?",
  description = "Get a free, no-obligation quote in minutes and have your vehicle picked up as soon as today.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-ink-glow relative overflow-hidden py-20 sm:py-24">
      <FadeIn>
        <Container className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-balance text-3xl leading-[1.05] tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-white/70">
              {description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-4 sm:flex-row">
            <PillButton href="/contact">Get Your Free Quote</PillButton>
            <CallButton variant="onDark" />
          </div>
        </Container>
      </FadeIn>
    </section>
  );
}
