import { describe, expect, it } from "vitest";
import { caseStudySchema, isPublishable, scenarioSchema, testimonialSchema } from "@/lib/schemas";

describe("proof gate (PRD §2.2)", () => {
  it("publishes only approved AND verified records", () => {
    expect(isPublishable({ publishStatus: "approved", verified: true })).toBe(true);
    expect(isPublishable({ publishStatus: "approved", verified: false })).toBe(false);
    expect(isPublishable({ publishStatus: "draft", verified: true })).toBe(false);
    expect(isPublishable({ publishStatus: "archived", verified: true })).toBe(false);
  });
});

describe("scenario schema (PRD §2.3)", () => {
  const base = {
    slug: "example-scenario",
    title: "Example",
    situation: "A situation description.",
    approach: ["one", "two", "three"],
    typicalOutcomes: ["a", "b"],
    serviceSlugs: ["cloud-platform-engineering"],
  };

  it("requires scenarios to be explicitly illustrative", () => {
    expect(scenarioSchema.safeParse({ ...base, illustrative: true }).success).toBe(true);
    expect(scenarioSchema.safeParse({ ...base, illustrative: false }).success).toBe(false);
    expect(scenarioSchema.safeParse(base).success).toBe(false);
  });
});

describe("testimonial schema (PRD §17.2)", () => {
  it("requires a real person, role, and organization", () => {
    const result = testimonialSchema.safeParse({
      publishStatus: "approved",
      verified: true,
      approvalReference: "APR-001",
      quote: "Great partner.",
      personName: "",
      personRole: "CTO",
      organization: "Example Co",
    });
    expect(result.success).toBe(false);
  });
});

describe("case study schema", () => {
  it("validates a complete anonymized case study", () => {
    const result = caseStudySchema.safeParse({
      publishStatus: "draft",
      verified: false,
      slug: "b2b-software-modernization",
      kind: "anonymized",
      clientDescriptor: "North American B2B software company",
      title: "Modernizing a customer platform",
      context: "Context.",
      challenge: "Challenge.",
      approach: ["Assessed the platform"],
      outcome: ["Approved outcome statement"],
      serviceSlugs: ["software-engineering-modernization"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid slugs", () => {
    const result = caseStudySchema.safeParse({
      publishStatus: "draft",
      verified: false,
      slug: "Bad Slug!",
      kind: "anonymized",
      clientDescriptor: "d",
      title: "t",
      context: "c",
      challenge: "c",
      approach: ["a"],
      outcome: ["o"],
      serviceSlugs: ["software-engineering-modernization"],
    });
    expect(result.success).toBe(false);
  });
});
