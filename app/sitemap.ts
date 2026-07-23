import type { MetadataRoute } from "next";

const siteUrl = "https://teacher-plan-ai.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/terms", "/privacy", "/refund", "/login", "/register"];

  return staticPages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
