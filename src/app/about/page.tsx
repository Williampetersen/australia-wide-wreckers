import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { CtaBand } from "@/components/CtaBand";
import { ShieldCheck, Truck, Recycle, BadgeDollarSign, MapPin } from "@/components/Icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${site.name}, your trusted local car removal and cash-for-cars service across Newcastle, Lake Macquarie, Maitland and the Hunter region.`,
};

const values = [
  {
    icon: BadgeDollarSign,
    title: "Top Cash Offers",
    description:
      "We offer competitive prices for scrap, damaged or unwanted cars, based on an honest read of make, model and condition.",
  },
  {
    icon: Truck,
    title: "Fast, Free Removal",
    description:
      "Free towing across our whole service area, with same-day pickup available in most cases.",
  },
  {
    icon: Recycle,
    title: "Environmentally Friendly",
    description:
      "We recycle and dispose of vehicles responsibly, minimising the impact on the local environment.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Service",
    description:
      "No lengthy paperwork and no delays — just prompt service and instant payment on the spot.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Local car removal, done the right way"
        description="Australia Wide Wreckers helps people across the Hunter, Lake Macquarie and Central Coast turn unwanted vehicles into cash, quickly and without hassle."
      />

      <section className="py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="Making car removal simple and rewarding"
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-600">
              <p>
                We specialise in fast, reliable and hassle-free car removal,
                with years of experience helping locals turn old, unwanted or
                damaged vehicles into top cash — up to {site.cashOfferMax}{" "}
                depending on your vehicle.
              </p>
              <p>
                We accept all vehicle types, including cars, utes, vans,
                motorbikes, light trucks, SUVs and 4x4s, regardless of
                condition. Whether your car is running, damaged, old or
                simply unwanted, our goal is to make selling it straightforward
                and worthwhile.
              </p>
              <p>
                Every vehicle we take off your hands is recycled and disposed
                of responsibly, so you get a fair price while minimising the
                impact on the environment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-3xl border border-ink/8 bg-zinc-50 p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-brand">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-display mt-4 text-base font-bold text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="relative h-72 w-full overflow-hidden rounded-3xl sm:h-96">
            <Image
              src="/images/gallery/tow-truck-loading.jpg"
              alt="Australia Wide Wreckers tow truck loading a vehicle for removal"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 1024px, 100vw"
            />
          </div>
        </Container>
      </section>

      <section className="bg-zinc-50 py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Visit Us" title="Our depots" align="center" />
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            {site.depots.map((depot) => (
              <div
                key={depot.name}
                className="rounded-3xl border border-ink/8 bg-white p-7 text-center"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-ink text-brand">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-display mt-4 text-lg font-bold text-ink">
                  {depot.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-600">{depot.address}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
