import type { Metadata } from "next";
import Image from "next/image";
import { PhoneCall, MapPin, Clock, Truck, BadgeDollarSign } from "@/components/Icons";
import { Container } from "@/components/Container";
import { QuoteForm } from "@/components/quote/QuoteForm";
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
    <section className="relative isolate overflow-hidden py-4 sm:py-20">
      <Image src="/images/hero/hero.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover scale-110 blur-md" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-navy/60" aria-hidden />
      
      <Container className="relative grid grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
        <div>
          <span className="hidden items-center rounded-full bg-navy px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white sm:inline-flex">
            Free cash offer
          </span>
          <h1 className="font-display mt-5 hidden text-balance text-4xl font-bold leading-[1.1] text-white sm:block sm:text-5xl">
            Sell your car in under 2 minutes
          </h1>
          <p className="mt-4 hidden max-w-2xl text-lg leading-relaxed text-white/85 sm:block">
            Answer a few quick questions and we&apos;ll call you with a cash offer. The final price is confirmed when
            we inspect the vehicle.
          </p>
          <div className="sm:mt-10">
            <QuoteForm initialVehicleType={initialType} />
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
            <div key={title} className="flex gap-4 rounded-3xl border border-white/25 bg-white/10 p-6 text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-display font-bold text-white">{title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-white/75">{text}</p>
              </div>
            </div>
          ))}
        </aside>
      </Container>
    </section>
  );
}
