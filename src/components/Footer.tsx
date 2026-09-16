import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";
import { Mail, PhoneCall, MapPin, Clock } from "./Icons";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { regions } from "@/lib/locations";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-glow text-white/60">
      <Container className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/images/logo/logo-white.png"
            alt={site.name}
            width={796}
            height={313}
            className="h-9 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            {site.description}
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-white/60">
            <Clock className="h-4 w-4 shrink-0 text-brand" aria-hidden />
            <div>
              {site.hours.map((h) => (
                <div key={h.days}>
                  {h.days}: {h.time}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-wide text-white/40 uppercase">
            Services
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-white/60 transition-colors hover:text-brand"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-wide text-white/40 uppercase">
            Service Areas
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {regions.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/locations#${r.slug}`}
                  className="text-white/60 transition-colors hover:text-brand"
                >
                  {r.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/locations"
                className="font-semibold text-brand transition-colors hover:text-brand-dark"
              >
                View all locations →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-wide text-white/40 uppercase">
            Get In Touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={site.phoneHref}
                className="flex items-center gap-2 text-white/60 transition-colors hover:text-brand"
              >
                <PhoneCall className="h-4 w-4 shrink-0" aria-hidden />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={site.phoneHrefSecondary}
                className="flex items-center gap-2 text-white/60 transition-colors hover:text-brand"
              >
                <PhoneCall className="h-4 w-4 shrink-0" aria-hidden />
                {site.phoneDisplaySecondary}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 text-white/60 transition-colors hover:text-brand"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2 text-white/60">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {site.areasSummary}
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/faq" className="hover:text-white/80">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-white/80">
              Contact
            </Link>
            <Link href="/privacy-policy" className="hover:text-white/80">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/80">
              Terms
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
