import type { MetadataRoute } from "next";

import { listPublishedArticles } from "@/lib/admin-content";
import { navigationLinks, referenceServicePages } from "@/lib/site-data";

export const dynamic = "force-dynamic";

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://patentzoom.us").replace(/\/$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = getAppUrl();
  const articles = await listPublishedArticles();
  const staticPaths = new Set([
    "/",
    "/about",
    "/contact",
    "/knowledge-center",
    ...navigationLinks.map((link) => link.href),
    ...Object.keys(referenceServicePages).map((key) => `/${key}`),
  ]);

  return [
    ...Array.from(staticPaths).map((path) => ({
      url: `${appUrl}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      changeFrequency: (path === "/knowledge-center" ? "daily" : "weekly") as
        | "daily"
        | "weekly",
      priority: path === "/" ? 1 : path === "/knowledge-center" ? 0.9 : 0.8,
    })),
    ...articles.map((article) => ({
      url: `${appUrl}/knowledge-center/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];
}
