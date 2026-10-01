import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/resume`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...caseStudies.map((cs) => ({
      url: `${siteUrl}/work/${cs.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
