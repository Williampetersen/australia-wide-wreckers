import Image from "next/image";
import { Container } from "../Container";
import { HeroContent } from "./HeroContent";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Image
        src="/images/hero/hero.jpg"
        alt="Australia Wide Wreckers tow truck removing a wrecked car"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(20,45,65,0.92)_0%,rgba(20,45,65,0.8)_30%,rgba(20,45,65,0.4)_58%,rgba(20,45,65,0.15)_78%),linear-gradient(0deg,rgba(20,45,65,0.5)_0%,transparent_35%)]"
        aria-hidden
      />

      <Container className="relative py-12 sm:py-16 lg:py-24">
        <HeroContent />
      </Container>
    </section>
  );
}
