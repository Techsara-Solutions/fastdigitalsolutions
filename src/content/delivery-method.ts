/**
 * The five-stage client-first delivery method (PRD §11).
 * Shown as a preview on the home page and in full on /how-we-work/.
 */
export type DeliveryStage = {
  number: number;
  name: string;
  short: string;
  purpose: string[];
  outputsTitle: string;
  outputs: string[];
};

export const deliveryStages: DeliveryStage[] = [
  {
    number: 1,
    name: "Align",
    short: "Understand the business objective, the people involved, and what success means.",
    purpose: [
      "Understand the business objective",
      "Identify users, stakeholders, systems, constraints, and risks",
      "Define what success means",
      "Confirm decision-making and communication paths",
    ],
    outputsTitle: "Typical outputs",
    outputs: [
      "Discovery notes",
      "Current-state summary",
      "Initial risk and dependency register",
      "Outcome statement",
      "Recommended engagement shape",
    ],
  },
  {
    number: 2,
    name: "Architect",
    short: "Convert the problem into a practical plan with clear boundaries and priorities.",
    purpose: [
      "Convert the problem into a practical delivery plan",
      "Define solution boundaries and technical decisions",
      "Prioritize value, risk, and dependencies",
      "Establish quality, security, and operating considerations",
    ],
    outputsTitle: "Typical outputs",
    outputs: [
      "Architecture or solution outline",
      "Prioritized backlog or scope",
      "Milestone plan",
      "Acceptance criteria",
      "Delivery governance",
    ],
  },
  {
    number: 3,
    name: "Deliver",
    short: "Build in visible increments, demonstrate progress often, and raise issues early.",
    purpose: [
      "Build in visible increments",
      "Demonstrate progress frequently",
      "Integrate testing, review, and documentation",
      "Raise issues early rather than hiding them until the end",
    ],
    outputsTitle: "Typical practices",
    outputs: [
      "Short delivery cycles",
      "Working demonstrations",
      "Code review",
      "Automated checks",
      "Shared status and risk updates",
      "Change control appropriate to the engagement model",
    ],
  },
  {
    number: 4,
    name: "Validate",
    short: "Confirm the solution meets agreed expectations and prepare people for release.",
    purpose: [
      "Confirm the solution meets agreed functional, quality, accessibility, performance, and operational expectations",
      "Prepare users and operators for release",
    ],
    outputsTitle: "Typical outputs",
    outputs: [
      "Test evidence",
      "Defect status",
      "Release-readiness review",
      "Documentation",
      "Handover material",
    ],
  },
  {
    number: 5,
    name: "Improve",
    short: "Support adoption, capture learning, and reduce dependency on the delivery team.",
    purpose: [
      "Support adoption, maintenance, optimization, and the next priority",
      "Capture learning and reduce future dependency on the delivery team",
    ],
    outputsTitle: "Typical outputs",
    outputs: [
      "Stabilization and support plan",
      "Improvement backlog",
      "Knowledge transfer",
      "Operating recommendations",
      "Follow-on roadmap where requested",
    ],
  },
];

/** Working-practice commitments (PRD §11.1) — operating principles the company can follow. */
export const workingCommitments = [
  "A named point of contact for each engagement",
  "Agreed communication and reporting cadence",
  "Working demonstrations instead of status-only reporting",
  "Shared decisions and documented assumptions",
  "Early visibility of delivery risk",
  "Quality activities throughout the lifecycle",
  "Knowledge transfer and maintainable documentation",
  "Respect for the client's architecture, security, and governance standards",
];

/** "What happens after enquiry" sequence (PRD §14.6). */
export const afterEnquirySteps = [
  { title: "Enquiry received", detail: "Your message arrives with a reference for follow-up." },
  {
    title: "Initial fit and context review",
    detail: "We read what you shared and consider fit, context, and who should respond.",
  },
  {
    title: "Introductory conversation",
    detail: "A short call to understand the goal, constraints, and what a good outcome looks like.",
  },
  {
    title: "Recommended next step",
    detail: "A clear recommendation — which may be a project, a discovery, or an honest 'not us'.",
  },
  {
    title: "Proposal or discovery plan where appropriate",
    detail: "When there is a fit, a written proposal or discovery plan with scope and responsibilities.",
  },
];
