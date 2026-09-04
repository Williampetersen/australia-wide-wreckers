import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";
import { PhoneCall, ChevronRight } from "./Icons";
import { NAV_LINKS, site } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-white/90 backdrop-blur-md">
      <Container className="flex min-h-16 items-center justify-between gap-4 py-3 sm:h-20">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/logo/logo-black.png"
            alt={site.name}
            width={796}
            height={313}
            priority
            className="h-8 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold whitespace-nowrap text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={site.landlineHref}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-ink/15 px-4 py-2.5 text-xs font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink md:inline-flex lg:text-sm"
          >
            Schedule a Pickup
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            {site.landlineDisplay}
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand px-4 py-2.5 text-xs font-bold text-ink transition-all hover:-translate-y-0.5 hover:bg-brand-dark sm:px-5 sm:text-sm"
          >
            <PhoneCall className="h-3.5 w-3.5 sm:hidden" aria-hidden />
            Free Quote
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
