import { describe, expect, it } from "vitest";
import { API_FIELDS, contactFormSchema, toApiPayload } from "@/lib/contact-schema";

const validValues = {
  firstName: "Jordan",
  lastName: "Lee",
  email: "jordan@example.com",
  company: "Example Company",
  phoneNumber: "+1 302 555 0100",
  discussionTopic: "Cloud migration readiness",
  notes:
    "We need to assess and modernize a customer-facing application currently hosted on legacy infrastructure.",
  consent: true as const,
  website: "",
};

describe("contact form validation", () => {
  it("accepts a valid submission", () => {
    expect(contactFormSchema.safeParse(validValues).success).toBe(true);
  });

  it("requires first and last names of 1–60 characters", () => {
    expect(contactFormSchema.safeParse({ ...validValues, firstName: "" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...validValues, lastName: "L".repeat(61) }).success).toBe(
      false,
    );
  });

  it("rejects invalid and over-long emails", () => {
    expect(contactFormSchema.safeParse({ ...validValues, email: "not-an-email" }).success).toBe(
      false,
    );
    expect(
      contactFormSchema.safeParse({ ...validValues, email: `${"a".repeat(250)}@example.com` })
        .success,
    ).toBe(false);
  });

  it("requires a phone number in a plausible format", () => {
    expect(contactFormSchema.safeParse({ ...validValues, phoneNumber: "" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...validValues, phoneNumber: "call me" }).success).toBe(
      false,
    );
    expect(
      contactFormSchema.safeParse({ ...validValues, phoneNumber: "+91 9999999999" }).success,
    ).toBe(true);
  });

  it("requires a discussion topic of 3–120 characters", () => {
    expect(contactFormSchema.safeParse({ ...validValues, discussionTopic: "AI" }).success).toBe(
      false,
    );
    expect(
      contactFormSchema.safeParse({ ...validValues, discussionTopic: "x".repeat(121) }).success,
    ).toBe(false);
  });

  it("requires notes of 20–3000 characters", () => {
    expect(contactFormSchema.safeParse({ ...validValues, notes: "Too short." }).success).toBe(
      false,
    );
    expect(contactFormSchema.safeParse({ ...validValues, notes: "x".repeat(3001) }).success).toBe(
      false,
    );
  });

  it("requires explicit consent", () => {
    expect(contactFormSchema.safeParse({ ...validValues, consent: false }).success).toBe(false);
  });

  it("rejects submissions where the honeypot is filled", () => {
    expect(contactFormSchema.safeParse({ ...validValues, website: "spam.example" }).success).toBe(
      false,
    );
  });
});

describe("API payload", () => {
  it("contains exactly the seven documented fields", () => {
    const payload = toApiPayload(validValues);
    expect(Object.keys(payload).sort()).toEqual([...API_FIELDS].sort());
    expect(payload).toEqual({
      firstName: "Jordan",
      lastName: "Lee",
      email: "jordan@example.com",
      company: "Example Company",
      phoneNumber: "+1 302 555 0100",
      discussionTopic: "Cloud migration readiness",
      notes: validValues.notes,
    });
  });

  it("never sends client-only or backend-owned fields", () => {
    const payload = toApiPayload(validValues) as Record<string, unknown>;
    for (const key of ["consent", "website", "sourcePath", "timestamp", "ip", "verified"]) {
      expect(payload).not.toHaveProperty(key);
    }
  });
});
