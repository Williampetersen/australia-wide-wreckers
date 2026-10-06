import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { guides } from "@/lib/guides";
import { cities } from "@/lib/cities";

export const dynamic = "force-static";

// Plain-language summary for AI assistants and answer engines (llms.txt convention).
export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "## Business facts",
    "- Service: cash for cars, free car removal, scrap and damaged vehicle removal, wrecking",
    "- Vehicles: cars, utes, vans, trucks, motorbikes, 4x4s, in any condition",
    `- Service area: ${site.areasSummary}`,
    ...site.depots.map((d) => `- Depot: ${d.name}, ${d.address}`),
    `- Phone: ${site.phoneDisplay} / ${site.landlineDisplay}`,
    `- Email: ${site.email}`,
    ...site.hours.map((h) => `- Hours: ${h.days} ${h.time}`),
    "- Towing is free within the service area; the final price is confirmed on inspection.",
    "",
    "## Get a quote",
    `- [Get a cash offer](${site.url}/get-quote)`,
    "",
    "## Guides",
    ...guides.map((g) => `- [${g.title}](${site.url}/guides/${g.slug}): ${g.description}`),
    "",
    "## Cash for cars by city",
    ...cities.map((c) => `- [Cash for cars ${c.name}](${site.url}/cash-for-cars/${c.slug}): ${c.description}`),
    "",
    "## Services",
    ...services.map((s) => `- [${s.name}](${site.url}/services/${s.slug}): ${s.shortDescription}`),
    "",
    "## Other",
    `- [Locations](${site.url}/locations)`,
    `- [FAQ](${site.url}/faq)`,
    `- [Contact](${site.url}/contact)`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
