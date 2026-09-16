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
      logo: "/images/logo/logo-black.png",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27691.46080734396!2d150.89077062136258!3d-32.26940826358711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b0b60df57595e4d%3A0x2dc12c55f5170d86!2sAustralia%20wide%20Wreckers!5e1!3m2!1sen!2sdk!4v1726518130467!5m2!1sen!2sdk",
    },
    {
      name: "M1 Car Removal",
      address: "139 Moira Park Rd, Morisset NSW 2264",
      mapQuery: "139+Moira+Park+Rd+Morisset+NSW+2264",
      logo: "/images/logo/m1-logo.png",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109712.93128340709!2d151.4716581818117!3d-33.12194800614102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b7329c951aaeaa7%3A0xfdb2169275df030!2sM1%20Car%20Removal!5e1!3m2!1sen!2sdk!4v1726694305625!5m2!1sen!2sdk",
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
