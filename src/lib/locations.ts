export type Location = {
  slug: string;
  name: string;
  region: string;
  heroImage?: string;
};

export type Region = {
  slug: string;
  name: string;
  blurb: string;
  locations: Location[];
};

export const regions: Region[] = [
  {
    slug: "newcastle",
    name: "Newcastle",
    blurb:
      "Free car removal and top cash offers across Newcastle and its inner suburbs.",
    locations: [
      { slug: "newcastle", name: "Newcastle", region: "Newcastle" },
      {
        slug: "mayfield",
        name: "Mayfield",
        region: "Newcastle",
        heroImage: "/images/locations/cash-for-cars-mayfield.webp",
      },
      {
        slug: "hamilton",
        name: "Hamilton",
        region: "Newcastle",
        heroImage: "/images/locations/cash-for-cars-hamilton.webp",
      },
      {
        slug: "hamilton-north",
        name: "Hamilton North",
        region: "Newcastle",
        heroImage: "/images/locations/cash-for-cars-hamilton-north.webp",
      },
      { slug: "wallsend", name: "Wallsend", region: "Newcastle" },
      {
        slug: "wallsend-south",
        name: "Wallsend South",
        region: "Newcastle",
        heroImage: "/images/locations/cash-for-cars-wallsend-south.webp",
      },
      { slug: "waratah", name: "Waratah", region: "Newcastle" },
      { slug: "waratah-west", name: "Waratah West", region: "Newcastle" },
      { slug: "islington", name: "Islington", region: "Newcastle" },
      { slug: "sandgate", name: "Sandgate", region: "Newcastle" },
      { slug: "stockton", name: "Stockton", region: "Newcastle" },
      {
        slug: "georgetown",
        name: "Georgetown",
        region: "Newcastle",
        heroImage: "/images/locations/cash-for-cars-georgetown.webp",
      },
      { slug: "adamstown-heights", name: "Adamstown Heights", region: "Newcastle" },
      { slug: "elermore-vale", name: "Elermore Vale", region: "Newcastle" },
      { slug: "merewether", name: "Merewether", region: "Newcastle" },
      {
        slug: "kotara",
        name: "Kotara",
        region: "Newcastle",
        heroImage: "/images/locations/cash-for-cars-kotara.webp",
      },
      { slug: "kotara-south", name: "Kotara South", region: "Newcastle" },
      { slug: "kotara-heights", name: "Kotara Heights", region: "Newcastle" },
      { slug: "fletcher", name: "Fletcher", region: "Newcastle" },
      {
        slug: "lambton",
        name: "Lambton",
        region: "Newcastle",
        heroImage: "/images/locations/cash-for-car-lambton.jpg",
      },
    ],
  },
  {
    slug: "lake-macquarie",
    name: "Lake Macquarie",
    blurb:
      "Trusted cash-for-cars and car removal all around Lake Macquarie, from Cardiff to Swansea.",
    locations: [
      {
        slug: "cardiff",
        name: "Cardiff",
        region: "Lake Macquarie",
        heroImage: "/images/locations/cash-for-cars-cardiff.webp",
      },
      {
        slug: "swansea",
        name: "Swansea",
        region: "Lake Macquarie",
        heroImage: "/images/locations/cash-for-cars-swansea.webp",
      },
      { slug: "belmont", name: "Belmont", region: "Lake Macquarie" },
      {
        slug: "belmont-north",
        name: "Belmont North",
        region: "Lake Macquarie",
        heroImage: "/images/locations/cash-for-cars-belmont-north.webp",
      },
      {
        slug: "charlestown",
        name: "Charlestown",
        region: "Lake Macquarie",
        heroImage: "/images/locations/cash-for-cars-charlestown.jpg",
      },
      { slug: "glendale", name: "Glendale", region: "Lake Macquarie" },
      {
        slug: "cameron-park",
        name: "Cameron Park",
        region: "Lake Macquarie",
        heroImage: "/images/locations/cash-for-cars-cameron-park.webp",
      },
      {
        slug: "edgeworth",
        name: "Edgeworth",
        region: "Lake Macquarie",
        heroImage: "/images/locations/cash-for-cars-edgeworth.webp",
      },
      { slug: "warners-bay", name: "Warners Bay", region: "Lake Macquarie" },
      { slug: "morisset", name: "Morisset", region: "Lake Macquarie" },
    ],
  },
  {
    slug: "maitland-hunter-valley",
    name: "Maitland & Hunter Valley",
    blurb:
      "Fast, free removal across Maitland, Cessnock and the wider Hunter Valley.",
    locations: [
      {
        slug: "maitland",
        name: "Maitland",
        region: "Maitland",
        heroImage: "/images/locations/cash-for-cars-maitland.jpg",
      },
      { slug: "maitland-vale", name: "Maitland Vale", region: "Maitland" },
      {
        slug: "thornton",
        name: "Thornton",
        region: "Maitland",
        heroImage: "/images/locations/cash-for-cars-thornton.jpg",
      },
      { slug: "branxton", name: "Branxton", region: "Hunter Valley" },
      { slug: "greta", name: "Greta", region: "Hunter Valley" },
      { slug: "kurri-kurri", name: "Kurri Kurri", region: "Hunter Valley" },
      { slug: "singleton", name: "Singleton", region: "Hunter Valley" },
      {
        slug: "cessnock",
        name: "Cessnock",
        region: "Hunter Valley",
        heroImage: "/images/locations/cash-for-cars-cessnock.jpg",
      },
      { slug: "muswellbrook", name: "Muswellbrook", region: "Upper Hunter" },
    ],
  },
  {
    slug: "port-stephens",
    name: "Port Stephens",
    blurb:
      "Servicing the whole Port Stephens coastline, from Raymond Terrace to Tea Gardens.",
    locations: [
      { slug: "raymond-terrace", name: "Raymond Terrace", region: "Port Stephens" },
      { slug: "medowie", name: "Medowie", region: "Port Stephens" },
      { slug: "karuah", name: "Karuah", region: "Port Stephens" },
      { slug: "nelson-bay", name: "Nelson Bay", region: "Port Stephens" },
      { slug: "anna-bay", name: "Anna Bay", region: "Port Stephens" },
      { slug: "tanilba-bay", name: "Tanilba Bay", region: "Port Stephens" },
      { slug: "tea-gardens", name: "Tea Gardens", region: "Port Stephens" },
    ],
  },
  {
    slug: "central-coast",
    name: "Central Coast",
    blurb: "Free pickup and top cash offers across the Central Coast.",
    locations: [
      { slug: "central-coast", name: "Central Coast", region: "Central Coast" },
    ],
  },
];

export const allLocations: Location[] = regions.flatMap((r) => r.locations);

export function getLocationBySlug(slug: string) {
  return allLocations.find((l) => l.slug === slug);
}
