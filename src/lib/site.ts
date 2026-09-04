export const site = {
  name: "Australia Wide Wreckers",
  shortName: "AW Wreckers",
  tagline: "Top Cash For Cars, Free Removal Across NSW",
  description:
    "Australia Wide Wreckers pays top cash for cars, utes, vans, trucks and 4x4s in any condition. Free same-day removal across Sydney, Newcastle and Port Stephens.",
  phoneDisplay: "0456 009 004",
  phoneHref: "tel:+61456009004",
  phoneDisplaySecondary: "0456 009 003",
  phoneHrefSecondary: "tel:+61456009003",
  email: "info@australiawidewreckers.com.au",
  hours: [
    { days: "Monday – Friday", time: "7:00 AM – 7:00 PM" },
    { days: "Saturday – Sunday", time: "8:00 AM – 5:00 PM" },
  ],
  areasSummary: "Sydney Metro, Newcastle & Port Stephens",
  url: "https://australiawidewreckers.com.au",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;
