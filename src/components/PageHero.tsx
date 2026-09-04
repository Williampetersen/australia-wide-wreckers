import { ReactNode } from "react";
import Image from "next/image";
import { Container } from "./Container";
import { FadeIn } from "./motion/FadeIn";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  image,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand/25 blur-3xl"
        aria-hidden
      />
      <Container
        className={`relative ${image ? "grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.3fr_1fr]" : ""}`}
      >
        <FadeIn>
          {eyebrow && (
            <span className="inline-flex items-center rounded-full bg-brand/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-soft">
              {eyebrow}
            </span>
          )}
          <h1 className="font-display text-balance mt-5 max-w-3xl text-4xl font-bold text-ink sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
              {description}
            </p>
          )}
          {children}
        </FadeIn>

        {image && (
          <div className="relative mx-auto hidden aspect-[4/5] w-full max-w-xs overflow-hidden rounded-3xl border border-ink/8 bg-zinc-50 lg:block">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover object-left-top"
              sizes="320px"
              priority
            />
          </div>
        )}
      </Container>
    </section>
  );
}
