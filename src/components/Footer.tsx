import Link from "next/link";
import { Container } from "./Container";
import { Mail, PhoneCall, MapPin, Clock } from "./Icons";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { regions } from "@/lib/locations";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-zinc-300">
      <Container className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-xl font-extrabold text-white">
            Australia Wide
            <span className="ml-1.5 rounded-md bg-brand px-1.5 py-0.5 text-ink">
              Wreckers
            </span>
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
            {site.description}
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-zinc-400">
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
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Services
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-zinc-400 transition-colors hover:text-brand"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Service Areas
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {regions.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/locations#${r.slug}`}
                  className="text-zinc-400 transition-colors hover:text-brand"
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
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Get In Touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={site.phoneHref}
                className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-brand"
              >
                <PhoneCall className="h-4 w-4 shrink-0" aria-hidden />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={site.phoneHrefSecondary}
                className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-brand"
              >
                <PhoneCall className="h-4 w-4 shrink-0" aria-hidden />
                {site.phoneDisplaySecondary}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-brand"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2 text-zinc-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {site.areasSummary}
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-zinc-500 sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/faq" className="hover:text-zinc-300">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-zinc-300">
              Contact
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
