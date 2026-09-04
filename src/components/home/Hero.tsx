import Image from "next/image";
import { Container } from "../Container";
import { HeroContent } from "./HeroContent";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-ink sm:min-h-[720px]">
      <Image
        src="/images/gallery/handing-over-keys.jpg"
        alt="Handing over car keys after a cash sale"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

      <Container className="relative py-20 sm:py-28 lg:py-32">
        <HeroContent />
      </Container>
    </section>
  );
}
