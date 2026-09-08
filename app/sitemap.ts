import type { MetadataRoute } from "next";
import { SUBJECT_SLUGS } from "@/lib/programs";

const siteUrl = "https://www.teacher-plan-ai.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/terms", "/privacy", "/refund", "/login", "/register", "/plans"];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/plans" ? 0.8 : 0.6,
  }));

  // По одній індексованій сторінці на кожен із 14 предметів — саме те, за
  // чим реально шукають у вересні/січні ("календарний план хімія 8 клас").
  const subjectEntries: MetadataRoute.Sitemap = Object.values(SUBJECT_SLUGS).map((slug) => ({
    url: `${siteUrl}/plans/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...subjectEntries];
}
