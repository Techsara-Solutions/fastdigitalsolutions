import { describe, expect, it } from "vitest";
import { contactFormSchema, toApiPayload } from "@/lib/contact-schema";

const validValues = {
  fullName: "Jordan Lee",
  workEmail: "jordan@example.com",
  company: "Example Company",
  country: "United States",
  service: "cloud-platform-engineering",
  projectSummary:
    "We need to assess and modernize a customer-facing application currently hosted on legacy infrastructure.",
  budgetRange: "prefer-to-discuss",
  timeline: "1-3-months",
  phone: "+1 555 555 5555",
  consent: true as const,
  website: "",
};

describe("contact form validation (PRD §22.1)", () => {
  it("accepts a valid submission", () => {
    expect(contactFormSchema.safeParse(validValues).success).toBe(true);
  });

  it("enforces name length 2–100", () => {
    expect(contactFormSchema.safeParse({ ...validValues, fullName: "J" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...validValues, fullName: "J".repeat(101) }).success).toBe(
      false,
    );
  });

  it("rejects invalid and over-long emails", () => {
    expect(contactFormSchema.safeParse({ ...validValues, workEmail: "not-an-email" }).success).toBe(
      false,
    );
    expect(
      contactFormSchema.safeParse({
        ...validValues,
        workEmail: `${"a".repeat(250)}@example.com`,
      }).success,
    ).toBe(false);
  });

  it("requires a project summary of 30–3000 characters", () => {
    expect(
      contactFormSchema.safeParse({ ...validValues, projectSummary: "Too short." }).success,
    ).toBe(false);
    expect(
      contactFormSchema.safeParse({ ...validValues, projectSummary: "x".repeat(3001) }).success,
    ).toBe(false);
  });

  it("requires explicit consent", () => {
    expect(contactFormSchema.safeParse({ ...validValues, consent: false }).success).toBe(false);
  });

  it("rejects submissions where the honeypot is filled (PRD §22.1)", () => {
    expect(contactFormSchema.safeParse({ ...validValues, website: "spam.example" }).success).toBe(
      false,
    );
  });

  it("allows optional fields to be omitted", () => {
    const { budgetRange, timeline, phone, ...rest } = validValues;
    void budgetRange;
    void timeline;
    void phone;
    expect(contactFormSchema.safeParse(rest).success).toBe(true);
  });

  it("rejects unknown service values", () => {
    expect(
      contactFormSchema.safeParse({ ...validValues, service: "blockchain-consulting" }).success,
    ).toBe(false);
  });
});

describe("API payload (PRD §22.3)", () => {
  it("includes sourcePath and omits empty optional fields", () => {
    const payload = toApiPayload(
      { ...validValues, budgetRange: "", timeline: "", phone: "" },
      "/contact/",
    );
    expect(payload.sourcePath).toBe("/contact/");
    expect(payload.budgetRange).toBeUndefined();
    expect(payload.timeline).toBeUndefined();
    expect(payload.phone).toBeUndefined();
    expect(payload.website).toBe("");
  });

  it("never includes trusted backend-owned fields", () => {
    const payload = toApiPayload(validValues, "/contact/") as Record<string, unknown>;
    expect(payload).not.toHaveProperty("timestamp");
    expect(payload).not.toHaveProperty("ip");
    expect(payload).not.toHaveProperty("verified");
  });
});
