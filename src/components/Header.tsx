import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";
import { PhoneCall } from "./Icons";
import { NAV_LINKS, site } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-white/90 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo/logo-black.png"
            alt={site.name}
            width={796}
            height={313}
            priority
            className="h-9 w-auto sm:h-11"
          />
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
