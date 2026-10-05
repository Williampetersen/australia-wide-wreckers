import Image from "next/image";
import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { FadeIn } from "../motion/FadeIn";
import { Stagger, StaggerItem } from "../motion/Stagger";

const vehicles = [
  {
    name: "Cars",
    description: "Sedans, hatchbacks, SUVs and 4x4s",
    image: "/images/vehicles/car.png",
  },
  {
    name: "Utes",
    description: "Single cab, dual cab and all work utes",
    image: "/images/vehicles/ute.png",
  },
  {
    name: "Motorbikes",
    description: "Used, damaged, unregistered or unwanted bikes",
    image: "/images/vehicles/motorbike.png",
  },
  {
    name: "Pickup Trucks",
    description: "4x4 pickups, large utility vehicles and heavy-duty models",
    image: "/images/vehicles/pickup.png",
  },
  {
    name: "Vans",
    description: "Delivery vans, minibuses and commercial transport vans",
    image: "/images/vehicles/van.png",
  },
  {
    name: "Light Trucks",
    description: "Tray trucks and light commercial trucks",
    image: "/images/vehicles/light-truck.png",
  },
];

export function VehicleTypes() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="All Vehicle Types"
            title="We buy all types of vehicles"
            description="Cars, utes, motorbikes, pickups, vans and light trucks — running, damaged, old or scrap."
            align="center"
          />
        </FadeIn>
        <Stagger className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3">
          {vehicles.map((vehicle) => (
            <StaggerItem
              key={vehicle.name}
              className="rounded-2xl border border-ink/8 bg-white p-5 text-center transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="relative mx-auto h-20 w-full">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-contain"
                  sizes="160px"
                />
              </div>
              <h3 className="font-display mt-4 text-sm text-ink">
                {vehicle.name}
              </h3>
              <p className="text-ink-soft mt-1 text-xs leading-relaxed">
                {vehicle.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
