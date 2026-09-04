export type Location = {
  slug: string;
  name: string;
  region: string;
};

export type Region = {
  slug: string;
  name: string;
  blurb: string;
  locations: Location[];
};

export const regions: Region[] = [
  {
    slug: "sydney-metro",
    name: "Sydney Metro",
    blurb:
      "Free car removal and top cash offers across Western, Northern and Southern Sydney.",
    locations: [
      { slug: "parramatta", name: "Parramatta", region: "Western Sydney" },
      { slug: "blacktown", name: "Blacktown", region: "Western Sydney" },
      { slug: "penrith", name: "Penrith", region: "Western Sydney" },
      { slug: "chatswood", name: "Chatswood", region: "Northern Suburbs" },
      { slug: "ryde", name: "Ryde", region: "Northern Suburbs" },
      { slug: "hornsby", name: "Hornsby", region: "Northern Suburbs" },
      {
        slug: "sutherland-shire",
        name: "Sutherland Shire",
        region: "Southern Sydney",
      },
      { slug: "kogarah", name: "Kogarah", region: "Southern Sydney" },
      { slug: "hurstville", name: "Hurstville", region: "Southern Sydney" },
    ],
  },
  {
    slug: "hunter-port-stephens",
    name: "Hunter & Port Stephens",
    blurb:
      "Trusted cash-for-cars and car removal for Newcastle, Maitland and the Port Stephens coastline.",
    locations: [
      { slug: "newcastle", name: "Newcastle", region: "Hunter" },
      { slug: "maitland", name: "Maitland", region: "Hunter" },
      { slug: "waratah", name: "Waratah", region: "Hunter" },
      { slug: "swansea", name: "Swansea", region: "Lake Macquarie" },
      { slug: "nelson-bay", name: "Nelson Bay", region: "Port Stephens" },
      { slug: "anna-bay", name: "Anna Bay", region: "Port Stephens" },
      { slug: "tanilba-bay", name: "Tanilba Bay", region: "Port Stephens" },
    ],
  },
];

export const allLocations: Location[] = regions.flatMap((r) => r.locations);

export function getLocationBySlug(slug: string) {
  return allLocations.find((l) => l.slug === slug);
}
