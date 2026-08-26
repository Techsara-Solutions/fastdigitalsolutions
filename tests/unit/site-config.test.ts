import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getContactApiUrl, getSiteUrl, isPlaceholder, siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";

/**
 * Regression cover for the 2026-08-26 deploy failure.
 *
 * GitHub Actions substitutes an EMPTY STRING for an unset `${{ vars.X }}`
 * reference rather than leaving the variable undefined. The original
 * `process.env.X ?? fallback` did not catch that, so a blank site URL was
 * treated as a real configured domain and `new URL("")` crashed the
 * production build while collecting page metadata.
 */

const SITE_URL = "NEXT_PUBLIC_SITE_URL";
const API_URL = "NEXT_PUBLIC_CONTACT_API_URL";

let originalSiteUrl: string | undefined;
let originalApiUrl: string | undefined;

beforeEach(() => {
  originalSiteUrl = process.env[SITE_URL];
  originalApiUrl = process.env[API_URL];
});

afterEach(() => {
  if (originalSiteUrl === undefined) delete process.env[SITE_URL];
  else process.env[SITE_URL] = originalSiteUrl;
  if (originalApiUrl === undefined) delete process.env[API_URL];
  else process.env[API_URL] = originalApiUrl;
});

describe("isPlaceholder", () => {
  it("treats blank and missing values as placeholders", () => {
    expect(isPlaceholder("")).toBe(true);
    expect(isPlaceholder("   ")).toBe(true);
    expect(isPlaceholder(null)).toBe(true);
    expect(isPlaceholder(undefined)).toBe(true);
  });

  it("treats PENDING markers as placeholders", () => {
    expect(isPlaceholder("https://[DOMAIN-PENDING]")).toBe(true);
    expect(isPlaceholder("hello@[DOMAIN-PENDING]")).toBe(true);
  });

  it("accepts a real value", () => {
    expect(isPlaceholder("https://example.com")).toBe(false);
  });
});

describe("getSiteUrl", () => {
  it("falls back to the configured placeholder when the env var is unset", () => {
    delete process.env[SITE_URL];
    expect(getSiteUrl()).toBe(siteConfig.domain);
  });

  it("falls back when the env var is an empty string (the CI failure mode)", () => {
    process.env[SITE_URL] = "";
    expect(getSiteUrl()).toBe(siteConfig.domain);
  });

  it("falls back when the env var is only whitespace", () => {
    process.env[SITE_URL] = "   ";
    expect(getSiteUrl()).toBe(siteConfig.domain);
  });

  it("uses a real configured value, trimmed", () => {
    process.env[SITE_URL] = "  https://example.com  ";
    expect(getSiteUrl()).toBe("https://example.com");
  });
});

describe("getContactApiUrl", () => {
  it("is undefined when unset, blank, or a placeholder", () => {
    delete process.env[API_URL];
    expect(getContactApiUrl()).toBeUndefined();
    process.env[API_URL] = "";
    expect(getContactApiUrl()).toBeUndefined();
    process.env[API_URL] = "   ";
    expect(getContactApiUrl()).toBeUndefined();
    process.env[API_URL] = "https://[CONTACT-API-PENDING]";
    expect(getContactApiUrl()).toBeUndefined();
  });

  it("returns a real endpoint", () => {
    process.env[API_URL] = "https://api.example.com/contact";
    expect(getContactApiUrl()).toBe("https://api.example.com/contact");
  });
});

describe("buildMetadata", () => {
  const page = { title: "About", description: "About us.", path: "/about/" };

  it("does not throw and marks pages noindex when the site URL is blank", () => {
    process.env[SITE_URL] = "";
    expect(() => buildMetadata(page)).not.toThrow();
    const metadata = buildMetadata(page);
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.metadataBase).toBeUndefined();
    expect(metadata.alternates?.canonical).toBeUndefined();
  });

  it("does not throw when the site URL is unset", () => {
    delete process.env[SITE_URL];
    expect(() => buildMetadata(page)).not.toThrow();
  });

  it("sets canonical metadata once a real domain is configured", () => {
    process.env[SITE_URL] = "https://example.com";
    const metadata = buildMetadata(page);
    expect(metadata.robots).toBeUndefined();
    expect(String(metadata.metadataBase)).toBe("https://example.com/");
    expect(metadata.alternates?.canonical).toBe("/about/");
  });
});
