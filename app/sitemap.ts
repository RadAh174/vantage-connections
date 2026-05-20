import type { MetadataRoute } from "next";
import { featuredProjects } from "@/lib/content/work";
import { services } from "@/lib/content/services";
import { insights } from "@/lib/content/insights";
import { locations } from "@/lib/content/locations";

const BASE = "https://vantageconnections.com";

/**
 * App Router sitemap. Lists every public route + per-service / per-insight /
 * per-location / per-project URL. `lastModified` defaults to build time —
 * Next.js regenerates this on every deploy.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/process`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = featuredProjects.map((p) => ({
    url: `${BASE}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    // Pillar > sub-pillar > spoke
    priority:
      s.category === "pillar"
        ? 0.9
        : s.category === "sub-pillar"
          ? 0.85
          : 0.75,
  }));

  const insightRoutes: MetadataRoute.Sitemap = insights.map((i) => ({
    url: `${BASE}/insights/${i.slug}`,
    lastModified: new Date(i.publishedAt),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const locationRoutes: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${BASE}/locations/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...insightRoutes,
    ...locationRoutes,
  ];
}
