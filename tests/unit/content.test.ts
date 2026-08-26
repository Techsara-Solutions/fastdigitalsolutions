import { describe, expect, it } from "vitest";
import {
  engagementModelSchema,
  industrySchema,
  scenarioSchema,
  serviceSchema,
} from "@/lib/schemas";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { engagementModels } from "@/content/engagement-models";
import { scenarios } from "@/content/scenarios";
import { getAllInsights, getPublishedInsights } from "@/lib/insights";

describe("content integrity (PRD §17.2)", () => {
  it("ships exactly six service groups (PRD §8)", () => {
    expect(services).toHaveLength(6);
  });

  it("every service validates against the schema", () => {
    for (const service of services) {
      const result = serviceSchema.safeParse(service);
      expect(result.success, `service ${service.slug}: ${result.error?.message}`).toBe(true);
    }
  });

  it("service slugs are unique and related slugs resolve", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const service of services) {
      for (const related of service.relatedSlugs) {
        expect(slugs, `related slug ${related} on ${service.slug}`).toContain(related);
      }
    }
  });

  it("ships exactly four industries that validate (PRD §9)", () => {
    expect(industries).toHaveLength(4);
    for (const industry of industries) {
      expect(industrySchema.safeParse(industry).success).toBe(true);
    }
  });

  it("ships exactly four engagement models (PRD §10)", () => {
    expect(engagementModels).toHaveLength(4);
    for (const model of engagementModels) {
      expect(engagementModelSchema.safeParse(model).success).toBe(true);
    }
  });

  it("every scenario is illustrative and validates (PRD §2.3)", () => {
    expect(scenarios.length).toBeGreaterThanOrEqual(1);
    expect(scenarios.length).toBeLessThanOrEqual(3);
    for (const scenario of scenarios) {
      expect(scenarioSchema.safeParse(scenario).success).toBe(true);
    }
  });
});

describe("insights gating (PRD §14.8, §17.2)", () => {
  it("draft articles never publish", () => {
    const all = getAllInsights();
    const published = getPublishedInsights();
    expect(all.length).toBeGreaterThanOrEqual(3);
    for (const insight of published) {
      expect(insight.frontmatter.publishStatus).toBe("approved");
      expect(insight.frontmatter.verified).toBe(true);
    }
    const draftSlugs = all
      .filter((i) => i.frontmatter.publishStatus !== "approved")
      .map((i) => i.frontmatter.slug);
    const publishedSlugs = published.map((i) => i.frontmatter.slug);
    for (const slug of draftSlugs) {
      expect(publishedSlugs).not.toContain(slug);
    }
  });

  it("draft launch articles meet the 900-word quality floor (PRD §14.8)", () => {
    for (const insight of getAllInsights()) {
      expect(insight.wordCount, insight.frontmatter.slug).toBeGreaterThanOrEqual(900);
    }
  });
});
