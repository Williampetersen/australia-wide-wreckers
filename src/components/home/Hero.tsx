import Image from "next/image";
import { Container } from "../Container";
import { HeroContent } from "./HeroContent";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[520px] flex-col overflow-hidden bg-navy sm:min-h-[640px]">
      <Image
        src="/images/hero/hero.jpg"
        alt="Australia Wide Wreckers tow truck removing a car"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {/* Background video: slow pans over real pickup photos. Replace public/videos/hero.mp4 with live footage any time. */}
      <video
        className="hero-video absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/hero/hero.jpg"
        aria-hidden
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/35 via-navy/10 to-navy/45"
        aria-hidden
      />

      <Container className="relative flex flex-1 flex-col pt-8 pb-20 sm:pt-10 sm:pb-24">
        <HeroContent />
      </Container>
    </section>
  );
}
