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
import { siteConfig, isPlaceholder, getContactApiUrl } from "../src/content/site";
import { imageManifest, PIPELINE_VERSION } from "../src/content/image-manifest";
import { CLASS_MAX_BYTES, type GeneratedImage } from "../src/lib/image-types";
import { manifestHash } from "../src/lib/image-hash";

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
    if (fm.coverImageId && !imageManifest.some((slot) => slot.id === fm.coverImageId)) {
      errors.push(`insights/${file}: coverImageId "${fm.coverImageId}" is not in the manifest`);
    }
  }
  assertUniqueSlugs("insights", insightSlugs);
}

/* Photography (manifest ↔ generated derivatives) --------------------- */
//
// The generated record and the derivatives in public/images are committed;
// this gate guarantees a page can never ship a broken or oversized image and
// that the manifest and the generated module have not drifted apart.
const generatedImagesFile = path.join(process.cwd(), "src", "generated", "images.ts");
const generatedImages: Record<string, GeneratedImage> = {};
if (!fs.existsSync(generatedImagesFile)) {
  errors.push("images: src/generated/images.ts is missing — run `npm run images`");
} else {
  const source = fs.readFileSync(generatedImagesFile, "utf8");
  const start = source.indexOf("/*__JSON__*/");
  const end = source.indexOf("/*__END__*/");
  if (start < 0 || end < 0) {
    errors.push("images: src/generated/images.ts is not in the expected generated format");
  } else {
    Object.assign(
      generatedImages,
      JSON.parse(source.slice(start + "/*__JSON__*/".length, end).trim()),
    );
  }
}

const manifestIds = new Set<string>();
const manifestSources = new Set<string>();
for (const slot of imageManifest) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slot.id))
    errors.push(`images/${slot.id}: id must be kebab-case`);
  if (manifestIds.has(slot.id)) errors.push(`images: duplicate manifest id "${slot.id}"`);
  manifestIds.add(slot.id);
  if (manifestSources.has(slot.source)) {
    errors.push(
      `images/${slot.id}: source "${slot.source}" is already used by another slot — every photo appears once`,
    );
  }
  manifestSources.add(slot.source);
  if (!slot.decorative && slot.alt.trim().length === 0) {
    errors.push(
      `images/${slot.id}: informative images need alt text (or mark the slot decorative)`,
    );
  }
  if (slot.focus && ![slot.focus.x, slot.focus.y].every((v) => v >= 0 && v <= 1)) {
    errors.push(`images/${slot.id}: focus must be within 0–1`);
  }

  const generated = generatedImages[slot.id];
  if (!generated) {
    errors.push(`images/${slot.id}: no generated derivatives — run \`npm run images\``);
    continue;
  }
  if (generated.manifestHash !== manifestHash(slot, PIPELINE_VERSION)) {
    errors.push(
      `images/${slot.id}: manifest changed since derivatives were generated — run \`npm run images\``,
    );
  }
  const candidates = [
    ...generated.sources.avif.split(", "),
    ...generated.sources.webp.split(", "),
    `${generated.src} fallback`,
  ];
  for (const candidate of candidates) {
    const url = candidate.split(" ")[0] ?? "";
    const file = path.join(process.cwd(), "public", url.replace(/^\//, ""));
    if (!fs.existsSync(file)) {
      errors.push(`images/${slot.id}: derivative missing on disk — ${url}`);
      continue;
    }
    const maxBytes = CLASS_MAX_BYTES[slot.class];
    if (fs.statSync(file).size > maxBytes) {
      errors.push(`images/${slot.id}: ${url} exceeds the ${Math.round(maxBytes / 1024)} KB budget`);
    }
  }
}
for (const id of Object.keys(generatedImages)) {
  if (!manifestIds.has(id)) {
    errors.push(
      `images: generated id "${id}" is no longer in the manifest — run \`npm run images\``,
    );
  }
}

const imageRefs: [string, string | undefined][] = [
  ...services.flatMap((s): [string, string | undefined][] => [
    [`services/${s.slug}.cardImageId`, s.cardImageId],
    [`services/${s.slug}.heroImageId`, s.heroImageId],
  ]),
  ...industries.map((i): [string, string | undefined] => [
    `industries/${i.slug}.tileImageId`,
    i.tileImageId,
  ]),
];
for (const [label, ref] of imageRefs) {
  if (ref && !manifestIds.has(ref))
    errors.push(`${label}: image id "${ref}" is not in the manifest`);
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
if (isPlaceholder(siteConfig.legalName)) warnings.push("Legal entity name is a placeholder");
if (!fs.existsSync(path.join(process.cwd(), "public", "images", "logo.svg"))) {
  warnings.push("Final logo is pending (text wordmark in use)");
}
if (!getContactApiUrl()) {
  warnings.push("NEXT_PUBLIC_CONTACT_API_URL is not set (contact page shows the fallback state)");
}

/* Environment sanity (fail fast rather than deep inside the build) ---- */
//
// A configured-but-malformed site URL would otherwise surface as an opaque
// "TypeError: Invalid URL" while Next collects page metadata. Note that CI
// systems pass an EMPTY STRING for unset variables, which getSiteUrl() treats
// as absent — this check only runs against a genuinely provided value.
const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
if (envSiteUrl && !isPlaceholder(envSiteUrl)) {
  try {
    const parsed = new URL(envSiteUrl);
    if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") {
      warnings.push(`NEXT_PUBLIC_SITE_URL is not https (${envSiteUrl})`);
    }
  } catch {
    errors.push(
      `NEXT_PUBLIC_SITE_URL is not a valid absolute URL: "${envSiteUrl}". ` +
        `Use a full origin, for example https://example.com`,
    );
  }
}

const envApiUrl = process.env.NEXT_PUBLIC_CONTACT_API_URL?.trim();
if (envApiUrl && !isPlaceholder(envApiUrl)) {
  try {
    new URL(envApiUrl);
  } catch {
    errors.push(`NEXT_PUBLIC_CONTACT_API_URL is not a valid absolute URL: "${envApiUrl}"`);
  }
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
