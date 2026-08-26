import type { MetadataRoute } from "next";
import { getSiteUrl, isPlaceholder } from "@/content/site";

export const dynamic = "force-static";

/**
 * robots.txt (PRD §24.2): normal crawling with a sitemap reference once the
 * production domain exists; full disallow while the environment is
 * non-production (placeholder domain).
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  if (isPlaceholder(siteUrl)) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
