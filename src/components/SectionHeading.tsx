import { CheckCircle2 } from "./Icons";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <span
          className={`bg-brand-soft inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-brand-dark ${align === "center" ? "justify-center" : ""}`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-balance mt-4 text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
    </div>
  );
}
