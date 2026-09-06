import { site } from "./site";
import type { Location } from "./locations";
import type { Service } from "./services";
import type { Faq } from "./faqs";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function expandDayRange(days: string): string[] {
  const parts = days.split(/[–-]/).map((part) => part.trim().toLowerCase());
  const indexOf = (day: string) =>
    DAY_NAMES.findIndex((name) => name.toLowerCase() === day);

  if (parts.length === 1) {
    const index = indexOf(parts[0]);
    return index === -1 ? [] : [DAY_NAMES[index]];
  }

  const start = indexOf(parts[0]);
  const end = indexOf(parts[1]);
  if (start === -1 || end === -1) return [];

  const result: string[] = [];
  for (let i = start; ; i = (i + 1) % 7) {
    result.push(DAY_NAMES[i]);
    if (i === end) break;
  }
  return result;
}

function to24Hour(time: string): string | null {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  const [, hoursRaw, minutes, meridiem] = match;
  let hours = parseInt(hoursRaw, 10);
  if (/pm/i.test(meridiem) && hours !== 12) hours += 12;
  if (/am/i.test(meridiem) && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function openingHoursSpecification() {
  return site.hours
    .filter((h) => !/closed/i.test(h.time))
    .flatMap((h) => {
      const [openRaw, closeRaw] = h.time.split(/[–-]/).map((t) => t.trim());
      const opens = to24Hour(openRaw);
      const closes = to24Hour(closeRaw);
      const dayOfWeek = expandDayRange(h.days);
      if (!opens || !closes || dayOfWeek.length === 0) return [];
      return [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek,
          opens,
          closes,
        },
      ];
    });
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    image: `${site.url}/images/logo/logo-black.png`,
    logo: `${site.url}/images/logo/logo-black.png`,
    telephone: site.phoneDisplay,
    email: site.email,
    priceRange: "$$",
    areaServed: site.areasSummary,
    location: site.depots.map((depot) => ({
      "@type": "Place",
      name: depot.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: depot.address,
        addressCountry: "AU",
      },
    })),
    openingHoursSpecification: openingHoursSpecification(),
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.name,
    name: `${service.name} | ${site.name}`,
    description: service.description,
    url: `${site.url}/services/${service.slug}`,
    areaServed: site.areasSummary,
    provider: {
      "@id": `${site.url}/#organization`,
    },
  };
}

export function locationSchema(location: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Cash for cars and car removal",
    name: `Cash For Cars ${location.name} | ${site.name}`,
    description: `Free car removal and top cash offers in ${location.name} and surrounding ${location.region} suburbs.`,
    url: `${site.url}/locations/${location.slug}`,
    areaServed: {
      "@type": "Place",
      name: location.name,
    },
    provider: {
      "@id": `${site.url}/#organization`,
    },
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
