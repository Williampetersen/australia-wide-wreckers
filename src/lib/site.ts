export const site = {
  name: "Australia Wide Wreckers",
  shortName: "AW Wreckers",
  tagline: "Up To $9,999 Instant Cash For Your Car",
  cashOfferMax: "$9,999",
  description:
    "Australia Wide Wreckers pays top cash for cars, utes, vans, trucks, motorbikes and 4x4s in any condition. Free same-day removal across Newcastle, Lake Macquarie, Maitland, Cessnock, Port Stephens and the Central Coast.",
  phoneDisplay: "0456 009 004",
  phoneHref: "tel:+61456009004",
  phoneDisplaySecondary: "0456 009 003",
  phoneHrefSecondary: "tel:+61456009003",
  landlineDisplay: "(02) 6541 1711",
  landlineHref: "tel:+61265411711",
  email: "info@australiawidewreckers.com.au",
  hours: [
    { days: "Monday – Saturday", time: "9:00 AM – 5:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  areasSummary: "Newcastle, Lake Macquarie, Maitland, Cessnock, Port Stephens & Central Coast",
  url: "https://australiawidewreckers.com.au",
  depots: [
    {
      name: "Australia Wide Wreckers",
      address: "9 Common Rd, Muswellbrook NSW 2333",
      mapQuery: "9+Common+Rd+Muswellbrook+NSW+2333",
    },
    {
      name: "M1 Car Removal",
      address: "139 Moira Park Rd, Morisset NSW 2264",
      mapQuery: "139+Moira+Park+Rd+Morisset+NSW+2264",
    },
  ],
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;
