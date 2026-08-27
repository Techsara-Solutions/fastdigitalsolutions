import { getSiteUrl, isPlaceholder, siteConfig } from "@/content/site";

/**
 * Organization structured data — only verified fields, and only once the
 * production domain exists. Placeholder values are never published, and
 * LocalBusiness is deliberately not used (mailing address ≠ premises).
 */
export function OrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  if (isPlaceholder(siteUrl)) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    ...(isPlaceholder(siteConfig.legalName) ? {} : { legalName: siteConfig.legalName }),
    url: siteUrl,
    telephone: siteConfig.phoneE164,
    ...(isPlaceholder(siteConfig.email) ? {} : { email: siteConfig.email }),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.mailingAddress.line1,
      addressLocality: siteConfig.mailingAddress.city,
      addressRegion: siteConfig.mailingAddress.region,
      postalCode: siteConfig.mailingAddress.postalCode,
      addressCountry: "US",
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
