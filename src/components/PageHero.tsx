import { ReactNode } from "react";
import Image from "next/image";
import { Container } from "./Container";
import { FadeIn } from "./motion/FadeIn";
import { CheckCircle2 } from "./Icons";

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
    <section className="bg-ink-glow relative overflow-hidden py-16 sm:py-20">
      <Container
        className={`relative ${image ? "grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.3fr_1fr]" : ""}`}
      >
        <FadeIn>
          {eyebrow && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white">
              <CheckCircle2 className="h-3.5 w-3.5 text-brand" aria-hidden />
              {eyebrow}
            </span>
          )}
          <h1 className="font-display text-balance mt-5 max-w-3xl text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
              {description}
            </p>
          )}
          {children}
        </FadeIn>

        {image && (
          <div className="shadow-soft-lg relative mx-auto hidden aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:block">
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
