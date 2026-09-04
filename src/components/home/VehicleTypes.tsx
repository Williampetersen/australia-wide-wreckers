import Image from "next/image";
import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";

const vehicles = [
  {
    name: "Utes",
    description: "Single cab, dual cab and all work utes",
    image: "/images/misc/vehicle-ute.png",
  },
  {
    name: "Vans",
    description: "Delivery vans, minibuses and commercial transport vans",
    image: "/images/misc/vehicle-van.png",
  },
  {
    name: "Pickup Trucks",
    description: "4x4 pickups, large utility vehicles and heavy-duty models",
    image: "/images/misc/vehicle-pickup.png",
  },
  {
    name: "Motorbikes",
    description: "Used, damaged, unregistered or unwanted bikes",
    image: "/images/misc/vehicle-motorbike.png",
  },
];

export function VehicleTypes() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="All Vehicle Types"
          title="We buy all types of vehicles"
          description="Cars, utes, motorbikes, pickups, vans and light trucks — running, damaged, old or scrap."
          align="center"
        />
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.name}
              className="rounded-3xl border border-ink/8 bg-zinc-50 p-5 text-center"
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
              <h3 className="font-display mt-4 text-sm font-bold text-ink">
                {vehicle.name}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                {vehicle.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
