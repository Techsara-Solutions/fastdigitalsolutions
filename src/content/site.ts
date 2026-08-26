/**
 * Site identity configuration (PRD §17.3, Document Control table).
 *
 * PLACEHOLDER POLICY: values containing "PENDING" are development
 * placeholders. `npm run validate:content` prints a visible warning for every
 * unresolved placeholder; all of them are production launch blockers
 * (PRD §32.1). Never invent a legal name, domain, or email.
 */
export const siteConfig = {
  brandName: "Fast Digital Solutions",
  /** Do NOT append "LLC"/"Inc." until formation documents confirm it (PRD §2.4). */
  legalName: null as string | null,
  /** Owner-confirmed start year; wording must be re-verified before launch. */
  foundedYear: 2023,
  sinceStatement: "Serving clients since 2023",
  domain: "https://[DOMAIN-PENDING]",
  email: "hello@[DOMAIN-PENDING]",
  phoneDisplay: "+1 302-464-5943",
  phoneHref: "tel:+13024645943",
  timeZoneLabel: "Eastern Time (ET)",
  responseCommitment: "within two business days",
  /** Must always be labelled a mailing address — never an office/HQ (PRD §2.5). */
  mailingAddress: {
    label: "Business mailing address",
    line1: "1207 Delaware Ave #1166",
    city: "Wilmington",
    region: "DE",
    postalCode: "19806",
    country: "United States",
  },
  categoryStatement:
    "Fast Digital Solutions is a digital engineering company that helps organizations modernize applications, build cloud platforms, apply AI and automation, improve software quality, and extend delivery capacity.",
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

/** Resolves the contact API endpoint, or undefined when it is not configured. */
export function getContactApiUrl(): string | undefined {
  const url = readEnv(process.env.NEXT_PUBLIC_CONTACT_API_URL);
  return url && !isPlaceholder(url) ? url : undefined;
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
