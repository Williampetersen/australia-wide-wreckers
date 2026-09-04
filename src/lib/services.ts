export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  bullets: string[];
  icon:
    | "cash"
    | "tow"
    | "recycle"
    | "truck"
    | "wrench"
    | "car";
};

export const services: Service[] = [
  {
    slug: "cash-for-cars",
    name: "Cash For Cars",
    shortDescription:
      "Get a fast, fair cash offer for your car, no matter the age, make or condition.",
    description:
      "We buy cars in any condition, running or not, for top cash paid on the spot. Get a free quote over the phone in minutes and have cash in hand the same day.",
    bullets: [
      "Instant phone or online quotes",
      "Cash paid on pickup, no waiting",
      "All makes and models considered",
      "No obligation, no pressure",
    ],
    icon: "cash",
  },
  {
    slug: "free-car-removal",
    name: "Free Car Removal",
    shortDescription:
      "Free towing anywhere across our service area, seven days a week.",
    description:
      "Our fully equipped tow trucks come to your home, office or roadside location and remove your vehicle at no cost to you, no matter where you are in our service area.",
    bullets: [
      "100% free towing, always",
      "Same-day and next-day slots",
      "We handle the paperwork",
      "Driveway, roadside or workplace pickup",
    ],
    icon: "tow",
  },
  {
    slug: "scrap-car-removal",
    name: "Scrap Car Removal",
    shortDescription:
      "Damaged, rusted or written-off? We'll take it off your hands for cash.",
    description:
      "Scrap and damaged cars still have value in their parts and metal. We assess your scrap vehicle quickly and offer a fair cash price, then remove it for free.",
    bullets: [
      "Accident-damaged and written-off cars",
      "Rusted, flooded or fire-damaged vehicles",
      "Environmentally responsible recycling",
      "Fast, no-fuss quotes",
    ],
    icon: "recycle",
  },
  {
    slug: "truck-and-van-removal",
    name: "Truck & Van Removal",
    shortDescription:
      "Commercial vehicles, vans and light trucks removed and paid for fast.",
    description:
      "From tradie vans to light and heavy trucks, we buy commercial vehicles of all sizes and conditions and arrange removal that fits around your business.",
    bullets: [
      "Light and heavy trucks",
      "Vans, utes and commercial fleets",
      "Flexible pickup scheduling",
      "Fleet and bulk vehicle quotes",
    ],
    icon: "truck",
  },
  {
    slug: "4x4-and-suv-removal",
    name: "4x4 & SUV Removal",
    shortDescription:
      "Top dollar for 4x4s and SUVs, including off-road and damaged vehicles.",
    description:
      "4x4s and SUVs hold strong value in parts. We offer competitive quotes for these vehicles regardless of condition, including those with mechanical or body damage.",
    bullets: [
      "All 4x4 and SUV brands",
      "Off-road and damaged vehicles accepted",
      "Free valuation and quote",
      "Prompt statewide pickup",
    ],
    icon: "car",
  },
  {
    slug: "car-wrecking",
    name: "Car Wrecking & Parts",
    shortDescription:
      "Licensed dismantling with genuine used parts recovered and resold.",
    description:
      "Vehicles we can't put back on the road are carefully dismantled at our licensed facility. Usable parts are tested and made available, and materials are recycled responsibly.",
    bullets: [
      "Licensed dismantling facility",
      "Quality-checked used parts",
      "Responsible fluid and material disposal",
      "Supports a circular auto parts market",
    ],
    icon: "wrench",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
