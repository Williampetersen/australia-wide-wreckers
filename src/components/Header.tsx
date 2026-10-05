import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";
import { PhoneCall, ChevronRight } from "./Icons";
import { NAV_LINKS, site } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <Container className="flex min-h-16 items-center justify-between gap-4 py-3 sm:h-20">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/logo/logo-white.png"
            alt={site.name}
            width={796}
            height={313}
            priority
            className="h-8 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative whitespace-nowrap px-3.5 py-2 text-sm font-medium text-white/80 transition hover:text-white"
            >
              {link.label}
              <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={site.landlineHref}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-white/20 px-4 py-2.5 text-xs font-semibold text-white/85 transition-colors hover:border-brand hover:text-white md:inline-flex lg:text-sm"
          >
            <PhoneCall className="h-3.5 w-3.5 text-brand" aria-hidden />
            {site.landlineDisplay}
          </a>
          <Link
            href="/get-quote"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-brand to-brand-dark px-4 py-2.5 text-xs font-bold text-navy shadow-[0_14px_34px_rgba(254,186,2,0.35)] transition hover:brightness-110 sm:px-5 sm:text-sm"
          >
            Get a Cash Offer
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
