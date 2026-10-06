import Link from "next/link";
import { ReactNode } from "react";
import { PhoneCall } from "./Icons";
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
      className={`cta-alive inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base font-bold text-ink shadow-[0_14px_34px_rgba(254,186,2,0.35)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark active:translate-y-0 ${className}`}
    >
      {children}
    </Link>
  );
}

export function DarkButton({ href, children, className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`cta-alive inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-ink-soft active:translate-y-0 ${className}`}
    >
      {children}
    </Link>
  );
}

export function GhostButton({ href, children, className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink/15 px-6 py-3.5 text-base font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-ink active:translate-y-0 ${className}`}
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
      ? "border-2 border-white/20 bg-white/10 text-white hover:bg-white/15"
      : "bg-ink text-white hover:bg-ink-soft";

  return (
    <a
      href={site.phoneHref}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 ${variantClasses} ${className}`}
    >
      <PhoneCall className="h-5 w-5 text-brand" aria-hidden />
      Call {site.phoneDisplay}
    </a>
  );
}
