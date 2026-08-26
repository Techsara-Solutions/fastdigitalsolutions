import type { Industry } from "@/lib/schemas";

/**
 * The four Version 1 focus industries (PRD §9, §14.4).
 * Copy guardrail: "We help teams address…" — never "the leading provider for…".
 * Regulated sectors (financial services, healthcare, government) are deferred
 * until experience and controls can be evidenced (PRD §9.5).
 */
export const industries: Industry[] = [
  {
    slug: "technology-saas",
    name: "Technology and SaaS",
    challenge:
      "Scaling a product and platform without letting reliability, release quality, or engineering pace slip.",
    summary:
      "We help product and platform teams strengthen cloud foundations, automate releases, modernize aging services, and add experienced capacity when the roadmap outruns hiring.",
    commonNeeds: [
      "Product and platform scaling",
      "Cloud foundations",
      "Release automation",
      "Application modernization",
      "Quality engineering",
      "Flexible product and engineering teams",
    ],
    relevantServiceSlugs: [
      "cloud-platform-engineering",
      "software-engineering-modernization",
      "quality-engineering",
      "flexible-delivery-teams",
    ],
  },
  {
    slug: "retail-digital-commerce",
    name: "Retail and Digital Commerce",
    challenge:
      "Keeping customer-facing systems fast, integrated, and dependable — especially when peak traffic arrives.",
    summary:
      "We help commerce teams improve customer-facing applications, connect commerce and operational systems, build reliable data flows, and test readiness before peak periods rather than during them.",
    commonNeeds: [
      "Customer-facing applications",
      "Commerce integrations",
      "Operational automation",
      "Data pipelines",
      "Cloud reliability",
      "Release quality and peak-readiness testing",
    ],
    relevantServiceSlugs: [
      "software-engineering-modernization",
      "cloud-platform-engineering",
      "quality-engineering",
      "ai-data-automation",
    ],
  },
  {
    slug: "professional-services",
    name: "Professional Services and Business Operations",
    challenge:
      "Freeing skilled people from manual, document-heavy processes that spreadsheets and email were never meant to run.",
    summary:
      "We help operations-led organizations automate workflows, build internal platforms, integrate the systems their teams juggle daily, and put reporting on a dependable foundation.",
    commonNeeds: [
      "Workflow automation",
      "Internal platforms",
      "Document and knowledge processes",
      "System integration",
      "Reporting foundations",
      "Application support",
    ],
    relevantServiceSlugs: [
      "ai-data-automation",
      "software-engineering-modernization",
      "application-maintenance-support",
    ],
  },
  {
    slug: "logistics-supply-chain",
    name: "Logistics and Supply Chain",
    challenge:
      "Getting operational systems, partners, and data to move as reliably as the goods they track.",
    summary:
      "We help logistics teams integrate operational systems, build visibility and workflow tools, move data dependably between parties, and automate the repetitive coordination work in between.",
    commonNeeds: [
      "Integration of operational systems",
      "Visibility and workflow tools",
      "Data movement and reporting",
      "Cloud modernization",
      "Quality and performance testing",
      "Automation of repetitive coordination tasks",
    ],
    relevantServiceSlugs: [
      "software-engineering-modernization",
      "ai-data-automation",
      "cloud-platform-engineering",
      "quality-engineering",
    ],
  },
];
