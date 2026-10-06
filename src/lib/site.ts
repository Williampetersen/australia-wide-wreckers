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
  // ABN not sourced from the WordPress export — add the real one before publishing the legal pages.
  abn: "Add your ABN here",
  // Real rating/count aren't available yet; leave null rather than guessing so the
  // reviews badge shows a generic "read our reviews" link instead of invented numbers.
  googleRating: null as number | null,
  googleReviewCount: null as number | null,
  googleReviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=Australia+Wide+Wreckers+reviews",
  depots: [
    {
      name: "Australia Wide Wreckers",
      address: "9 Common Rd, Muswellbrook NSW 2333",
      mapQuery: "9+Common+Rd+Muswellbrook+NSW+2333",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4252.402605193408!2d150.9052090756416!3d-32.26327397388251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b0b60df59e2a987%3A0xaedd28388a25377d!2s9%20Common%20Rd%2C%20Muswellbrook%20NSW%202333%2C%20Australia!5e1!3m2!1sen!2snl!4v1791313788614!5m2!1sen!2snl",
      logo: "/images/logo/logo-black.png",
    },
    {
      name: "M1 Car Removal",
      address: "139 Moira Park Rd, Morisset NSW 2264",
      mapQuery: "139+Moira+Park+Rd+Morisset+NSW+2264",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4212.674588624018!2d151.49654907567626!3d-33.10153057352964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b7328630f31a35f%3A0xf56907eccd3d38fc!2s139%20Moira%20Park%20Rd%2C%20Morisset%20NSW%202264%2C%20Australia!5e1!3m2!1sen!2snl!4v1791313810684!5m2!1sen!2snl",
      logo: "/images/logo/m1-logo.png",
    },
  ],
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;
