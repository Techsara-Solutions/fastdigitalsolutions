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

/** Resolves the public site URL: env var wins, then config, for metadata generation. */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.domain;
}

/** True when the value still carries a development placeholder. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return typeof value === "string" && value.includes("PENDING");
}
