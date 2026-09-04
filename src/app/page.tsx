import { Hero } from "@/components/home/Hero";
import { TrustBadges } from "@/components/home/TrustBadges";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ServiceAreas } from "@/components/home/ServiceAreas";
import { CtaBand } from "@/components/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <ServicesSection />
      <ProcessSteps />
      <WhyChooseUs />
      <ServiceAreas />
      <CtaBand />
    </>
  );
}
