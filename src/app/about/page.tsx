import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { CtaBand } from "@/components/CtaBand";
import { ShieldCheck, Truck, Recycle, BadgeDollarSign } from "@/components/Icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${site.name}, your trusted local car removal and cash-for-cars service across Sydney, Newcastle and Port Stephens.`,
};

const values = [
  {
    icon: BadgeDollarSign,
    title: "Fair Pricing",
    description:
      "We assess every vehicle honestly based on its real value in parts, metal and market demand.",
  },
  {
    icon: Truck,
    title: "Reliable Service",
    description:
      "When we book a pickup time, we show up. No missed windows, no chasing us for updates.",
  },
  {
    icon: Recycle,
    title: "Responsible Recycling",
    description:
      "End-of-life vehicles are dismantled and recycled at a licensed facility, minimising environmental impact.",
  },
  {
    icon: ShieldCheck,
    title: "Full Transparency",
    description:
      "No hidden fees, no surprise deductions. The price we quote is the price you're paid.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Local car removal, done the right way"
        description="Australia Wide Wreckers helps everyday people and businesses across NSW turn unwanted vehicles into cash, quickly and without hassle."
      />

      <section className="py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="Built around a simple idea: make car removal easy"
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-600">
              <p>
                Getting rid of an old, damaged or unwanted vehicle shouldn&apos;t
                mean weeks of back-and-forth, unreliable buyers or paying to
                have it towed away. We set out to fix that by offering fast,
                fair quotes and free removal, backed by a team that actually
                turns up when it says it will.
              </p>
              <p>
                From single passenger cars to commercial trucks and 4x4s, we
                buy vehicles in any condition, running or not, and take care
                of the entire process from quote to pickup to responsible
                recycling.
              </p>
              <p>
                Today we service Sydney Metro along with Newcastle, Maitland
                and the Port Stephens region, with a growing team dedicated to
                making car removal as simple as a single phone call.
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

      <CtaBand />
    </>
  );
}
