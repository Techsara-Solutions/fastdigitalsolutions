import type { EngagementModel } from "@/lib/schemas";

/**
 * The four engagement models (PRD §10).
 * No rate cards or contractual guarantees are published in Version 1.
 */
export const engagementModels: EngagementModel[] = [
  {
    slug: "fixed-scope-project",
    name: "Fixed-scope project",
    bestFor: "A defined outcome with agreed deliverables, acceptance criteria, and change control.",
    explanation:
      "A defined project with agreed scope, milestones, responsibilities, and acceptance criteria.",
  },
  {
    slug: "time-and-materials",
    name: "Time and materials",
    bestFor: "Evolving requirements, discovery-led work, modernization, and iterative delivery.",
    explanation:
      "Flexible delivery for priorities that are expected to evolve as the team learns and delivers.",
  },
  {
    slug: "dedicated-delivery-team",
    name: "Dedicated delivery team",
    bestFor: "A sustained roadmap or owned workstream that needs a stable, cross-functional team.",
    explanation: "A focused team aligned to your roadmap, tools, governance, and delivery cadence.",
  },
  {
    slug: "staff-augmentation",
    name: "Staff augmentation",
    bestFor: "Adding specific skills or capacity into an existing client team.",
    explanation:
      "Individual specialists who integrate with your team, standards, and working practices.",
  },
];
