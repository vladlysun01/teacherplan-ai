import type { MetadataRoute } from "next";

const siteUrl = "https://teacher-plan-ai.site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api", "/payment"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
