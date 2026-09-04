import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { ServiceCard } from "@/components/ServiceCard";
import { CtaBand } from "@/components/CtaBand";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Services",
  description: `Cash for cars, free car removal, scrap car removal, truck and van removal, and licensed car wrecking across ${site.areasSummary}.`,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="One team for every vehicle removal need"
        description="From daily drivers to written-off trucks, explore how we can turn your vehicle into cash."
      />
      <section className="py-20 sm:py-28">
        <Container>
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <StaggerItem key={service.slug} className="h-full">
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
