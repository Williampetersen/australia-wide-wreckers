import type { Metadata } from "next";
import { PhoneCall, MapPin, Clock, Truck, BadgeDollarSign } from "@/components/Icons";
import { Container } from "@/components/Container";
import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { getVehicleType, type VehicleTypeId } from "@/lib/quote";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a Cash Offer For Your Car",
  description: `Sell your car, ute, van, truck or motorbike to ${site.name}. Answer a few quick questions and we'll call you with a cash offer. Free towing across ${site.areasSummary}.`,
  alternates: {
    canonical: `${site.url}/get-quote`,
  },
};

export default async function GetQuotePage(props: PageProps<"/get-quote">) {
  const { type } = await props.searchParams;
  const initialType = typeof type === "string" && getVehicleType(type) ? (type as VehicleTypeId) : undefined;

  const panel = [
    { icon: BadgeDollarSign, title: "Cash on pickup", text: "Get paid in cash when we collect your vehicle." },
    { icon: Truck, title: "Free towing", text: "We tow it from your home, business or roadside at no cost." },
    { icon: MapPin, title: "Two depots", text: `${site.depots[0].address} and ${site.depots[1].address}.` },
  ];

  return (
    <section className="relative overflow-hidden bg-background py-14 sm:py-20">
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue/15 blur-3xl" aria-hidden />
      <Container className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
        <div>
          <span className="inline-flex items-center rounded-full bg-navy px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
            Free cash offer
          </span>
          <h1 className="font-display mt-5 text-balance text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
            Sell your car in under 2 minutes
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Answer a few quick questions and we&apos;ll call you with a cash offer. The final price is confirmed when
            we inspect the vehicle.
          </p>
          <div className="mt-10">
            <QuoteWizard initialVehicleType={initialType} />
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-3xl bg-navy p-7 text-white shadow-[0_24px_80px_rgba(0,35,80,0.25)]">
            <p className="text-sm font-semibold text-white/70">Prefer to talk to someone?</p>
            <a
              href={site.landlineHref}
              className="mt-2 flex items-center gap-2 text-2xl font-bold text-white hover:text-brand"
            >
              <PhoneCall className="h-6 w-6 text-brand" aria-hidden />
              {site.landlineDisplay}
            </a>
            <p className="mt-3 flex items-center gap-2 text-sm text-white/75">
              <Clock className="h-4 w-4 text-brand" aria-hidden />
              {site.hours[0].days}: {site.hours[0].time}
            </p>
          </div>

          {panel.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-3xl border border-[#d9e3ee] bg-white p-6 shadow-[0_8px_32px_rgba(0,35,80,0.06)]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue/10 text-navy">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-display font-bold text-ink">{title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600">{text}</p>
              </div>
            </div>
          ))}
        </aside>
      </Container>
    </section>
  );
}
