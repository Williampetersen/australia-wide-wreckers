import Image from "next/image";
import { CheckCircle2, Clock, MapPin, PhoneCall, ChevronRight } from "./Icons";
import { Container } from "./Container";
import { site } from "@/lib/site";

// Shared hours line, e.g. "Mon – Sat 9:00 AM – 5:00 PM · Sun closed".
const hoursLine = site.hours.map((h) => `${h.days}: ${h.time}`).join(" · ");

export function VisitUs() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-navy px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
            Our locations
          </span>
          <h2 className="font-display mt-5 text-3xl font-bold text-ink sm:text-4xl">
            Two depots you can drop in to
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Bring your paperwork and visit either depot, or call ahead. We still come to you across our whole service
            area, so the depots are an option, not the limit of where we work.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {site.depots.map((depot) => (
            <article
              key={depot.name}
              className="flex flex-col overflow-hidden rounded-3xl border border-[#d9e3ee] bg-white shadow-[0_24px_60px_rgba(0,35,80,0.10)]"
            >
              <div className="relative h-72 w-full bg-zinc-100 sm:h-80">
                <iframe
                  src={depot.mapEmbed}
                  title={`Map showing ${depot.name}, ${depot.address}`}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <div className="flex items-center gap-4">
                  <span className="relative flex h-12 w-24 shrink-0 items-center">
                    <Image src={depot.logo} alt={depot.name} fill className="object-contain object-left" sizes="96px" />
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink">{depot.name}</h3>
                </div>

                <p className="mt-5 flex items-start gap-2.5 text-base text-ink">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden />
                  {depot.address}
                </p>
                <p className="mt-3 flex items-start gap-2.5 text-sm text-zinc-600">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue" aria-hidden />
                  {hoursLine}
                </p>

                <ul className="mt-5 space-y-2 text-sm text-zinc-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cash-dark" aria-hidden /> Free towing from your home or business
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cash-dark" aria-hidden /> Cash paid on the spot
                  </li>
                </ul>

                <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${depot.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-dark px-6 py-3.5 text-sm font-bold text-navy shadow-[0_14px_34px_rgba(254,186,2,0.35)] transition hover:brightness-105"
                  >
                    Get directions
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </a>
                  <a
                    href={site.landlineHref}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-navy/15 px-6 py-3.5 text-sm font-bold text-navy transition hover:border-navy"
                  >
                    <PhoneCall className="h-4 w-4" aria-hidden />
                    Call {site.landlineDisplay}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
