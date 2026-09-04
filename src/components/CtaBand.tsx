import { Container } from "./Container";
import { DarkButton } from "./Buttons";
import { PhoneCall } from "./Icons";
import { FadeIn } from "./motion/FadeIn";
import { site } from "@/lib/site";

export function CtaBand({
  title = "Ready to turn your car into cash today?",
  description = "Get a free, no-obligation quote in minutes and have your vehicle picked up as soon as today.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand py-16 sm:py-20">
      <div
        className="bg-grid pointer-events-none absolute inset-0 opacity-20"
        aria-hidden
      />
      <FadeIn>
        <Container className="relative flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-balance max-w-2xl text-3xl font-bold text-ink sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-ink/80">
            {description}
          </p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row">
            <DarkButton href="/contact">Get Your Free Quote</DarkButton>
            <a
              href={site.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink/25 px-6 py-3.5 text-base font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-ink active:translate-y-0"
            >
              <PhoneCall className="h-5 w-5" aria-hidden />
              Call {site.phoneDisplay}
            </a>
          </div>
        </Container>
      </FadeIn>
    </section>
  );
}
