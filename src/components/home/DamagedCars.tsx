import Image from "next/image";
import Link from "next/link";
import { CloudHail, Droplets, FileWarning, Flame, PowerOff, Wrench } from "lucide-react";
import { Container } from "../Container";
import { FadeIn } from "../motion/FadeIn";
import { Stagger, StaggerItem } from "../motion/Stagger";

const conditions = [
  { icon: Wrench, label: "Accident damaged" },
  { icon: PowerOff, label: "Won't start / non-running" },
  { icon: Wrench, label: "Faulty or mechanical failure" },
  { icon: Droplets, label: "Flood damaged" },
  { icon: CloudHail, label: "Hail damaged" },
  { icon: Flame, label: "Fire damaged" },
  { icon: FileWarning, label: "Unregistered or written-off" },
];

export function DamagedCars() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <FadeIn className="text-center">
          <span className="inline-flex items-center rounded-full bg-brand/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-soft">
            Damaged, broken or not running? We still buy it
          </span>
          <h2 className="font-display text-balance mx-auto mt-4 max-w-3xl text-3xl font-bold text-ink sm:text-4xl">
            We buy damaged, non-running and faulty cars for cash
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
            Crashed, flooded, rusted, broken down or just not worth fixing. Whatever its condition, we make you a cash
            offer and tow it away for free.
          </p>
        </FadeIn>

        <FadeIn className="relative mx-auto mt-8 max-w-4xl">
          <Image
            src="/images/gallery/crashed-suvs.png"
            alt="Three accident-damaged SUVs that Australia Wide Wreckers buys for cash"
            width={1086}
            height={396}
            className="h-auto w-full"
            sizes="(min-width: 896px) 896px, 100vw"
          />
        </FadeIn>

        <Stagger className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2.5 sm:gap-3">
          {conditions.map(({ icon: Icon, label }) => (
            <StaggerItem key={label}>
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-zinc-50 px-4 py-2 text-sm font-semibold text-ink shadow-sm">
                <Icon className="h-4 w-4 text-brand-dark" aria-hidden />
                {label}
              </span>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-8 text-center">
          <Link
            href="/get-quote"
            className="inline-flex items-center rounded-full bg-navy px-7 py-3.5 text-base font-bold text-white transition hover:brightness-125"
          >
            Get a cash offer for my damaged car
          </Link>
        </div>
      </Container>
    </section>
  );
}
