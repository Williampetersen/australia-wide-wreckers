import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { ServiceCard } from "../ServiceCard";
import { FadeIn } from "../motion/FadeIn";
import { Stagger, StaggerItem } from "../motion/Stagger";
import { services } from "@/lib/services";

export function ServicesSection() {
  return (
    <section className="bg-zinc-50 py-20 sm:py-28">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="What We Do"
            title="Every kind of vehicle, every condition, one great offer"
            description="Whether it's an old daily driver, a written-off ute or a truck that won't start, we'll give you a fair price and take care of everything."
          />
        </FadeIn>
        <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.slug} className="h-full">
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
