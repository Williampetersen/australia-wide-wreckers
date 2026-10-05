import { Hero } from "@/components/home/Hero";
import { VehiclePicker } from "@/components/home/VehiclePicker";
import { TrustBadges } from "@/components/home/TrustBadges";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { BrandStrip } from "@/components/home/BrandStrip";
import { ServicesSection } from "@/components/home/ServicesSection";
import { VehicleTypes } from "@/components/home/VehicleTypes";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ServiceAreas } from "@/components/home/ServiceAreas";
import { CtaBand } from "@/components/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <VehiclePicker />
      <TrustBadges />
      <GoogleReviews />
      <BrandStrip />
      <ServicesSection />
      <VehicleTypes />
      <ProcessSteps />
      <WhyChooseUs />
      <ServiceAreas />
      <CtaBand />
    </>
  );
}
