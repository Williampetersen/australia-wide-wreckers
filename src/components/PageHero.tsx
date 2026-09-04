import { ReactNode } from "react";
import { Container } from "./Container";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink py-16 sm:py-20">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand/25 blur-3xl"
        aria-hidden
      />
      <Container className="relative">
        {eyebrow && (
          <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-balance mt-5 max-w-3xl text-4xl font-bold text-white sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
            {description}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
