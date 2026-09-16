import Link from "next/link";
import { ReactNode } from "react";
import { ArrowUpRight, PhoneCall } from "./Icons";
import { site } from "@/lib/site";

type ButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
};

export function PrimaryButton({ href, children, className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand-dark active:translate-y-0 ${className}`}
    >
      {children}
    </Link>
  );
}

/** White pill CTA for use over photos / dark backgrounds. */
export function PillButton({ href, children, className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-bold text-ink shadow-soft transition-all hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
      {children}
      <ArrowUpRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}

export function DarkButton({ href, children, className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-ink/90 active:translate-y-0 ${className}`}
    >
      {children}
    </Link>
  );
}

export function GhostButton({ href, children, className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink/12 px-6 py-3.5 text-base font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-ink/30 active:translate-y-0 ${className}`}
    >
      {children}
    </Link>
  );
}

export function CallButton({
  className = "",
  variant = "onDark",
}: {
  className?: string;
  variant?: "onDark" | "onLight";
}) {
  const variantClasses =
    variant === "onDark"
      ? "border-2 border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15"
      : "border-2 border-ink/12 bg-white text-ink hover:border-ink/30";

  return (
    <a
      href={site.phoneHref}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 ${variantClasses} ${className}`}
    >
      <PhoneCall className="h-4 w-4 text-brand" aria-hidden />
      Call {site.phoneDisplay}
    </a>
  );
}
