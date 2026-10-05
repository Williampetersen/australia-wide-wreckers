import Image from "next/image";
import { Container } from "../Container";
import { HeroContent } from "./HeroContent";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[520px] flex-col overflow-hidden bg-white sm:min-h-[640px]">
      <Image
        src="/images/hero/hero.jpg"
        alt="Australia Wide Wreckers tow truck removing a car"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <Container className="relative flex flex-1 flex-col pt-8 pb-20 sm:pt-10 sm:pb-24">
        <HeroContent />
      </Container>
    </section>
  );
}
