import { Hero } from "@/components/home/Hero";
import { VehiclePicker } from "@/components/home/VehiclePicker";
import { DamagedCars } from "@/components/home/DamagedCars";
import { TrustBadges } from "@/components/home/TrustBadges";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { BrandStrip } from "@/components/home/BrandStrip";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { RealPickups } from "@/components/home/RealPickups";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ServiceAreas } from "@/components/home/ServiceAreas";
import { CtaBand } from "@/components/CtaBand";
import { VisitUs } from "@/components/VisitUs";

export default function Home() {
  return (
    <>
      <Hero />
      <DamagedCars />
      <TrustBadges />
      <GoogleReviews />
      <BrandStrip />
      <ServicesSection />
      <VehiclePicker />
      <ProcessSteps />
      <RealPickups />
      <WhyChooseUs />
      <ServiceAreas />
      <div id="locations">
        <VisitUs />
      </div>
      <CtaBand />
    </>
  );
}
