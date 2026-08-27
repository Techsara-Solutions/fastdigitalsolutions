import { z } from "zod";

/**
 * Content schemas and the credibility gate (PRD §2.2, §17.2).
 *
 * Every "proof" record (case studies, testimonials, client logos, metrics,
 * certifications, partner marks, leadership profiles) carries a proof record.
 * The production build fails when a record would publish with
 * `verified !== true` or `publishStatus !== "approved"`.
 */

export const publishStatusSchema = z.enum(["draft", "approved", "archived"]);
export type PublishStatus = z.infer<typeof publishStatusSchema>;

export const proofRecordSchema = z.object({
  publishStatus: publishStatusSchema,
  verified: z.boolean(),
  approvalReference: z.string().min(1).optional(),
  approvedBy: z.string().min(1).optional(),
  approvedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "approvedAt must be YYYY-MM-DD")
    .optional(),
});
export type ProofRecord = z.infer<typeof proofRecordSchema>;

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slugs must be lowercase-kebab-case");

/** A proof record is publishable only when approved AND verified. */
export function isPublishable(record: ProofRecord): boolean {
  return record.publishStatus === "approved" && record.verified === true;
}

/* ------------------------------------------------------------------ */
/* Services (PRD §8, §14.3)                                            */
/* ------------------------------------------------------------------ */

export const capabilityGroupSchema = z.object({
  title: z.string().min(1),
  items: z.array(z.string().min(1)).min(2),
});

export const serviceSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  /** Short label for the home-page capability strip. */
  stripLabel: z.string().min(1),
  /** The client problem this service answers (PRD §8 "Client need"). */
  clientNeed: z.string().min(1),
  /** Short outcome statement for index cards. */
  outcome: z.string().min(1),
  /** Card summary copy. */
  summary: z.string().min(1),
  /** 4–6 selected capabilities shown on the services index card. */
  cardCapabilities: z.array(z.string().min(1)).min(4).max(6),
  hero: z.object({
    headline: z.string().min(1),
    copy: z.string().min(1),
  }),
  /** "Where this helps" client situations. */
  situations: z.array(z.string().min(1)).min(3),
  capabilityGroups: z.array(capabilityGroupSchema).min(2),
  deliveryApproach: z.array(z.string().min(1)).min(3),
  /** Quality, security, and operational considerations. */
  considerations: z.array(z.string().min(1)).min(3),
  /** What is deliberately not promised without discovery (PRD §14.3 content rule). */
  notPromised: z.array(z.string().min(1)).min(1),
  relatedSlugs: z.array(slugSchema).min(1),
  scenarioSlug: slugSchema.optional(),
  /** Manifest ids (src/content/image-manifest.ts) for the home card and the detail hero. */
  cardImageId: slugSchema.optional(),
  heroImageId: slugSchema.optional(),
});
export type Service = z.infer<typeof serviceSchema>;

/* ------------------------------------------------------------------ */
/* Industries (PRD §9, §14.4)                                          */
/* ------------------------------------------------------------------ */

export const industrySchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  /** The operating challenge emphasised on tiles — not a market-dominance claim. */
  challenge: z.string().min(1),
  summary: z.string().min(1),
  commonNeeds: z.array(z.string().min(1)).min(4),
  relevantServiceSlugs: z.array(slugSchema).min(2),
  /** Manifest id for the home-page photo tile. */
  tileImageId: slugSchema.optional(),
});
export type Industry = z.infer<typeof industrySchema>;

/* ------------------------------------------------------------------ */
/* Engagement models (PRD §10)                                         */
/* ------------------------------------------------------------------ */

export const engagementModelSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  bestFor: z.string().min(1),
  explanation: z.string().min(1),
});
export type EngagementModel = z.infer<typeof engagementModelSchema>;

/* ------------------------------------------------------------------ */
/* Representative scenarios (PRD §2.3, §14.5 State A)                  */
/* ------------------------------------------------------------------ */

export const scenarioSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  /** Must always be true — scenarios are illustrative, never client claims. */
  illustrative: z.literal(true),
  situation: z.string().min(1),
  approach: z.array(z.string().min(1)).min(3),
  typicalOutcomes: z.array(z.string().min(1)).min(2),
  serviceSlugs: z.array(slugSchema).min(1),
});
export type Scenario = z.infer<typeof scenarioSchema>;

/* ------------------------------------------------------------------ */
/* Case studies (PRD §14.5 States B/C) — gated proof content           */
/* ------------------------------------------------------------------ */

export const caseStudySchema = proofRecordSchema.extend({
  slug: slugSchema,
  /** "named" requires written client permission; "anonymized" requires contractual permission. */
  kind: z.enum(["anonymized", "named"]),
  clientName: z.string().min(1).optional(),
  clientDescriptor: z.string().min(1),
  title: z.string().min(1),
  context: z.string().min(1),
  challenge: z.string().min(1),
  approach: z.array(z.string().min(1)).min(1),
  outcome: z.array(z.string().min(1)).min(1),
  serviceSlugs: z.array(slugSchema).min(1),
});
export type CaseStudy = z.infer<typeof caseStudySchema>;

/* ------------------------------------------------------------------ */
/* Trust content (PRD §16.4) — all gated                               */
/* ------------------------------------------------------------------ */

export const testimonialSchema = proofRecordSchema.extend({
  quote: z.string().min(1),
  personName: z.string().min(1),
  personRole: z.string().min(1),
  organization: z.string().min(1),
});
export type Testimonial = z.infer<typeof testimonialSchema>;

export const clientLogoSchema = proofRecordSchema.extend({
  organization: z.string().min(1),
  logoSrc: z.string().min(1),
  logoAlt: z.string().min(1),
});
export type ClientLogo = z.infer<typeof clientLogoSchema>;

export const metricSchema = proofRecordSchema.extend({
  value: z.string().min(1),
  label: z.string().min(1),
  source: z.string().min(1),
});
export type Metric = z.infer<typeof metricSchema>;

export const certificationSchema = proofRecordSchema.extend({
  name: z.string().min(1),
  issuer: z.string().min(1),
  verificationUrl: z.string().url().optional(),
});
export type Certification = z.infer<typeof certificationSchema>;

export const personSchema = proofRecordSchema.extend({
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  headshotSrc: z.string().min(1).optional(),
  headshotAlt: z.string().min(1).optional(),
  profileUrl: z.string().url().optional(),
});
export type Person = z.infer<typeof personSchema>;

/* ------------------------------------------------------------------ */
/* Careers (PRD §14.9)                                                 */
/* ------------------------------------------------------------------ */

export const careerRoleSchema = proofRecordSchema.extend({
  slug: slugSchema,
  title: z.string().min(1),
  employmentType: z.string().min(1),
  location: z.string().min(1),
  timeZoneExpectations: z.string().min(1),
  responsibilities: z.array(z.string().min(1)).min(1),
  requiredSkills: z.array(z.string().min(1)).min(1),
  preferredSkills: z.array(z.string().min(1)).optional(),
  hiringProcess: z.array(z.string().min(1)).min(1),
  applicationDestination: z.string().min(1),
});
export type CareerRole = z.infer<typeof careerRoleSchema>;

/* ------------------------------------------------------------------ */
/* Insights (PRD §14.8) — MDX frontmatter                              */
/* ------------------------------------------------------------------ */

export const insightFrontmatterSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  topic: z.string().min(1),
  /** Real author name and role are launch requirements for approval. */
  author: z.string().min(1),
  authorRole: z.string().min(1),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "publishedAt must be YYYY-MM-DD"),
  updatedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "updatedAt must be YYYY-MM-DD")
    .optional(),
  publishStatus: publishStatusSchema,
  verified: z.boolean(),
  relatedServiceSlugs: z.array(slugSchema).min(1),
  /** Manifest id for the card/article cover photo. */
  coverImageId: slugSchema.optional(),
});
export type InsightFrontmatter = z.infer<typeof insightFrontmatterSchema>;
