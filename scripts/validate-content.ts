/**
 * Build-time content validation gate (PRD §2.2, §17.2).
 *
 * Runs before every `next build` (see the `prebuild` script). The build FAILS
 * when any rule below is violated, and prints a visible warning block for
 * unresolved production placeholders (PRD §17.3).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import {
  careerRoleSchema,
  caseStudySchema,
  certificationSchema,
  clientLogoSchema,
  engagementModelSchema,
  industrySchema,
  insightFrontmatterSchema,
  metricSchema,
  personSchema,
  scenarioSchema,
  serviceSchema,
  testimonialSchema,
  type ProofRecord,
} from "../src/lib/schemas";
import { services } from "../src/content/services";
import { industries } from "../src/content/industries";
import { engagementModels } from "../src/content/engagement-models";
import { scenarios } from "../src/content/scenarios";
import { caseStudies } from "../src/content/case-studies";
import { careerRoles } from "../src/content/careers";
import { people } from "../src/content/people";
import { certifications, clientLogos, metrics, testimonials } from "../src/content/proof";
import { siteConfig, isPlaceholder } from "../src/content/site";

const errors: string[] = [];
const warnings: string[] = [];

function validateCollection<T>(
  label: string,
  items: T[],
  schema: { safeParse: (value: unknown) => { success: boolean; error?: { message: string } } },
): void {
  items.forEach((item, index) => {
    const result = schema.safeParse(item);
    if (!result.success) {
      errors.push(`${label}[${index}]: ${result.error?.message ?? "schema validation failed"}`);
    }
  });
}

function assertUniqueSlugs(label: string, slugs: string[]): void {
  const seen = new Set<string>();
  for (const slug of slugs) {
    if (seen.has(slug)) errors.push(`${label}: duplicate slug "${slug}"`);
    seen.add(slug);
  }
}

/** Approved proof content must be verified — the core credibility gate. */
function assertProofGate(label: string, records: (ProofRecord & { [key: string]: unknown })[]) {
  records.forEach((record, index) => {
    if (record.publishStatus === "approved" && record.verified !== true) {
      errors.push(
        `${label}[${index}]: publishStatus is "approved" but verified is not true. ` +
          `Proof content cannot publish without verification (PRD §2.2).`,
      );
    }
    if (record.publishStatus === "approved" && !record.approvalReference) {
      errors.push(
        `${label}[${index}]: approved proof content requires an approvalReference (PRD §14.5).`,
      );
    }
  });
}

/* Schema validation ------------------------------------------------- */
validateCollection("services", services, serviceSchema);
validateCollection("industries", industries, industrySchema);
validateCollection("engagementModels", engagementModels, engagementModelSchema);
validateCollection("scenarios", scenarios, scenarioSchema);
validateCollection("caseStudies", caseStudies, caseStudySchema);
validateCollection("careerRoles", careerRoles, careerRoleSchema);
validateCollection("people", people, personSchema);
validateCollection("testimonials", testimonials, testimonialSchema);
validateCollection("clientLogos", clientLogos, clientLogoSchema);
validateCollection("metrics", metrics, metricSchema);
validateCollection("certifications", certifications, certificationSchema);

/* Slug integrity ----------------------------------------------------- */
const serviceSlugs = services.map((s) => s.slug);
const scenarioSlugs = scenarios.map((s) => s.slug);
assertUniqueSlugs("services", serviceSlugs);
assertUniqueSlugs(
  "industries",
  industries.map((i) => i.slug),
);
assertUniqueSlugs("scenarios", scenarioSlugs);
assertUniqueSlugs(
  "caseStudies",
  caseStudies.map((c) => c.slug),
);

/* Cross-reference validity (CTA/link destinations — PRD §17.2) ------- */
for (const service of services) {
  for (const related of service.relatedSlugs) {
    if (!serviceSlugs.includes(related)) {
      errors.push(`services/${service.slug}: relatedSlug "${related}" does not exist`);
    }
  }
  if (service.scenarioSlug && !scenarioSlugs.includes(service.scenarioSlug)) {
    errors.push(`services/${service.slug}: scenarioSlug "${service.scenarioSlug}" does not exist`);
  }
}
for (const industry of industries) {
  for (const slug of industry.relevantServiceSlugs) {
    if (!serviceSlugs.includes(slug)) {
      errors.push(`industries/${industry.slug}: service slug "${slug}" does not exist`);
    }
  }
}
for (const scenario of scenarios) {
  for (const slug of scenario.serviceSlugs) {
    if (!serviceSlugs.includes(slug)) {
      errors.push(`scenarios/${scenario.slug}: service slug "${slug}" does not exist`);
    }
  }
}

/* Proof gates -------------------------------------------------------- */
assertProofGate("caseStudies", caseStudies);
assertProofGate("testimonials", testimonials);
assertProofGate("clientLogos", clientLogos);
assertProofGate("metrics", metrics);
assertProofGate("certifications", certifications);
assertProofGate("people", people);
assertProofGate("careerRoles", careerRoles);

for (const study of caseStudies) {
  if (study.kind === "named" && !study.clientName) {
    errors.push(`caseStudies/${study.slug}: named case studies require clientName`);
  }
}

/* Insights (MDX frontmatter) ----------------------------------------- */
const insightsDir = path.join(process.cwd(), "src", "content", "insights");
const insightSlugs: string[] = [];
if (fs.existsSync(insightsDir)) {
  for (const file of fs.readdirSync(insightsDir).filter((f) => f.endsWith(".mdx"))) {
    const raw = fs.readFileSync(path.join(insightsDir, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = insightFrontmatterSchema.safeParse({
      ...data,
      slug: data.slug ?? file.replace(/\.mdx$/, ""),
    });
    if (!parsed.success) {
      errors.push(`insights/${file}: ${parsed.error.message}`);
      continue;
    }
    const fm = parsed.data;
    insightSlugs.push(fm.slug);
    if (fm.publishStatus === "approved" && fm.verified !== true) {
      errors.push(`insights/${file}: approved article is not verified (PRD §2.2)`);
    }
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    if (fm.publishStatus === "approved" && wordCount < 900) {
      errors.push(
        `insights/${file}: approved article has ${wordCount} words; the quality floor is 900 (PRD §14.8)`,
      );
    }
    if (fm.publishStatus === "approved" && /\[(AUTHOR|PENDING)/i.test(fm.author)) {
      errors.push(`insights/${file}: approved article has a placeholder author`);
    }
    for (const slug of fm.relatedServiceSlugs) {
      if (!serviceSlugs.includes(slug)) {
        errors.push(`insights/${file}: related service slug "${slug}" does not exist`);
      }
    }
  }
  assertUniqueSlugs("insights", insightSlugs);
}

/* Legal pages exist -------------------------------------------------- */
for (const legal of ["privacy.mdx", "terms.mdx", "accessibility.mdx"]) {
  const legalPath = path.join(process.cwd(), "src", "content", "legal", legal);
  if (!fs.existsSync(legalPath)) {
    errors.push(`legal: missing required file src/content/legal/${legal}`);
  }
}

/* Placeholder warnings (production blockers — PRD §17.3, §32.1) ------- */
if (isPlaceholder(siteConfig.domain)) warnings.push("Site domain is a placeholder");
if (isPlaceholder(siteConfig.email)) warnings.push("Business email is a placeholder");
if (siteConfig.legalName === null)
  warnings.push("Legal entity name is unverified (footer shows brand name only)");
if (!fs.existsSync(path.join(process.cwd(), "public", "images", "logo.svg"))) {
  warnings.push("Final logo is pending (text wordmark in use)");
}
if (!process.env.NEXT_PUBLIC_CONTACT_API_URL) {
  warnings.push("NEXT_PUBLIC_CONTACT_API_URL is not set (contact page shows the fallback state)");
}

/* Report ------------------------------------------------------------- */
if (warnings.length > 0) {
  console.warn("\n┌─ CONTENT WARNINGS — unresolved production placeholders ─────────");
  for (const warning of warnings) console.warn(`│  ⚠ ${warning}`);
  console.warn("└─ All placeholders are production launch blockers (PRD §32.1). ──\n");
}

if (errors.length > 0) {
  console.error("\n┌─ CONTENT VALIDATION FAILED ─────────────────────────────────────");
  for (const error of errors) console.error(`│  ✖ ${error}`);
  console.error("└─ Fix the issues above; the build is blocked (PRD §17.2). ───────\n");
  process.exit(1);
}

console.log(
  `Content validation passed: ${services.length} services, ${industries.length} industries, ${scenarios.length} scenarios, ${insightSlugs.length} insight file(s).`,
);
