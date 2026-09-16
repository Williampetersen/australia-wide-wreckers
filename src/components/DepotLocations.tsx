import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { FadeIn } from "./motion/FadeIn";
import { Stagger, StaggerItem } from "./motion/Stagger";
import { MapPin, Clock, ArrowUpRight } from "./Icons";
import { site } from "@/lib/site";

export function DepotLocations({
  className = "bg-white",
}: {
  className?: string;
}) {
  return (
    <section className={`py-20 sm:py-28 ${className}`}>
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Drop-Off Locations"
            title="Prefer to bring it to us?"
            description="Both depots offer cash on the spot, or we'll come to you with free towing anywhere across our service area."
          />
        </FadeIn>

        <Stagger className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {site.depots.map((depot) => (
            <StaggerItem
              key={depot.name}
              className="shadow-soft overflow-hidden rounded-2xl border border-ink/8 bg-white"
            >
              <div className="aspect-[16/9] w-full bg-field">
                <iframe
                  src={depot.mapEmbedUrl}
                  title={`Map to ${depot.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="font-display text-xl text-ink">{depot.name}</h3>
                <div className="text-ink-soft mt-3 flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                  {depot.address}
                </div>
                <div className="text-ink-soft mt-2 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                  {site.hours.map((h) => `${h.days}: ${h.time}`).join(" · ")}
                </div>
                <a
                  href={`https://maps.google.com/?q=${depot.mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:text-brand-dark"
                >
                  Get directions
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
