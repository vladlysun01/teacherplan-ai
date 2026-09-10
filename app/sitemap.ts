import type { MetadataRoute } from "next";
import { SUBJECT_SLUGS, getAllSubjectClassPairs } from "@/lib/programs";

const siteUrl = "https://www.teacher-plan-ai.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/terms", "/privacy", "/refund", "/login", "/register", "/plans"];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/plans" ? 0.8 : 0.6,
  }));

  // По одній індексованій сторінці на кожен предмет — ширший запит
  // штибу "календарний план хімія".
  const subjectEntries: MetadataRoute.Sitemap = Object.values(SUBJECT_SLUGS).map((slug) => ({
    url: `${siteUrl}/plans/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // І окремо — по сторінці на кожну пару предмет×клас, під довгі запити
  // штибу "календарний план хімія 8 клас 2026-2027", за якими реально
  // ранжуються конкуренти (vseosvita.ua, naurok.com.ua, osvita.ua).
  const subjectClassEntries: MetadataRoute.Sitemap = getAllSubjectClassPairs().map(({ slug, classNum }) => ({
    url: `${siteUrl}/plans/${slug}/${classNum}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticEntries, ...subjectEntries, ...subjectClassEntries];
}
