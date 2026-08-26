import type { Metadata } from "next";
import { getSiteUrl, isPlaceholder, siteConfig } from "@/content/site";

type PageMetadataInput = {
  /** Page topic; becomes "{title} | Fast Digital Solutions" (PRD §24.1). */
  title: string;
  description: string;
  /** Route path with trailing slash, e.g. "/services/". */
  path: string;
  /** Override the full title (home page uses its own pattern). */
  absoluteTitle?: string;
};

/**
 * Per-page metadata helper (PRD §24.1–24.2).
 * While the production domain is still a placeholder, pages carry noindex and
 * omit canonical/OG URLs so placeholder values are never published.
 */
export function buildMetadata({
  title,
  description,
  path,
  absoluteTitle,
}: PageMetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const domainReady = !isPlaceholder(siteUrl);
  const fullTitle = absoluteTitle ?? `${title} | ${siteConfig.brandName}`;

  return {
    // Absolute: the root layout template must not re-append the brand name.
    title: { absolute: fullTitle },
    description,
    ...(domainReady
      ? {
          metadataBase: new URL(siteUrl),
          alternates: { canonical: path },
        }
      : {
          robots: { index: false, follow: false },
        }),
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      siteName: siteConfig.brandName,
      ...(domainReady ? { url: path } : {}),
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  };
}
