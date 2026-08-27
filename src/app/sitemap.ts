import type { MetadataRoute } from "next";
import { getSiteUrl, isPlaceholder } from "@/content/site";
import { services } from "@/content/services";
import { getPublishedInsights } from "@/lib/insights";

export const dynamic = "force-static";

/**
 * sitemap.xml generated from approved, public routes only (PRD §24.2).
 * Drafts and unverified content never appear. While the domain is a
 * placeholder (non-production), the sitemap stays empty so placeholder URLs
 * are never published.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (isPlaceholder(siteUrl)) return [];

  const base = siteUrl.replace(/\/$/, "");
  const staticRoutes = [
    "/",
    "/services/",
    "/industries/",
    "/work/",
    "/how-we-work/",
    "/insights/",
    "/about/",
    "/careers/",
    "/contact/",
  ];

  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}` })),
    ...services.map((service) => ({ url: `${base}/services/${service.slug}/` })),
    ...getPublishedInsights().map((insight) => ({
      url: `${base}/insights/${insight.frontmatter.slug}/`,
    })),
  ];
}
