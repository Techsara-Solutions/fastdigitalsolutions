import { getSiteUrl, isPlaceholder, siteConfig } from "@/content/site";

/**
 * Organization structured data (PRD §24.3) — only verified fields, and only
 * once the production domain exists. Placeholder values are never published,
 * and LocalBusiness is deliberately not used (mailing address ≠ premises).
 */
export function OrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  if (isPlaceholder(siteUrl)) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    url: siteUrl,
    foundingDate: String(siteConfig.foundedYear),
    telephone: "+1-302-464-5943",
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
