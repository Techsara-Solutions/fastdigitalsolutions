import type { Service } from "@/lib/schemas";

/**
 * The six Version 1 service groups (PRD §8, §14.2–14.3).
 *
 * Copy rules: client situation first, outcomes before tools, no partnership or
 * certification claims, no guarantees that require discovery, none of the
 * banned cliché phrases (PRD §7.4).
 */
export const services: Service[] = [
  {
    slug: "cloud-platform-engineering",
    cardImageId: "card-service-cloud",
    heroImageId: "hero-service-cloud-platform-engineering",
    name: "Cloud and Platform Engineering",
    stripLabel: "Cloud & Platform",
    clientNeed:
      "Modern, reliable, scalable infrastructure with a practical migration and operating model.",
    outcome: "A cloud foundation your team can run, extend, and afford.",
    summary:
      "Plan, build, and operate cloud infrastructure that fits how your applications and team actually work — from readiness assessment through migration, automation, and ongoing reliability.",
    cardCapabilities: [
      "AWS readiness and current-state assessment",
      "Cloud architecture and migration planning",
      "Infrastructure as code and CI/CD",
      "Observability and reliability improvements",
      "Cloud cost visibility and optimization",
    ],
    hero: {
      headline: "Cloud infrastructure planned around your workloads, not the other way round.",
      copy: "We help teams assess where they are, design a practical target architecture, migrate deliberately, and put the automation and observability in place to operate confidently afterwards.",
    },
    situations: [
      "Your applications run on infrastructure that is expensive, fragile, or hard to change, and you need a realistic path to the cloud.",
      "You are already on AWS but releases are manual, environments drift, and nobody fully trusts the monitoring.",
      "Cloud costs have grown faster than usage and you need visibility before you can optimize.",
      "A growth milestone — new customers, new regions, a launch — will stress infrastructure that has never been load-tested.",
    ],
    capabilityGroups: [
      {
        title: "Assess and plan",
        items: [
          "AWS cloud readiness and current-state assessment",
          "Cloud architecture and landing-zone planning",
          "Migration sequencing built around risk and dependencies",
        ],
      },
      {
        title: "Build and migrate",
        items: [
          "Application and workload migration",
          "Re-platforming and modernization",
          "Infrastructure as code",
          "Container and platform engineering",
        ],
      },
      {
        title: "Automate and operate",
        items: [
          "CI/CD and release automation",
          "Observability, monitoring, and alerting",
          "Reliability and resilience improvements",
          "Cloud cost visibility and optimization",
          "Operational documentation and handover",
        ],
      },
    ],
    deliveryApproach: [
      "Start with a current-state review: workloads, dependencies, operational pain points, and cost drivers — before any target architecture is proposed.",
      "Design a target state your team can operate, with infrastructure defined as code and environments that can be rebuilt rather than repaired.",
      "Migrate in increments that can be verified and rolled back, prioritized by business risk rather than technical convenience.",
      "Leave behind runbooks, dashboards, and documentation so operating the platform does not depend on us.",
    ],
    considerations: [
      "Security groups, IAM boundaries, and encryption defaults are part of the design, not a post-migration review item.",
      "Every migration step has a defined verification check and a rollback path.",
      "Cost implications of architectural choices are made visible before they are committed.",
      "Monitoring and alerting are treated as acceptance criteria for go-live, not follow-up work.",
    ],
    notPromised: [
      "We do not quote migration timelines or cost-savings figures before a current-state assessment.",
      "We do not claim AWS partner status or certifications; capability descriptions reflect delivery experience only.",
    ],
    relatedSlugs: ["software-engineering-modernization", "application-maintenance-support"],
    scenarioSlug: "cloud-foundation-software-platform",
  },
  {
    slug: "ai-data-automation",
    cardImageId: "card-service-ai",
    heroImageId: "hero-service-ai-data-automation",
    name: "AI, Data, and Automation",
    stripLabel: "AI & Automation",
    clientNeed:
      "Apply AI and automation to defined workflows and data, with human oversight and measurable objectives.",
    outcome: "Automation applied where it demonstrably helps — with people kept in control.",
    summary:
      "Identify where AI and automation genuinely reduce effort or error in your workflows, prove it on real cases, and put it into production with evaluation and human oversight built in.",
    cardCapabilities: [
      "AI opportunity and readiness assessment",
      "Workflow and process automation",
      "Generative AI proof of concept and integration",
      "Data ingestion and transformation pipelines",
      "Model and prompt evaluation with human-in-the-loop controls",
    ],
    hero: {
      headline: "AI and automation for specific workflows, not for appearances.",
      copy: "We start from the workflow and the data you already have, test whether AI genuinely improves the result, and only then integrate it — with evaluation, oversight, and monitoring designed in from the beginning.",
    },
    situations: [
      "A document-heavy or repetitive process consumes skilled people's time and produces inconsistent results.",
      "You want to evaluate generative AI on a concrete use case before committing budget to a larger program.",
      "Operational data is scattered across systems, and reporting depends on manual exports and spreadsheets.",
      "An existing model or automated workflow is in production but nobody measures whether it still performs.",
    ],
    capabilityGroups: [
      {
        title: "Find the right opportunity",
        items: [
          "AI opportunity and readiness assessment",
          "Workflow and process analysis",
          "Measurable objectives agreed before build",
        ],
      },
      {
        title: "Build and integrate",
        items: [
          "Workflow and process automation",
          "Generative AI proof of concept and integration",
          "Intelligent document and knowledge workflows",
          "Machine-learning solution development",
          "Data ingestion and transformation pipelines",
          "Reporting and operational analytics foundations",
        ],
      },
      {
        title: "Keep it trustworthy",
        items: [
          "Model and prompt evaluation",
          "Human-in-the-loop controls",
          "Responsible AI and data-governance considerations",
          "Production monitoring and improvement planning",
        ],
      },
    ],
    deliveryApproach: [
      "Define what success looks like in measurable terms before any model is selected or built.",
      "Prove value on a bounded proof of concept with real data and real edge cases, not curated demos.",
      "Design the production integration with evaluation, fallback behavior, and human review points where decisions matter.",
      "Hand over monitoring and an improvement plan so quality is tracked after launch, not assumed.",
    ],
    considerations: [
      "Data handling follows the client's governance and residency requirements; sensitive data is minimized by design.",
      "Automated outputs that affect customers or money keep a human review step until accuracy is demonstrated.",
      "Model behavior is evaluated against agreed test sets before and after release.",
      "Costs of inference and data processing are estimated and monitored, not discovered on the first invoice.",
    ],
    notPromised: [
      "We do not promise autonomous decision-making, guaranteed AI accuracy, or compliance outcomes without an approved solution design and contract.",
      "We do not recommend AI where a simpler automation or process change would do the job better.",
    ],
    relatedSlugs: ["software-engineering-modernization", "cloud-platform-engineering"],
    scenarioSlug: "workflow-automation-document-operations",
  },
  {
    slug: "software-engineering-modernization",
    cardImageId: "card-service-software",
    heroImageId: "hero-service-software-engineering-modernization",
    name: "Software Engineering and Modernization",
    stripLabel: "Software Engineering",
    clientNeed:
      "Build or improve software that supports customer experiences and internal operations.",
    outcome: "Software your users rely on and your team can keep changing.",
    summary:
      "Design, build, and modernize web applications, internal platforms, and integrations — with architecture, testing, and documentation treated as part of delivery rather than extras.",
    cardCapabilities: [
      "Product discovery and technical planning",
      "Custom web application development",
      "API development and system integration",
      "Legacy assessment and incremental modernization",
      "Performance and maintainability improvements",
    ],
    hero: {
      headline: "Software built to be changed, not just shipped.",
      copy: "Whether it is a new customer-facing application, an internal platform, or a legacy system that has become risky to touch, we deliver in visible increments and leave the codebase better documented than we found it.",
    },
    situations: [
      "A business-critical application has outgrown its architecture, and every change now takes longer than the last.",
      "You need a new product or internal tool delivered to a real deadline without mortgaging its future maintainability.",
      "Two or more systems that should talk to each other are connected by manual steps and CSV exports.",
      "A legacy system needs modernizing, but a big-bang rewrite is too risky for the business to accept.",
    ],
    capabilityGroups: [
      {
        title: "Discover and plan",
        items: [
          "Product discovery and technical planning",
          "Legacy application assessment",
          "Architecture options weighed against cost, risk, and team skills",
        ],
      },
      {
        title: "Build",
        items: [
          "Custom web application development",
          "Internal platforms and operational tools",
          "API development and system integration",
          "Frontend and backend engineering",
          "User experience implementation",
        ],
      },
      {
        title: "Modernize and improve",
        items: [
          "Incremental modernization",
          "Architecture refactoring",
          "Performance and maintainability improvements",
          "Technical documentation",
        ],
      },
    ],
    deliveryApproach: [
      "Break the work into increments that each produce something reviewable — a working feature, a migrated module, a measurable improvement.",
      "Keep a prioritized backlog visible to the client, with trade-offs discussed before they are decided.",
      "Integrate code review, automated testing, and documentation into the delivery rhythm rather than scheduling them at the end.",
      "For modernization, run old and new side by side where practical, so cut-over is a decision rather than a gamble.",
    ],
    considerations: [
      "Security review of authentication, authorization, and data handling is part of design, with the client's standards taken as the baseline.",
      "Test coverage targets are agreed per project and enforced in CI, not aspirational.",
      "Dependencies are chosen for maintenance health and licensing, not novelty.",
      "Handover includes documentation and a knowledge-transfer session, so the client team can own the system.",
    ],
    notPromised: [
      "We do not commit to delivery dates or budgets before discovery has defined scope, constraints, and acceptance criteria.",
    ],
    relatedSlugs: ["quality-engineering", "application-maintenance-support"],
  },
  {
    slug: "quality-engineering",
    cardImageId: "card-service-quality",
    heroImageId: "hero-service-quality-engineering",
    name: "Quality Engineering and Test Automation",
    stripLabel: "Quality Engineering",
    clientNeed:
      "Reduce release risk and make quality part of the delivery system rather than a final checkpoint.",
    outcome: "Releases you can trust because quality is checked continuously, not at the end.",
    summary:
      "Build the test strategy, automation, and release-readiness practices that let your team ship faster with fewer surprises — integrated into CI rather than bolted on before launch.",
    cardCapabilities: [
      "Quality strategy and test planning",
      "Test automation and CI-integrated execution",
      "API, integration, and regression testing",
      "Performance and load testing",
      "Accessibility testing",
    ],
    hero: {
      headline: "Make quality something your pipeline checks, not something a release hopes for.",
      copy: "We design test strategies around real release risk, automate the checks that matter most, and wire them into your delivery pipeline so every change gets the same scrutiny.",
    },
    situations: [
      "Releases are slowed by long manual regression cycles, or sped past them and paid for in production incidents.",
      "Test automation exists but is flaky, distrusted, and quietly skipped.",
      "An important launch or peak season is coming and nobody has load-tested the system at realistic volumes.",
      "Accessibility or integration defects keep reaching users because nothing systematically checks for them.",
    ],
    capabilityGroups: [
      {
        title: "Strategy",
        items: [
          "Quality strategy and test planning",
          "Release-readiness assessment",
          "Defect analysis and quality reporting",
        ],
      },
      {
        title: "Automation",
        items: [
          "Test automation",
          "API and integration testing",
          "Functional and regression testing",
          "CI-integrated test execution",
        ],
      },
      {
        title: "Specialised testing",
        items: [
          "Performance and load testing",
          "Accessibility testing",
          "Quality-process improvement",
        ],
      },
    ],
    deliveryApproach: [
      "Map what actually breaks and what a failure costs, then aim automation at the highest-risk paths first.",
      "Build automation that developers trust: fast, deterministic, and run on every change in CI.",
      "Report quality in terms the business understands — release risk and defect trends, not raw test counts.",
      "Transfer ownership: the client team learns to maintain and extend the test system as part of the engagement.",
    ],
    considerations: [
      "Test data is managed deliberately — production data is not copied into test environments without controls.",
      "Performance tests run against production-like environments, and results state their assumptions.",
      "Flaky tests are treated as defects, because ignored red builds train teams to ignore real failures.",
    ],
    notPromised: [
      "We do not certify a release as defect-free; we make release risk visible and reduce it systematically.",
    ],
    relatedSlugs: ["software-engineering-modernization", "application-maintenance-support"],
    scenarioSlug: "quality-engineering-release-cycle",
  },
  {
    slug: "application-maintenance-support",
    cardImageId: "card-service-support",
    heroImageId: "hero-service-application-maintenance-support",
    name: "Application Maintenance and Managed Support",
    stripLabel: "Maintenance & Support",
    clientNeed:
      "Keep business applications reliable, secure, current, and aligned with evolving needs.",
    outcome: "Applications that stay dependable after the project team has moved on.",
    summary:
      "Ongoing care for the applications your business depends on: incident resolution, upgrades, monitoring support, small enhancements, and steady reduction of technical debt.",
    cardCapabilities: [
      "Incident triage and resolution",
      "Version and dependency upgrades",
      "Minor enhancement delivery",
      "Application monitoring support",
      "Technical debt reduction",
    ],
    hero: {
      headline: "Someone accountable for keeping your applications healthy.",
      copy: "We take on the corrective, adaptive, and preventive work that keeps business applications reliable — with a defined intake process, agreed priorities, and documentation that improves over time.",
    },
    situations: [
      "The team that built an important application has moved on, and issues now wait for whoever can spare time.",
      "Dependency and framework versions have fallen far enough behind to become a security and compatibility risk.",
      "Small enhancement requests queue for months because there is no capacity dedicated to them.",
      "You want production monitored and incidents handled through a defined process rather than heroics.",
    ],
    capabilityGroups: [
      {
        title: "Keep it running",
        items: [
          "Corrective and adaptive maintenance",
          "Incident triage and resolution",
          "Application monitoring support",
          "Performance investigation",
        ],
      },
      {
        title: "Keep it current",
        items: [
          "Version and dependency upgrades",
          "Minor enhancement delivery",
          "Technical debt reduction",
        ],
      },
      {
        title: "Keep it understood",
        items: ["Documentation maintenance", "Support transition and knowledge capture"],
      },
    ],
    deliveryApproach: [
      "Begin with a structured transition: system walkthroughs, access, monitoring review, and a risk register of what is most likely to break.",
      "Agree an intake and prioritization process so urgent, important, and routine work each have a clear path.",
      "Report on a regular cadence: incidents, changes shipped, upgrade status, and risks that need a decision.",
      "Reduce technical debt steadily inside the agreed capacity rather than letting it accumulate toward a crisis.",
    ],
    considerations: [
      "Access follows least-privilege: we request only the permissions the agreed scope requires.",
      "Changes to production go through the same review and testing discipline as project work.",
      "Support hours, response expectations, and escalation paths are defined per agreement — and only what is contracted is advertised.",
    ],
    notPromised: [
      "We do not advertise 24/7 support or guaranteed response times; support terms are defined per contract once staffing and escalation are in place.",
    ],
    relatedSlugs: ["quality-engineering", "cloud-platform-engineering"],
  },
  {
    slug: "flexible-delivery-teams",
    cardImageId: "card-service-teams",
    heroImageId: "hero-service-flexible-delivery-teams",
    name: "Flexible Delivery Teams",
    stripLabel: "Flexible Teams",
    clientNeed:
      "Add experienced capacity or ownership for a defined workstream without waiting for permanent hiring.",
    outcome: "Experienced people integrated into your delivery, at the pace hiring cannot match.",
    summary:
      "Add a dedicated cross-functional team, or individual specialists, who work inside your tools, standards, and rituals — with onboarding, governance, and reporting defined up front.",
    cardCapabilities: [
      "Dedicated cross-functional delivery teams",
      "Staff augmentation for specialist roles",
      "Engineering, QA, DevOps, and data roles",
      "Delivery and technical leadership support",
      "Defined onboarding, governance, and reporting",
    ],
    hero: {
      headline: "Delivery capacity that joins your team, not a black box beside it.",
      copy: "Whether you need a dedicated team to own a workstream or individual specialists to strengthen an existing one, we integrate into your tools, standards, and cadence — with clear governance from day one.",
    },
    situations: [
      "A funded roadmap is waiting on hires that will realistically take two or three quarters to land.",
      "An internal team needs specific skills — cloud, QA automation, data engineering — for a defined period.",
      "A workstream needs an owner: a stable team accountable for delivery, not a rotating cast of contractors.",
      "A delivery partner needs dependable specialist capacity behind its own client commitments.",
    ],
    capabilityGroups: [
      {
        title: "Team shapes",
        items: [
          "Dedicated cross-functional delivery teams",
          "Staff augmentation",
          "Delivery and technical leadership support",
        ],
      },
      {
        title: "Roles",
        items: [
          "Specialist engineering roles",
          "QA and test automation roles",
          "DevOps and cloud engineering roles",
          "Data and AI engineering roles",
        ],
      },
      {
        title: "Working structure",
        items: [
          "Integration into client tools and rituals",
          "Defined onboarding, governance, and reporting",
          "Time-zone overlap agreed per engagement",
        ],
      },
    ],
    deliveryApproach: [
      "Define the workstream, decision rights, and reporting lines before anyone starts — ambiguity here is where augmented teams fail.",
      "Onboard against a checklist: access, standards, definition of done, and the client's ways of working.",
      "Work inside the client's tools and rituals by default, so progress is visible where the client already looks.",
      "Review team composition and performance with the client on a regular cadence, and adjust deliberately.",
    ],
    considerations: [
      "Confidentiality and IP terms are established contractually before work begins.",
      "Continuity is managed explicitly: documentation and pairing reduce dependence on any single person.",
      "We respect client relationships: engagement boundaries with partner agencies are contractual and honored.",
    ],
    notPromised: [
      "We do not claim a standing bench, guaranteed onboarding speed, or role inventories; team composition is confirmed per engagement.",
    ],
    relatedSlugs: ["software-engineering-modernization", "quality-engineering"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
