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
        <span className="inline-flex items-center rounded-full bg-brand/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-soft">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-balance mt-4 text-3xl font-bold text-ink sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-zinc-600">
          {description}
        </p>
      )}
    </div>
  );
}
