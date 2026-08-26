import type { Scenario } from "@/lib/schemas";

/**
 * Representative engagement scenarios (PRD §2.3, §14.1G, §14.5 State A).
 *
 * HARD RULES: every scenario is explicitly illustrative. No fabricated
 * organization names, logos, testimonials, people, headshots, or metrics.
 * The UI must always render the "Example engagement scenario — not a named
 * client case study" label.
 */
export const SCENARIO_LABEL = "Example engagement scenario — not a named client case study";

export const scenarios: Scenario[] = [
  {
    slug: "cloud-foundation-software-platform",
    title: "Cloud foundation for a growing software platform",
    illustrative: true,
    situation:
      "A growing software company runs its platform on infrastructure that was assembled under deadline pressure. Environments are configured by hand, releases need out-of-hours windows, and the team hesitates to change anything it cannot easily rebuild.",
    approach: [
      "Assess the current architecture, deployment practices, and cost drivers with the internal team.",
      "Design a target AWS architecture the team can operate, with environments defined entirely as code.",
      "Migrate workloads in verified increments, keeping rollback available at every step.",
      "Introduce CI/CD, monitoring, and alerting as part of the migration rather than after it.",
      "Hand over runbooks and documentation, and coach the team on operating the new platform.",
    ],
    typicalOutcomes: [
      "Environments that can be rebuilt from code instead of repaired by memory.",
      "Releases that happen during working hours through an automated pipeline.",
      "Monitoring the team trusts, with alerts tied to what users actually experience.",
      "Cloud spend that is visible and attributable rather than a monthly surprise.",
    ],
    serviceSlugs: ["cloud-platform-engineering", "software-engineering-modernization"],
  },
  {
    slug: "workflow-automation-document-operations",
    title: "Workflow automation for document-heavy operations",
    illustrative: true,
    situation:
      "An operations-led business processes a steady stream of inbound documents — orders, applications, supplier paperwork. Skilled staff spend hours re-keying data between systems, and errors surface downstream where they are expensive to fix.",
    approach: [
      "Map the workflow end to end with the people who run it, and agree where automation would genuinely help.",
      "Prove extraction and routing on a bounded pilot using real documents, including the messy ones.",
      "Build the automated workflow with human review at the decision points that matter.",
      "Integrate results into the existing systems of record rather than adding another silo.",
      "Establish monitoring so accuracy is measured continuously, not assumed.",
    ],
    typicalOutcomes: [
      "Routine documents processed without manual re-keying, with exceptions routed to people.",
      "Fewer downstream corrections because errors are caught at intake.",
      "Staff time shifted from data entry to the judgment work only they can do.",
      "A measured, monitored process that can be extended to adjacent workflows.",
    ],
    serviceSlugs: ["ai-data-automation", "software-engineering-modernization"],
  },
  {
    slug: "quality-engineering-release-cycle",
    title: "Quality engineering for a faster release cycle",
    illustrative: true,
    situation:
      "A product team wants to release more often, but every release depends on a long manual regression pass. Automation exists, yet it is flaky and routinely skipped, so defects reach production and confidence keeps falling.",
    approach: [
      "Analyze recent defects and incidents to find where quality effort would matter most.",
      "Stabilize or retire the flaky tests so a red build means something again.",
      "Automate the highest-risk regression paths first and wire them into CI on every change.",
      "Add API-level and integration coverage where UI tests are the wrong tool.",
      "Define a release-readiness checklist the team can run in minutes rather than days.",
    ],
    typicalOutcomes: [
      "Regression confidence available on every change instead of once per release.",
      "A test suite the team trusts enough to act on.",
      "Shorter, calmer release cycles with fewer production surprises.",
      "Quality reporting the business can read: risk and trends, not raw counts.",
    ],
    serviceSlugs: ["quality-engineering", "software-engineering-modernization"],
  },
];
