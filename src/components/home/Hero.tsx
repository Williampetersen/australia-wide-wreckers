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

      <Container className="relative flex flex-1 flex-col py-8 sm:py-10">
        <HeroContent />
      </Container>
    </section>
  );
}
