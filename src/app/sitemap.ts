import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { allLocations } from "@/lib/locations";
import { guides } from "@/lib/guides";
import { cities } from "@/lib/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1, lastModified },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.7, lastModified },
    { url: `${site.url}/services`, changeFrequency: "monthly", priority: 0.9, lastModified },
    { url: `${site.url}/locations`, changeFrequency: "monthly", priority: 0.9, lastModified },
    { url: `${site.url}/faq`, changeFrequency: "monthly", priority: 0.6, lastModified },
    { url: `${site.url}/contact`, changeFrequency: "monthly", priority: 0.8, lastModified },
    { url: `${site.url}/privacy-policy`, changeFrequency: "yearly", priority: 0.3, lastModified },
    { url: `${site.url}/terms`, changeFrequency: "yearly", priority: 0.3, lastModified },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified,
  }));

  const locationRoutes: MetadataRoute.Sitemap = allLocations.map((l) => ({
    url: `${site.url}/locations/${l.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified,
  }));

  const guideRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/guides`, changeFrequency: "monthly", priority: 0.8, lastModified },
    { url: `${site.url}/get-quote`, changeFrequency: "monthly", priority: 0.9, lastModified },
    ...guides.map((g) => ({
      url: `${site.url}/guides/${g.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      lastModified: new Date(g.updated),
    })),
  ];

  const cityRoutes: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${site.url}/cash-for-cars/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
    lastModified,
  }));

  return [...staticRoutes, ...serviceRoutes, ...locationRoutes, ...guideRoutes, ...cityRoutes];
}
