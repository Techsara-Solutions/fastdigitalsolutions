/**
 * Site identity configuration.
 *
 * PLACEHOLDER POLICY: values containing "PENDING" are development
 * placeholders. `npm run validate:content` prints a visible warning for every
 * unresolved placeholder; all of them are production launch blockers.
 * Never invent a legal name, domain, or email.
 */
export const siteConfig = {
  /** Short brand name — wordmark, navigation, page titles. */
  brandName: "Fast Digital Solutions",
  /** Registered entity — footer copyright, legal pages, consent text, structured data. */
  legalName: "Fast Digital Solutions LLC",
  domain: "https://fastdigitalsolutions.com",
  email: "hello@fastdigitalsolutions.com",
  phoneDisplay: "+1 302-464-5943",
  phoneHref: "tel:+13024645943",
  phoneE164: "+1-302-464-5943",
  timeZoneLabel: "Eastern Time (ET)",
  responseCommitment: "within two business days",
  /** Must always be labelled a mailing address — never an office/HQ. */
  mailingAddress: {
    label: "Business mailing address",
    line1: "1207 Delaware Ave #1166",
    city: "Wilmington",
    region: "DE",
    postalCode: "19806",
    country: "United States",
  },
  categoryStatement:
    "Fast Digital Solutions LLC is a digital engineering company that helps organizations modernize applications, build cloud platforms, apply AI and automation, improve software quality, and extend delivery capacity.",
  /**
   * Production contact endpoint (API Gateway → Lambda). Baked in as the
   * default so local, CI, and deploy builds all post to the real service;
   * NEXT_PUBLIC_CONTACT_API_URL overrides it (the E2E build points it at a
   * mock host).
   */
  contactApiUrl: "https://9jdb11lm21.execute-api.us-east-1.amazonaws.com/api/contact-message",
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Reads an environment variable, treating blank values as absent.
 *
 * CI systems substitute an EMPTY STRING for an unset variable rather than
 * leaving it undefined — GitHub Actions does this for every `${{ vars.X }}`
 * reference. `??` does not catch that, so an unset repository variable would
 * otherwise be mistaken for a real configured value.
 */
function readEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Resolves the public site URL: env var wins, then config, for metadata generation. */
export function getSiteUrl(): string {
  return readEnv(process.env.NEXT_PUBLIC_SITE_URL) ?? siteConfig.domain;
}

/**
 * Resolves the contact API endpoint. The env var wins when set to a real URL;
 * a placeholder value (anything containing "PENDING") disables the form and
 * shows the fallback state instead.
 */
export function getContactApiUrl(): string | undefined {
  const override = readEnv(process.env.NEXT_PUBLIC_CONTACT_API_URL);
  if (override) return isPlaceholder(override) ? undefined : override;
  return siteConfig.contactApiUrl;
}

/**
 * True when a value is not a usable production value — either missing/blank or
 * still carrying a development placeholder. Blank counts as a placeholder:
 * nothing downstream (canonical URLs, JSON-LD, sitemap) may be built from it.
 */
export function isPlaceholder(value: string | null | undefined): boolean {
  if (typeof value !== "string") return true;
  const trimmed = value.trim();
  return trimmed.length === 0 || trimmed.includes("PENDING");
}
