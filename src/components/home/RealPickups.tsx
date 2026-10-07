import Image from "next/image";
import { Camera, Truck } from "lucide-react";
import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { FadeIn } from "../motion/FadeIn";
import { Stagger, StaggerItem } from "../motion/Stagger";

const photos = [
  { src: "/images/gallery/tow-truck-loading.jpg", alt: "Tow truck loading a car for removal", caption: "Free tow, every time", span: "sm:col-span-2 sm:row-span-2" },
  { src: "/images/gallery/handing-over-keys.jpg", alt: "Handing over car keys for cash", caption: "Keys over, cash in hand", span: "" },
  { src: "/images/gallery/cash-in-hand.png", alt: "Cash paid on pick-up", caption: "Paid on the spot", span: "" },
  { src: "/images/gallery/documenting-damage.jpg", alt: "Inspecting and documenting vehicle condition", caption: "Honest inspection", span: "" },
  { src: "/images/gallery/crashed-blue-car.png", alt: "Accident-damaged car we buy", caption: "Damaged? We buy it", span: "" },
];

export function RealPickups() {
  return (
    <section className="overflow-hidden bg-white py-20 sm:py-28">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Real Pickups"
            title="See how simple selling your car can be"
            description="From the first call to cash in hand, here is what a pickup with Australia Wide Wreckers looks like."
            align="center"
          />
        </FadeIn>
        <Stagger className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 sm:grid-cols-4 sm:auto-rows-[200px]">
          {photos.map((photo) => (
            <StaggerItem key={photo.src} className={`${photo.span} group relative overflow-hidden rounded-3xl bg-zinc-100`}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(min-width: 640px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-transparent to-transparent" aria-hidden />
              <p className="absolute right-4 bottom-4 left-4 flex items-center gap-2 text-sm font-bold text-white">
                <Camera className="h-4 w-4 text-brand" aria-hidden />
                {photo.caption}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>

      {/* Little tow truck driving along the road */}
      <div className="relative mt-14 h-10" aria-hidden>
        <div className="absolute inset-x-0 bottom-1 border-t-2 border-dashed border-ink/15" />
        <Truck className="tow-drive absolute bottom-1 h-8 w-8 text-navy" />
      </div>
    </section>
  );
}
