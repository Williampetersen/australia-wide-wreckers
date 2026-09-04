import Link from "next/link";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";
import { PhoneCall } from "./Icons";
import { NAV_LINKS, site } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-white/90 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            Australia Wide
            <span className="ml-1.5 rounded-md bg-brand px-1.5 py-0.5 text-ink">
              Wreckers
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-ink-soft sm:inline-flex"
          >
            <PhoneCall className="h-4 w-4 text-brand" aria-hidden />
            {site.phoneDisplay}
          </a>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
