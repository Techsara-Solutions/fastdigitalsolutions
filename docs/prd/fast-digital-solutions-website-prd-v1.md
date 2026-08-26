---
title: "Fast Digital Solutions Website — Product Requirements Document"
document_version: "1.0"
status: "Approved for design and development planning; verification items remain pending"
prepared_date: "2026-08-26"
product_owner: "Fast Digital Solutions"
release: "Lean corporate website — Version 1"
---

# Fast Digital Solutions Website — Product Requirements Document

## Document Control

| Field | Decision |
|---|---|
| Public brand | **Fast Digital Solutions** |
| Exact legal entity | **Pending verification.** Do not publish “LLC,” “Inc.,” or another suffix until formation documents confirm it. “Fast Digital Solutions LLC” is a reasonable proposed name only if that is the registered entity and the name is available. |
| Company start year | **2023**, based on owner confirmation. Verify the legal formation date before launch. |
| Public location wording | **Business mailing address:** 1207 Delaware Ave #1166, Wilmington, DE 19806, United States |
| Billing address | Same as mailing address; do not display separately on the public website. |
| Telephone | **+1 302-464-5943** |
| Time zone | **Eastern Time (ET)**. Public business hours remain pending and must only be displayed when operationally accurate. |
| Domain | Placeholder until the owner supplies the purchased domain. |
| Business email | Placeholder until domain-based addresses are created. |
| Logo | Pending. Use a restrained text wordmark during development; replace before production launch. |
| Content editing | Developer-managed repository files only; no CMS in Version 1. |
| Analytics | None at initial launch. No non-essential tracking scripts or marketing pixels. |
| Frontend | Next.js App Router, TypeScript, Tailwind CSS, static export. |
| Hosting | AWS Amplify Hosting connected to a Git repository. |
| Contact email backend | Separate implementation by another developer. Frontend integrates through a configurable API endpoint. |
| Launch objective | A polished, modern, client-first corporate site suitable for a credible mid-market digital engineering company. |

## 1. Executive Summary

Fast Digital Solutions requires a modern corporate website that presents the company as a practical, client-focused digital engineering partner. The site must feel established and professional without pretending to have the scale, office network, client portfolio, certifications, or history of a multinational consultancy.

The website will focus on six connected capability areas:

1. Cloud and platform engineering
2. AI, data, and automation
3. Software engineering and modernization
4. Quality engineering and test automation
5. Application maintenance and managed support
6. Flexible delivery teams and staff augmentation

The primary commercial audience is US-based and international mid-market organizations, growing technology companies, and scale-ups that need experienced delivery capacity without the overhead of a very large consulting firm.

The experience will be built around a **client-first operating promise**: understand the business context, define a practical plan, deliver in visible increments, communicate risks early, document decisions, and leave the client with maintainable systems and knowledge.

The visual direction is **Warm Precision**: a modern enterprise layout using warm off-white, taupe, espresso, and restrained clay-brown accents. It must not resemble a generic AI-generated website. The design will avoid neon gradients, glassmorphism, fake 3D art, invented dashboards, excessive glow, random floating cards, and generic AI imagery.

Version 1 will be static-first for speed, security, search visibility, and simple AWS deployment. The contact form will post to an external backend endpoint configured through an environment variable. The email workflow is explicitly outside the frontend implementation.

## 2. Non-Negotiable Credibility and Claim Policy

### 2.1 Truthful public representation

The website must only publish claims that Fast Digital Solutions can support with internal records, contracts, written client permission, team records, or other reliable evidence.

The following must not be invented or implied:

- Client names or client logos
- Customer testimonials
- Case-study outcomes or performance metrics
- Employee count
- Office locations or staffed premises
- AWS Partner status or other partner status
- Certifications
- Awards
- Named leadership
- Years of experience beyond the confirmed 2023 start year
- 24/7 support, guaranteed response times, or service-level commitments not supported by an operating process and contract

The FTC prohibits fake or false reviews and testimonials, including testimonials attributed to people who do not exist or did not have the represented experience.[^ftc]

### 2.2 Required treatment of proof elements

The design system may include reusable components for client logos, testimonials, case studies, leadership cards, certifications, and project metrics, but these components must be disabled until approved content exists.

Each proof record in the content repository must support:

```ts
{
  publishStatus: "draft" | "approved" | "archived";
  verified: boolean;
  approvalReference?: string;
  approvedBy?: string;
  approvedAt?: string;
}
```

A build-time validation rule must prevent production publication when `verified !== true` or `publishStatus !== "approved"`.

### 2.3 Safe alternatives before real proof is available

Until real client approval exists, the public site may use:

- **Representative capability scenarios**, clearly labelled as examples
- **Typical engagement outcomes**, without invented numbers
- **Anonymized case studies**, only when based on real work and contractually permitted
- **Delivery-process evidence**, such as sample governance, QA, documentation, or architecture practices
- **Technology capability descriptions**, without claiming partnership or certification

An illustrative scenario must use language such as:

> **Example engagement scenario — not a named client case study**

It must never include a fabricated organization name, logo, testimonial, person, headshot, or result.

### 2.4 Company identity

The site will use **Fast Digital Solutions** as the public brand. The footer must not append “LLC” or another legal suffix until the owner provides formation documentation.

The start-year statement may be presented as:

> **Serving clients since 2023**

Before launch, the owner must verify that this wording accurately reflects the company’s operational history.

### 2.5 Address representation

The Delaware address must be labelled:

> **Business mailing address**  
> 1207 Delaware Ave #1166  
> Wilmington, DE 19806  
> United States

The website must not call this a walk-in office, headquarters, studio, local branch, or customer meeting location unless the company genuinely occupies and staffs it for those purposes.

Do not use office-building photography, visitor directions, local office hours, or a `LocalBusiness` schema solely to create the impression of a staffed Delaware office.

## 3. Research Summary and Product Rationale

Current digital consulting and engineering firms commonly organize their websites around services, industries, client stories, delivery methods, thought leadership, and a clear contact path. Thoughtworks and Slalom give customer work prominent, filterable treatment, while EPAM connects service and industry expertise to detailed project evidence.[^thoughtworks][^slalom][^epam]

The implication for Fast Digital Solutions is not to imitate their apparent scale. It is to borrow the clarity of their information architecture while using a more focused, mid-market position:

- Fewer but better-defined service groups
- A visible, understandable delivery method
- Client concerns and business outcomes before technology lists
- Proof only when verifiable
- A direct route to project discussion
- Calm, precise language rather than exaggerated enterprise claims

The site should feel confident because it is specific and disciplined, not because it is crowded with unsupported trust signals.

## 4. Product Vision

### 4.1 Vision statement

Create a credible digital front door for Fast Digital Solutions that helps prospective clients quickly understand what the company can deliver, how it works with clients, and how to start a qualified project conversation.

### 4.2 Customer promise

> **Technology delivery built around your business.**

Fast Digital Solutions will be presented as a partner that combines cloud, AI, software engineering, quality, and flexible delivery capacity around the client’s priorities rather than forcing a pre-packaged solution.

### 4.3 Experience principles

1. **Client context first** — Begin with the client’s business problem, constraints, users, and operating environment.
2. **Outcomes before tools** — Explain why a capability matters before listing technologies.
3. **Evidence over adjectives** — Prefer approved proof, process detail, and specific examples over “leading,” “world-class,” or “best-in-class.”
4. **Visible delivery** — Show how work is planned, reviewed, tested, documented, and handed over.
5. **Modern but restrained** — Use a contemporary design system without visual gimmicks.
6. **Accessible by default** — Accessibility is a design and engineering requirement, not a final audit item.
7. **Fast and maintainable** — Keep the frontend static-first and repository-managed.
8. **No vendor lock-in messaging** — Emphasize maintainable code, documentation, and knowledge transfer; contractual IP terms remain subject to each agreement.

## 5. Goals, Non-Goals, and Success Criteria

### 5.1 Version 1 goals

- Establish a professional and consistent public presence.
- Explain the company’s services in under one minute of browsing.
- Position Fast Digital Solutions for mid-market and growth-company engagements.
- Make the client-first delivery model a visible differentiator.
- Generate qualified project enquiries through a clear, accessible form.
- Support future case studies, insights, careers, and leadership content without rebuilding the site architecture.
- Provide a clean repository and AWS deployment handoff for another developer.
- Meet defined accessibility, performance, security, and SEO standards.

### 5.2 Non-goals

Version 1 will not include:

- Customer accounts or a client portal
- E-commerce or online payments
- A CMS or visual page builder
- Live chat
- A job applicant tracking system
- Public employee directory before approved profiles exist
- Automated project estimates
- File uploads in the contact form
- A public partner/certification wall without verification
- Marketing analytics, advertising pixels, or behavior tracking
- Multilingual content
- Server-side rendering as a requirement
- A fake portfolio, client list, testimonial set, or company scale narrative

### 5.3 Success criteria

Because Version 1 will not include analytics, initial success will be measured through quality and operational readiness rather than visitor-tracking metrics.

The release is successful when:

- A first-time visitor can identify the company category, primary services, target customer, and main call to action from the home page.
- Every public claim has an owner-approved source.
- The contact form submits to a configurable endpoint and handles success, validation, throttling, and failure states.
- The site is fully usable by keyboard and meets WCAG 2.2 Level AA requirements.[^wcag]
- Lighthouse lab targets are at least 90 for Performance, Accessibility, Best Practices, and SEO on representative production pages.
- Core Web Vitals targets are LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1 at the 75th percentile when field data becomes available.[^vitals]
- No page has broken internal links, missing metadata, accidental draft content, or horizontal overflow.
- The repository can be installed, run, tested, built, and statically exported using documented commands.
- Production, staging, and pull-request preview workflows are documented for AWS Amplify.

## 6. Target Market and Audiences

### 6.1 Market position

Fast Digital Solutions will be positioned as a **mid-market digital engineering and technology delivery partner**, not a giant global systems integrator and not a low-cost generic web agency.

The site should communicate that the company can support meaningful cloud, software, AI, quality, and delivery initiatives while remaining responsive and close to the client.

### 6.2 Geographic focus

Primary commercial focus:

- United States
- Canada
- United Kingdom
- Selected European and international clients that can work through a distributed delivery model

The website may say **“supporting clients across regions”** or **“built for distributed collaboration.”** It must not claim active clients in a country or region without evidence.

### 6.3 Primary customer profile

- Mid-market organizations with approximately 50–2,000 employees
- Venture-backed or independently funded scale-ups
- Technology-enabled businesses modernizing internal or customer-facing systems
- Organizations with a lean internal technology team that needs delivery acceleration
- Companies replacing manual operations with cloud software or automation

The employee range is an audience definition, not a claim about current customers.

### 6.4 Buyer personas

#### Persona A — Technology executive

Typical roles: CTO, CIO, VP Engineering, Head of Platform, Head of Digital.

Needs:

- Cloud modernization or application delivery capacity
- Predictable engineering quality
- Architecture that can be maintained after handoff
- Clear risk, cost, and dependency communication
- A partner that can work with an internal team

Concerns:

- Overpromising
- Weak senior oversight
- Security and quality gaps
- Vendor lock-in
- Unclear ownership or communication

Primary CTA: **Discuss your project**

#### Persona B — Product or operations leader

Typical roles: VP Product, Head of Operations, Transformation Lead, COO.

Needs:

- Automation of high-friction workflows
- Faster release of customer or internal products
- Better visibility into delivery status
- Practical AI use cases tied to business value

Concerns:

- Technology that does not fit real workflows
- Long discovery without tangible progress
- Poor user adoption
- Unclear cost and scope

Primary CTA: **Talk through the challenge**

#### Persona C — Founder or scale-up leader

Typical roles: Founder, CEO, technical co-founder, product lead.

Needs:

- Flexible engineering capacity
- Cloud foundations that can scale
- Fast validation without reckless shortcuts
- A team that can own a defined workstream

Concerns:

- Hiring delays
- Delivery velocity
- Product quality
- Cost control

Primary CTA: **Plan the next delivery stage**

#### Persona D — Delivery or sourcing partner

Typical roles: Agency principal, consulting partner, program director, procurement manager.

Needs:

- A dependable specialist or extended delivery team
- Transparent staffing and governance
- Time-zone overlap and communication
- Clear confidentiality and contractual boundaries

Concerns:

- Client poaching
- Resource continuity
- Quality variance
- Confidentiality

Primary CTA: **Discuss a delivery partnership**

## 7. Positioning and Messaging

### 7.1 Category statement

Fast Digital Solutions is a digital engineering company that helps organizations modernize applications, build cloud platforms, apply AI and automation, improve software quality, and extend delivery capacity.

### 7.2 Recommended homepage hero

**Headline**

> Technology delivery built around your business.

**Supporting copy**

> Fast Digital Solutions helps growing organizations modernize applications, move to the cloud, automate operations, and strengthen engineering delivery—from discovery through ongoing support.

**Primary CTA**

> Discuss your project

**Secondary CTA**

> Explore our capabilities

### 7.3 Core value pillars

#### Client-aligned delivery

Plans, priorities, and delivery rhythms are shaped around the client’s operating reality.

#### Practical cloud and AI

Cloud and AI are applied to specific reliability, cost, workflow, and customer-experience needs—not added for appearance.

#### Engineering quality throughout

Architecture, test automation, observability, security considerations, and documentation are built into delivery.

#### Flexible ways to engage

Clients can use a fixed-scope project, time-and-materials engagement, dedicated delivery team, or staff augmentation model.

#### Clear ownership and communication

The site will emphasize visible progress, documented decisions, early risk communication, and knowledge transfer.

### 7.4 Tone of voice

The brand voice must be:

- Calm
- Direct
- Specific
- Respectful
- Technically credible
- Commercially understandable
- Client-centered
- Confident without exaggeration

Use short paragraphs, active voice, concrete nouns, and outcome-based headings.

Avoid habitual AI and consultancy clichés, including:

- “Unlock limitless potential”
- “Revolutionize your business”
- “Cutting-edge solutions”
- “Seamless transformation”
- “Future-proof everything”
- “Harness the power of”
- “Game-changing innovation”
- “One-stop solution”
- “World-class”
- “Best-in-class”

These phrases may only appear when supported by a specific and meaningful explanation; in most cases they should be replaced.

## 8. Service Architecture

Version 1 will present six primary service groups. This is broad enough to support commercial opportunities while remaining more believable than a list of twenty unrelated services.

### 8.1 Cloud and Platform Engineering

**Client need:** Modern, reliable, scalable infrastructure with a practical migration and operating model.

Capabilities:

- AWS cloud readiness and current-state assessment
- Cloud architecture and landing-zone planning
- Application and workload migration
- Re-platforming and modernization
- Infrastructure as code
- CI/CD and release automation
- Container and platform engineering
- Observability, monitoring, and alerting
- Reliability and resilience improvements
- Cloud cost visibility and optimization
- Operational documentation and handover

Public wording must not imply AWS partnership status or certification unless verified.

### 8.2 AI, Data, and Automation

**Client need:** Apply AI and automation to defined workflows and data, with human oversight and measurable objectives.

Capabilities:

- AI opportunity and readiness assessment
- Workflow and process automation
- Generative AI proof of concept and integration
- Intelligent document and knowledge workflows
- Machine-learning solution development
- Data ingestion and transformation pipelines
- Reporting and operational analytics foundations
- Model and prompt evaluation
- Human-in-the-loop controls
- Responsible AI and data-governance considerations
- Production monitoring and improvement planning

The site must not promise autonomous decision-making, guaranteed AI accuracy, or compliance outcomes without an approved solution design and contract.

### 8.3 Software Engineering and Modernization

**Client need:** Build or improve software that supports customer experiences and internal operations.

Capabilities:

- Product discovery and technical planning
- Custom web application development
- Internal platforms and operational tools
- API development and system integration
- Legacy application assessment
- Incremental modernization
- Architecture refactoring
- Frontend and backend engineering
- User experience implementation
- Performance and maintainability improvements
- Technical documentation

### 8.4 Quality Engineering and Test Automation

**Client need:** Reduce release risk and make quality part of the delivery system rather than a final checkpoint.

Capabilities:

- Quality strategy and test planning
- Functional and regression testing
- Test automation
- API and integration testing
- Performance and load testing
- Accessibility testing
- Release-readiness assessment
- CI-integrated test execution
- Defect analysis and quality reporting
- Quality-process improvement

### 8.5 Application Maintenance and Managed Support

**Client need:** Keep business applications reliable, secure, current, and aligned with evolving needs.

Capabilities:

- Corrective and adaptive maintenance
- Version and dependency upgrades
- Incident triage and resolution
- Minor enhancement delivery
- Application monitoring support
- Performance investigation
- Technical debt reduction
- Documentation maintenance
- Support transition and knowledge capture

Do not advertise 24/7 support or a guaranteed SLA until staffing, escalation, monitoring, and contract terms are established.

### 8.6 Flexible Delivery Teams

**Client need:** Add experienced capacity or ownership for a defined workstream without waiting for permanent hiring.

Capabilities:

- Dedicated cross-functional delivery teams
- Staff augmentation
- Specialist engineering roles
- QA and test automation roles
- DevOps and cloud engineering roles
- Data and AI engineering roles
- Delivery and technical leadership support
- Integration into client tools and rituals
- Defined onboarding, governance, and reporting

Public copy must not claim a bench size, onboarding speed, named role inventory, or geographic coverage that cannot be fulfilled.

## 9. Priority Industries

Version 1 will focus on four broad industries where the selected services naturally apply. Industry copy must describe common needs and delivery patterns, not pretend to have deep regulated-industry credentials without proof.

### 9.1 Technology and SaaS

Relevant needs:

- Product and platform scaling
- Cloud foundations
- Release automation
- Application modernization
- Quality engineering
- Flexible product and engineering teams

### 9.2 Retail and Digital Commerce

Relevant needs:

- Customer-facing applications
- Commerce integrations
- Operational automation
- Data pipelines
- Cloud reliability
- Release quality and peak-readiness testing

### 9.3 Professional Services and Business Operations

Relevant needs:

- Workflow automation
- Internal platforms
- Document and knowledge processes
- System integration
- Reporting foundations
- Application support

### 9.4 Logistics and Supply Chain

Relevant needs:

- Integration of operational systems
- Visibility and workflow tools
- Data movement and reporting
- Cloud modernization
- Quality and performance testing
- Automation of repetitive coordination tasks

### 9.5 Deferred industry claims

Financial services, healthcare, government, defense, and other highly regulated sectors should not be featured as specialist industries until the company can demonstrate appropriate experience, controls, contractual capability, and approved evidence.

## 10. Engagement Models

### 10.1 Fixed-scope project

Best for a defined outcome, deliverable, acceptance criteria, and agreed change-control process.

Website explanation:

> A defined project with agreed scope, milestones, responsibilities, and acceptance criteria.

### 10.2 Time and materials

Best for evolving requirements, discovery-led work, modernization, and iterative delivery.

Website explanation:

> Flexible delivery for priorities that are expected to evolve as the team learns and delivers.

### 10.3 Dedicated delivery team

Best for a sustained roadmap or owned workstream requiring a stable, cross-functional team.

Website explanation:

> A focused team aligned to your roadmap, tools, governance, and delivery cadence.

### 10.4 Staff augmentation

Best for adding specific skills or capacity into an existing client team.

Website explanation:

> Individual specialists who integrate with your team, standards, and working practices.

The site must not publish rate cards or contractual guarantees in Version 1.

## 11. Client-First Delivery Method

The delivery method is a central trust element and must appear on the home page and the dedicated **How We Work** page.

### Stage 1 — Align

Purpose:

- Understand the business objective
- Identify users, stakeholders, systems, constraints, and risks
- Define what success means
- Confirm decision-making and communication paths

Typical outputs:

- Discovery notes
- Current-state summary
- Initial risk and dependency register
- Outcome statement
- Recommended engagement shape

### Stage 2 — Architect

Purpose:

- Convert the problem into a practical delivery plan
- Define solution boundaries and technical decisions
- Prioritize value, risk, and dependencies
- Establish quality, security, and operating considerations

Typical outputs:

- Architecture or solution outline
- Prioritized backlog or scope
- Milestone plan
- Acceptance criteria
- Delivery governance

### Stage 3 — Deliver

Purpose:

- Build in visible increments
- Demonstrate progress frequently
- Integrate testing, review, and documentation
- Raise issues early rather than hiding them until the end

Typical practices:

- Short delivery cycles
- Working demonstrations
- Code review
- Automated checks
- Shared status and risk updates
- Change control appropriate to the engagement model

### Stage 4 — Validate

Purpose:

- Confirm that the solution meets agreed functional, quality, accessibility, performance, and operational expectations
- Prepare users and operators for release

Typical outputs:

- Test evidence
- Defect status
- Release-readiness review
- Documentation
- Handover material

### Stage 5 — Improve

Purpose:

- Support adoption, maintenance, optimization, and the next priority
- Capture learning and reduce future dependency on the delivery team

Typical outputs:

- Stabilization and support plan
- Improvement backlog
- Knowledge transfer
- Operating recommendations
- Follow-on roadmap where requested

### 11.1 Working-practice commitments

The website may describe these commitments as operating principles, provided the company can follow them:

- A named point of contact for each engagement
- Agreed communication and reporting cadence
- Working demonstrations instead of status-only reporting
- Shared decisions and documented assumptions
- Early visibility of delivery risk
- Quality activities throughout the lifecycle
- Knowledge transfer and maintainable documentation
- Respect for the client’s architecture, security, and governance standards

## 12. Information Architecture and Sitemap

### 12.1 Primary navigation

1. Services
2. Industries
3. Work
4. How We Work
5. Insights
6. About
7. Contact

**Careers** will be accessible from the footer and About page rather than occupying primary navigation at launch.

### 12.2 Route map

```text
/
├── /services/
│   ├── /services/cloud-platform-engineering/
│   ├── /services/ai-data-automation/
│   ├── /services/software-engineering-modernization/
│   ├── /services/quality-engineering/
│   ├── /services/application-maintenance-support/
│   └── /services/flexible-delivery-teams/
├── /industries/
├── /work/
│   └── /work/[approved-case-study-slug]/        # Generated only for verified work
├── /how-we-work/
├── /insights/
│   └── /insights/[approved-article-slug]/
├── /about/
├── /careers/
├── /contact/
├── /privacy/
├── /terms/
├── /accessibility/
├── /404.html
├── /robots.txt
└── /sitemap.xml
```

### 12.3 Priority and launch gates

| Route | Priority | Launch condition |
|---|---:|---|
| Home | P0 | Approved core copy and identity data |
| Services index | P0 | All six service groups reviewed |
| Six service detail pages | P0 | Capability language approved; no unsupported certifications |
| Industries | P0 | Four industry sections approved |
| Work | P0 | May launch with clearly labelled representative scenarios; named case studies require proof |
| How We Work | P0 | Delivery process confirmed operationally |
| About | P0 | Start year and company description approved |
| Contact | P0 | API endpoint or clearly defined temporary fallback |
| Privacy | P0 | Legal review before launch |
| Terms | P0 | Legal review before launch |
| Accessibility | P0 | Accurate commitment and contact route |
| Insights | P0 | At least three substantive approved articles; otherwise remove from primary navigation until ready |
| Careers | P0 | Accurate no-open-role state or real approved roles |
| Named case-study detail | P1 | Client permission and proof record |
| Leadership profiles | P1 | Approved names, bios, headshots, and profile links |

## 13. Global Experience Requirements

### 13.1 Header

Desktop requirements:

- Text wordmark or final logo at left
- Primary navigation centered or right-aligned
- Primary CTA: **Discuss your project**
- Optional phone link in a slim utility area only if visual balance remains clean
- Sticky behavior after the user begins scrolling
- Warm paper background with a subtle bottom border when sticky
- No oversized mega-menu in Version 1

Mobile requirements:

- Logo/wordmark
- Clearly labelled menu button
- Full-height or near-full-height navigation panel
- Contact CTA and phone link inside the menu
- Keyboard focus trap while open
- Escape key closes the menu
- Body scrolling disabled while open

### 13.2 Footer

Footer content:

- Brand statement
- Service links
- Company links
- Legal links
- Telephone link: `tel:+13024645943`
- Placeholder domain-based email
- Business mailing address label and full address
- “Serving clients since 2023,” subject to final verification
- Copyright year generated at build time or updated through content configuration

Do not display social icons without real, maintained company profiles.

### 13.3 Calls to action

Primary CTA text:

- Discuss your project

Approved contextual variations:

- Talk through the challenge
- Explore our capabilities
- See how we work
- Plan the next delivery stage
- View representative work
- Read the insight

Avoid generic CTA labels such as “Click here,” “Learn more” without context, and “Get started” where the destination is unclear.

### 13.4 Breadcrumbs

Breadcrumbs are required on:

- Service detail pages
- Insight detail pages
- Approved case-study detail pages

They are not required on the home page or simple top-level pages.

## 14. Page-Level Requirements

## 14.1 Home Page

### Purpose

Communicate what Fast Digital Solutions does, who it serves, why its delivery model is credible, and how to begin a project conversation.

### Required sections

#### A. Hero

- Strong text-led composition
- Headline, supporting copy, primary CTA, secondary CTA
- No rotating headline or carousel
- Visual treatment should use a bespoke line/grid composition, architecture-inspired geometry, or approved real project imagery
- Avoid stock server-room imagery and AI-generated people

#### B. Capability strip

Use text-based proof rather than fake logos:

> Cloud & Platform · AI & Automation · Software Engineering · Quality Engineering · Flexible Teams

This strip must not be labelled “Trusted by” or “Our clients.”

#### C. Client-first value section

Recommended heading:

> Your priorities stay at the center.

Recommended copy direction:

> We work in clear stages, share progress early, document decisions, and shape the delivery model around your team, systems, and business goals.

Include three or four concise operating commitments.

#### D. Services overview

- Six service cards
- Each card includes client need, capability summary, and contextual link
- Do not place long technology-logo lists on the home page
- Cards should vary subtly in composition to avoid a templated AI-generated grid

#### E. How We Work preview

- Five-stage process shown as a horizontal sequence on desktop and vertical sequence on mobile
- Each stage includes one sentence
- Link to the dedicated page

#### F. Industries

- Four industry tiles
- Each tile emphasizes a challenge, not a claim of market dominance
- No industry-specific client logos without permission

#### G. Work or capability examples

Before named case studies exist, use up to three representative scenarios with explicit labels:

1. Cloud foundation for a growing software platform
2. Workflow automation for document-heavy operations
3. Quality engineering for a faster release cycle

Each card must say **“Example engagement scenario”** and avoid invented metrics.

#### H. Engagement models

Briefly explain the four approved models.

#### I. Insights preview

- Show three approved articles
- Include topic, title, description, author, and date only when real
- If three articles are not ready, remove this section and the Insights primary-nav link

#### J. Final contact CTA

Recommended heading:

> Tell us what needs to move forward.

Recommended copy:

> Share your goals, current constraints, and desired timeline. A member of our team will respond within two business days.

Include contact button, phone number, and ET reference.

### Home-page acceptance criteria

- Primary value proposition visible without scrolling on common laptop and mobile viewports
- Primary CTA visible in the hero
- No unsupported proof claims
- No automatic motion
- Hero remains readable at 200% zoom
- Home page can be understood without imagery

## 14.2 Services Index

### Purpose

Help a prospective client identify the capability area that matches the problem they need to solve.

### Required sections

- Introductory positioning
- Six service groups
- Cross-service delivery principles
- Engagement-model summary
- CTA to contact

Each service card must include:

- Service name
- Client problem
- Short outcome statement
- Four to six selected capabilities
- Detail-page link

## 14.3 Service Detail Template

Each service page must contain:

1. Service-specific hero
2. “Where this helps” client situations
3. Capability list grouped into logical themes
4. Delivery approach
5. Quality, security, and operational considerations
6. Related services
7. Representative scenario or approved case study
8. Contact CTA

### Service-page content rule

A service page must not read like an exhaustive keyword list. It should explain:

- The client situation
- What Fast Digital Solutions would do
- How the work is delivered
- What a client should expect to receive
- What is deliberately not promised without discovery

## 14.4 Industries Page

### Purpose

Show that the company understands common operating contexts while avoiding unsupported claims of deep specialization.

### Required sections

- Industry approach introduction
- Four selected industries
- Common challenges for each
- Relevant capabilities for each
- Cross-industry delivery principles
- CTA

### Copy guardrail

Use:

> “We help technology teams address…”

Avoid:

> “We are the leading provider for…”

## 14.5 Work Page

### Purpose

Provide transparent evidence of how capabilities can be applied.

### Version 1 states

#### State A — No verified named work

Display representative engagement scenarios. Every scenario must be visibly labelled as illustrative and must not contain a fabricated company name, logo, quote, or metric.

Recommended page title:

> Capabilities in practice

Recommended explanation:

> These representative scenarios show how our services can be combined around common client needs. Named client work will be published only with permission.

#### State B — Anonymized verified work

Use a descriptor such as:

> North American B2B software company

Only when that description is factually accurate and contractually permitted. Include actual, approved outcomes; do not infer missing numbers.

#### State C — Named approved case studies

Each published case study requires:

- Written permission to use the client name and logo
- Approved project description
- Approved result statements and metrics
- Approved quote and attribution if a testimonial is used
- Confirmation that screenshots and diagrams are safe to publish
- Internal approval reference stored in the content record

### Approved case-study template

1. Client context
2. Challenge
3. Constraints
4. Approach
5. Solution
6. Quality and delivery practices
7. Outcome
8. Technology used, where relevant
9. Approved testimonial, optional
10. Related capabilities
11. Contact CTA

## 14.6 How We Work Page

### Purpose

Make the client-first operating model tangible and lower perceived delivery risk.

### Required sections

- Delivery philosophy
- Five-stage method
- Communication and governance
- Quality practices
- Documentation and knowledge transfer
- Engagement models
- What happens after enquiry
- CTA

### “What happens after enquiry” sequence

1. Enquiry received
2. Initial fit and context review
3. Introductory conversation
4. Recommended next step
5. Proposal or discovery plan where appropriate

Do not promise a proposal, estimate, or meeting within a fixed time unless the process is staffed to meet it.

## 14.7 About Page

### Purpose

Explain why the company exists and how it intends to work, without manufacturing history or scale.

### Required sections

- Company introduction
- “Serving clients since 2023,” after verification
- Mission
- Client-first principles
- Delivery model
- Leadership section placeholder
- Mailing address and contact details
- Careers link

### Recommended company description

> Fast Digital Solutions is a digital engineering company focused on practical cloud, AI, software, quality, and delivery solutions. We work with growing organizations that need experienced technology capacity, clear communication, and a delivery approach shaped around their business.

### Leadership state

Until leadership information is provided:

- Do not show anonymous silhouettes
- Do not invent names, job titles, bios, or LinkedIn profiles
- Either omit the section or display a development-only placeholder that cannot be included in production

## 14.8 Insights Index and Article Template

### Purpose

Demonstrate thinking quality, improve search discoverability, and give prospective clients useful material before a sales conversation.

### Launch requirement

Publish at least three substantive articles before placing Insights in the primary navigation.

Recommended initial topics:

1. **A practical readiness checklist for an AWS migration**
2. **Where AI automation creates value—and where it does not**
3. **Building quality engineering into delivery instead of adding it at the end**

These are proposed topics, not claims that articles already exist.

### Article requirements

- Real author name and role
- Accurate publication and update dates
- Reading time generated from content
- Table of contents for long articles
- Descriptive heading structure
- Sources for factual or statistical claims
- No AI-generated author portraits
- Clear distinction between advice, opinion, and company capability
- Related service and contact CTA

### Content quality floor

An article should normally be at least 900 words when the subject requires depth. Thin keyword pages must not be published merely to increase route count.

## 14.9 Careers Page

### Purpose

Provide an honest destination for future hiring and communicate working principles.

### Required states

#### No open roles

Recommended copy:

> We do not have a public opening at this time. Future opportunities will be posted here.

An optional general-interest email may be added only when an inbox and data-retention process are ready.

#### Open roles

Each role must include:

- Role title
- Employment or contract type
- Location and remote expectations
- Time-zone overlap expectations
- Responsibilities
- Required and preferred skills
- Hiring process
- Equal-opportunity statement reviewed for accuracy
- Application destination

Do not display fake openings merely to make the company appear larger.

## 14.10 Contact Page

### Purpose

Make it easy for a qualified prospect to explain the need and understand what happens next.

### Required content

- Short, reassuring introduction
- Contact form
- Telephone number
- ET reference
- Domain-based email placeholder
- Business mailing address label
- Response expectation: **within two business days**
- Privacy notice link
- Alternative contact path for accessibility or form failure

### Recommended heading

> Let’s understand what you need to move forward.

### Recommended supporting copy

> Share the business goal, current challenge, or delivery gap. We will review the details and respond within two business days with an appropriate next step.

## 14.11 Legal and Utility Pages

### Privacy Policy

Must explain:

- What contact-form data is collected
- Why it is collected
- Who receives or processes it
- Retention approach
- Contact route for privacy questions
- Any hosting and email-service implications
- Cookie and tracking position

The final policy requires legal review and must reflect the actual backend implementation.

### Terms of Use

Must cover basic website use, intellectual property, third-party links, disclaimers, and governing terms as reviewed by counsel.

### Accessibility Statement

Must include:

- Accessibility commitment
- Target standard: WCAG 2.2 Level AA
- Known limitations, if any
- Contact route for accessibility feedback
- Date of last review

### 404 Page

- Clear message
- Home link
- Services link
- Contact link
- No humorous copy that weakens the professional tone

## 15. Visual Design Direction

## 15.1 Design concept: Warm Precision

The visual system must combine:

- The clarity and control expected from an engineering company
- The warmth and approachability expected from a client-facing partner
- The confidence of an established business without pretending to be a huge enterprise
- A distinctive off-brown palette used carefully rather than covering every surface with brown

The overall result should feel designed by an experienced human team: deliberate typography, controlled rhythm, real hierarchy, considered empty space, and a small number of recognizable visual motifs.

## 15.2 Anti-“AI-generated website” guardrails

The final design must not use:

- Purple-to-blue or rainbow gradient meshes
- Neon cyan glows
- Glassmorphism as a primary component style
- Floating translucent cards with no information purpose
- Generic 3D spheres, metallic blobs, or isometric robots
- AI-generated people presented as employees or clients
- Fake product dashboards or fabricated code windows
- Random particle backgrounds
- Scroll-jacking
- Excessive parallax
- Animated statistics without real data
- A bento grid in every section
- Identical rounded cards repeated down the whole page
- Overly large empty hero text that pushes all meaning below the fold
- Stock handshakes, stock call-center teams, or server racks as default imagery
- Unnecessary “sparkle” icons to represent AI
- Motion on every hover target

The site may use one restrained asymmetric grid, subtle geometric linework, and minimal motion when these support hierarchy or explanation.

## 15.3 Color system

### Core palette

| Token | Hex | Use |
|---|---:|---|
| `paper` | `#F8F5EF` | Primary light background |
| `canvas` | `#F2ECE3` | Alternate warm section background |
| `stone` | `#E3D8CC` | Borders, dividers, quiet surfaces |
| `ink` | `#211D19` | Main text, dark buttons, high-contrast elements |
| `espresso` | `#2C241F` | Dark sections and footer |
| `muted` | `#665B52` | Secondary text on light backgrounds |
| `clay` | `#9A5F3F` | Controlled accent, icon details, selected UI states |
| `clay-dark` | `#7A4229` | Primary CTA background and accessible accent links |
| `olive` | `#6B6A4E` | Very limited secondary accent for diagrams or tags |
| `white` | `#FFFFFF` | Form controls and high-contrast text where needed |

### Usage ratio

- Approximately 70% paper/canvas/white space
- Approximately 20% ink/espresso typography and dark sections
- Approximately 10% clay, stone, and olive accent use

### Verified contrast examples

- `ink` on `paper`: approximately **15.38:1**
- `muted` on `paper`: approximately **6.06:1**
- white on `clay`: approximately **5.14:1**
- white on `clay-dark`: approximately **7.96:1**

These combinations pass WCAG AA for normal text. Final component states still require automated and manual contrast testing.

### Color rules

- Do not use `stone`, `clay`, or `olive` alone for small body text unless the tested combination passes.
- Do not communicate state using color alone.
- Keep primary CTA usage consistent.
- Use pure white sparingly so the warm palette remains visible.
- Avoid decorative gradients in Version 1. A subtle single-color tonal fade may be considered only if it remains nearly imperceptible and does not create the generic AI aesthetic.

## 15.4 Typography

### Recommended fonts

- **Primary sans:** Manrope Variable
- **Optional editorial accent:** Source Serif 4 Variable, used only for selected pull statements, not for navigation or dense body text
- **Fallback:** system-ui, -apple-system, BlinkMacSystemFont, “Segoe UI”, sans-serif

Fonts must be self-hosted and subset where practical. Do not load fonts from a third-party runtime request.

### Type behavior

- Sentence case for headings and navigation
- No all-caps paragraphs
- Uppercase may be used for short eyebrow labels with increased letter spacing
- Body copy line length: approximately 55–75 characters
- Body line height: 1.55–1.7
- Headline line height: 0.98–1.12 depending on size
- Avoid ultra-light weights

### Suggested responsive scale

| Style | Desktop | Mobile |
|---|---:|---:|
| Display | `clamp(3rem, 6vw, 5.5rem)` | Same clamp behavior |
| H1 | `clamp(2.75rem, 5vw, 4.5rem)` | Same clamp behavior |
| H2 | `clamp(2rem, 3.6vw, 3.25rem)` | Same clamp behavior |
| H3 | `clamp(1.35rem, 2vw, 1.8rem)` | Same clamp behavior |
| Lead | 20–22 px | 18–20 px |
| Body | 16–18 px | 16 px |
| Small | 14 px | 14 px |

Text must remain readable at 200% browser zoom without clipping or loss of function.

## 15.5 Layout and spacing

- Maximum content width: 1280 px
- Reading-width container: 760 px
- Desktop grid: 12 columns
- Tablet grid: 8 columns
- Mobile grid: 4 columns
- Desktop outer gutter: 32–64 px depending on viewport
- Mobile gutter: 20–24 px
- Section spacing: 88–144 px desktop, 64–96 px mobile
- Base spacing unit: 4 px
- Common spacing steps: 8, 12, 16, 24, 32, 48, 64, 96, 128

The layout should use controlled asymmetry. Not every section should be centered, and not every card should have the same dimensions.

## 15.6 Shape, borders, and elevation

- Standard radius: 12 px
- Large panel radius: 20 px maximum
- Pills reserved for tags, filters, and short status labels
- Default border: 1 px solid `stone`
- Shadows: minimal and diffuse; never the primary separator
- Dark panels may use an inset hairline border rather than a heavy shadow
- Buttons should not be fully pill-shaped unless the final logo system strongly supports that direction

## 15.7 Imagery and illustration

Preferred order:

1. Real, approved project or team photography
2. Sanitized real interface or architecture visuals
3. Purpose-built diagrams and line illustrations
4. Licensed architectural, material, or workspace photography with honest captions where needed
5. Abstract texture used sparingly

Do not present generic stock photographs as the company team or a client. Do not use AI-generated portraits, testimonial headshots, office scenes, or fake product screenshots.

A subtle material theme may use close-up textures such as warm paper, stone, metal, or architectural lines, but it must remain secondary to content.

## 15.8 Iconography

- Use one consistent outline icon family or custom simple line icons
- Stroke width should remain consistent
- Icons must supplement text, not replace meaningful labels
- Avoid mixing filled, duotone, 3D, and outline styles
- AI should be represented by workflow, nodes, data, or decision-support concepts—not a robot head or sparkle by default

## 15.9 Motion

- Typical duration: 150–250 ms
- Use opacity and transform for small entrance and state transitions
- No automatic carousels
- No continuous decorative animation
- No scroll-jacking or forced section snapping
- Honor `prefers-reduced-motion`
- Focus and validation states must not depend on animation
- Animations must not shift layout

## 16. Component Inventory

### 16.1 Foundation components

- Container
- Grid
- Section
- Stack
- Cluster
- Divider
- Typography primitives
- Responsive image
- Accessible icon wrapper

### 16.2 Navigation components

- Site header
- Desktop navigation
- Mobile navigation dialog
- Breadcrumbs
- Footer
- Skip-to-content link

### 16.3 Content components

- Hero
- Section intro
- Service card
- Service capability list
- Industry panel
- Delivery-stage timeline
- Engagement-model card
- Outcome list
- Representative-scenario card
- Approved case-study card
- Insight card
- Article body
- Pull statement
- Callout
- FAQ disclosure
- Related-content block

### 16.4 Trust components

These must be data-gated and hidden until verified:

- Client logo grid
- Testimonial
- Metric strip
- Certification badge
- Partner logo
- Leadership card

### 16.5 Conversion components

- Primary button
- Secondary button
- Text link
- Phone link
- Contact CTA panel
- Contact form
- Success panel
- Error summary

### 16.6 Component acceptance criteria

Every interactive component must include:

- Default, hover, focus-visible, active, disabled, and error states where applicable
- Keyboard support
- Screen-reader naming
- Sufficient target size
- Reduced-motion behavior
- Responsive behavior
- Automated component tests for critical states

## 17. Content Model and Repository Editing

Version 1 will use typed repository content rather than a CMS.

### 17.1 Recommended content structure

```text
src/
├── content/
│   ├── site.ts
│   ├── navigation.ts
│   ├── services.ts
│   ├── industries.ts
│   ├── engagement-models.ts
│   ├── scenarios.ts
│   ├── case-studies.ts
│   ├── careers.ts
│   ├── people.ts
│   ├── legal/
│   │   ├── privacy.mdx
│   │   ├── terms.mdx
│   │   └── accessibility.mdx
│   └── insights/
│       └── *.mdx
```

### 17.2 Content validation

Use TypeScript types and Zod schemas at build time for:

- Required fields
- Valid slugs
- Unique slugs
- Date formats
- Publish status
- Verification status
- CTA destination validity
- Image alt-text presence
- Approved proof references

The production build must fail when:

- A draft record is included in the published collection
- A named client record is not verified
- A testimonial lacks a real person, role, approval reference, and verified status
- A route has duplicate or invalid metadata
- A required image lacks alt text or is not deliberately marked decorative

### 17.3 Proposed site configuration

```ts
export const siteConfig = {
  brandName: "Fast Digital Solutions",
  legalName: null,
  foundedYear: 2023,
  domain: "https://[DOMAIN-PENDING]",
  email: "hello@[DOMAIN-PENDING]",
  phoneDisplay: "+1 302-464-5943",
  phoneHref: "tel:+13024645943",
  timeZoneLabel: "Eastern Time (ET)",
  responseCommitment: "within two business days",
  mailingAddress: {
    label: "Business mailing address",
    line1: "1207 Delaware Ave #1166",
    city: "Wilmington",
    region: "DE",
    postalCode: "19806",
    country: "United States"
  }
} as const;
```

The build must visibly warn when domain, email, legal name, logo, or other production placeholders remain unresolved.

## 18. Responsive Requirements

### 18.1 Reference breakpoints

Breakpoints should follow content behavior rather than device branding. Suggested engineering values:

- Small: 0–639 px
- Medium: 640–899 px
- Large: 900–1199 px
- Extra large: 1200 px and above

### 18.2 Required behaviors

- No horizontal page scrolling from 320 px width upward
- Navigation converts to the mobile menu before labels collide
- Hero CTA group stacks cleanly on narrow screens
- Service and industry grids move from multi-column to single-column without losing reading order
- Process timeline becomes vertical on small screens
- Tables in legal or article content use responsive wrappers or a non-table representation
- Contact form uses one column on mobile and may use two columns only for short paired fields on larger screens
- Touch targets should be at least 24 by 24 CSS pixels and should generally target 44 by 44 pixels for primary controls
- Sticky header must not consume excessive mobile viewport height
- Anchor navigation must account for sticky-header offset

## 19. Accessibility Requirements

The target is **WCAG 2.2 Level AA**.[^wcag]

### 19.1 Semantic structure

- One descriptive H1 per page
- Logical heading sequence
- Semantic landmarks: header, nav, main, footer
- Lists for grouped items
- Buttons for actions; links for navigation
- Native form elements wherever possible

### 19.2 Keyboard and focus

- All functionality usable by keyboard
- Skip-to-content link
- Strong visible focus indicator
- Focus not hidden behind sticky elements
- Logical focus order
- Mobile menu focus trapped while open and returned to trigger when closed
- No keyboard traps

### 19.3 Forms

- Visible labels, not placeholder-only labels
- Required fields identified in text
- Clear field instructions
- Error summary linked to invalid fields
- Inline errors connected using `aria-describedby`
- Errors not indicated by color alone
- Form state announced to assistive technology
- Submitted button state prevents accidental repeated requests without hiding status

### 19.4 Images and media

- Meaningful alt text for informative images
- Empty alt text for decorative images
- Captions or transcripts for future meaningful video
- No autoplay audio or video

### 19.5 Motion and sensory characteristics

- Respect reduced-motion preference
- No flashing content
- Instructions cannot rely only on color, shape, position, or sound

### 19.6 Testing

Automated:

- axe-core in component or end-to-end tests
- Lighthouse accessibility audit
- HTML validation where practical

Manual:

- Keyboard-only navigation
- Screen-reader smoke test using VoiceOver and at least one Windows screen reader when available
- 200% zoom
- 400% zoom for core task completion
- High-contrast or forced-colors review
- Reduced-motion review

## 20. Frontend Technical Architecture

## 20.1 Recommended stack

- **Next.js 16.3.x or current approved 16.x stable release at implementation**
- **React 19**
- **TypeScript with strict mode**
- **Tailwind CSS 4.3.x or current approved 4.x release**
- **MDX** for approved insight and legal content
- **Zod** for content and form-schema validation
- **React Hook Form** or a similarly small, accessible form-state solution; native form behavior remains the baseline
- **Vitest** and React Testing Library for unit/component tests
- **Playwright** for critical end-to-end flows
- **axe-core** integration for accessibility checks
- **ESLint** and Prettier
- **npm** with a committed lockfile for broad developer familiarity

Next.js supports static export by generating HTML for each route, allowing the output to be hosted by any service that serves static HTML, CSS, and JavaScript.[^next-static]

### 20.2 Rendering strategy

Use static export:

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
```

All content routes must be known at build time. Dynamic insight and case-study routes must use static parameter generation.

### 20.3 Static-export implications

Do not depend on:

- Server Actions
- Runtime API routes inside Next.js
- Request-time cookies or headers
- Runtime redirects implemented in application code
- On-demand ISR
- Middleware-dependent behavior
- Built-in server image optimization

The contact form will call the external API directly from the browser.

Images must be pre-optimized or use a static-compatible image pipeline with AVIF/WebP/JPEG fallbacks and explicit dimensions.

### 20.4 Runtime and build versions

- Pin Node.js **22.x** in `.nvmrc` or `.node-version`
- Declare an appropriate Node engine in `package.json`
- Pin dependencies through `package-lock.json`
- Do not use `latest` in production build configuration

Current Next.js documentation requires Node.js 20.9 or newer, and AWS Amplify currently supports Node.js 20, 22, and 24 runtimes for Next.js apps.[^next-install][^amplify-node]

### 20.5 Client-side JavaScript policy

- Use Server Components at build time by default
- Add `"use client"` only where interaction requires it
- Avoid site-wide animation libraries unless a clear requirement justifies the cost
- Prefer CSS transitions for simple states
- Lazy-load noncritical interactive modules
- Do not ship charting, carousel, or icon libraries for isolated uses that can be implemented more lightly

### 20.6 Image strategy

- Store approved assets in `public/images/` or a documented asset pipeline
- Generate width variants before deployment
- Include explicit width and height
- Prefer AVIF with WebP/JPEG fallback
- Use `loading="lazy"` below the fold
- Prioritize only the actual LCP image
- Keep decorative hero assets lightweight
- Avoid embedding large base64 images in JavaScript or CSS

### 20.7 Font strategy

- Self-host variable WOFF2 files
- Subset fonts where licensing and tooling permit
- Preload only the principal font file actually needed above the fold
- Use `font-display: swap`
- Provide metric-compatible fallback tuning where practical

### 20.8 Browser support

Support current stable versions and the previous major version of:

- Chrome
- Edge
- Firefox
- Safari

The minimum practical Safari target should not be lower than Safari 16.4 unless a business need requires broader support, aligning with current Next.js baseline documentation.[^next-install]

## 21. Repository Structure and Developer Experience

### 21.1 Suggested repository layout

```text
fast-digital-solutions-web/
├── .github/
│   ├── workflows/
│   └── dependabot.yml
├── public/
│   ├── fonts/
│   ├── icons/
│   └── images/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── content/
│   │   ├── forms/
│   │   ├── layout/
│   │   └── ui/
│   ├── content/
│   ├── lib/
│   ├── styles/
│   └── types/
├── tests/
│   ├── e2e/
│   └── fixtures/
├── .env.example
├── .nvmrc
├── amplify.yml
├── customHttp.yml
├── next.config.ts
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

### 21.2 Required scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start:static": "npx serve out",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check": "npm run lint && npm run typecheck && npm run test && npm run build"
  }
}
```

### 21.3 README requirements

The README must include:

- Project purpose
- Prerequisites
- Exact Node and npm expectations
- Local installation and run commands
- Content-editing instructions
- Environment variables
- Testing commands
- Static build output location
- AWS Amplify deployment process
- Branch strategy
- Placeholder and proof-approval rules
- Contact-form integration contract
- Troubleshooting section

### 21.4 Environment variables

```dotenv
NEXT_PUBLIC_SITE_URL=https://[DOMAIN-PENDING]
NEXT_PUBLIC_CONTACT_API_URL=https://[CONTACT-API-PENDING]
NEXT_PUBLIC_CONTACT_API_TIMEOUT_MS=12000
```

Do not place AWS credentials, SES credentials, SMTP credentials, private API keys, or secrets in `NEXT_PUBLIC_*` variables.

## 22. Contact Form Requirements

## 22.1 Field specification

| Field | Type | Required | Rules |
|---|---|---:|---|
| Full name | Text | Yes | 2–100 characters |
| Work email | Email | Yes | Valid email syntax; 254-character maximum |
| Company | Text | Yes | 2–150 characters |
| Country or region | Select or autocomplete | Yes | Use an accessible country list plus “Other” |
| Service required | Select | Yes | One of the six service groups, “Multiple services,” or “Not sure yet” |
| Project summary | Textarea | Yes | 30–3,000 characters |
| Budget range | Select | No | Use configurable ranges; include “Not determined” and “Prefer to discuss” |
| Desired timeline | Select | No | “As soon as practical,” “1–3 months,” “3–6 months,” “6+ months,” “Not determined” |
| Phone | Tel | No | Optional; no strict international format rejection beyond reasonable validation |
| Consent | Checkbox | Yes | Explicit acknowledgement of the Privacy Policy and contact-purpose processing |
| Website | Hidden honeypot | No | Must remain empty; not announced to assistive technology |

Do not ask for sensitive personal data, passwords, financial account details, government identifiers, or confidential production credentials.

## 22.2 Form experience

Required states:

1. Idle
2. Client validation error
3. Submitting
4. Accepted
5. Rate-limited
6. Network timeout
7. Server error

### Success message

> Thank you. Your enquiry has been received. We will review it and respond within two business days. Reference: **{requestId}**

### Generic failure message

> We could not send your enquiry. Please try again or contact us by phone at +1 302-464-5943.

Do not expose backend stack traces or internal error messages.

### Rate-limit message

> Too many requests were received from this connection. Please wait before trying again or contact us by phone.

### Accessibility behavior

- Move focus to the error summary after a failed validation submission.
- Move focus to the success heading after acceptance.
- Announce submitting and result states through an appropriate live region.
- Preserve non-sensitive field values after a recoverable failure.
- Disable repeated submission while the first request is pending.

## 22.3 Frontend API contract

### Request

`POST ${NEXT_PUBLIC_CONTACT_API_URL}`

Headers:

```http
Content-Type: application/json
Accept: application/json
```

Example payload:

```json
{
  "fullName": "Jordan Lee",
  "workEmail": "jordan@example.com",
  "company": "Example Company",
  "country": "United States",
  "service": "cloud-platform-engineering",
  "projectSummary": "We need to assess and modernize a customer-facing application currently hosted on legacy infrastructure.",
  "budgetRange": "prefer-to-discuss",
  "timeline": "1-3-months",
  "phone": "+1 555 555 5555",
  "consent": true,
  "sourcePath": "/contact/",
  "website": ""
}
```

The client must not submit a trusted timestamp, trusted IP, or verification status. The backend owns these values.

### Accepted response

Status: `202 Accepted`

```json
{
  "requestId": "FDS-2026-000123",
  "message": "Enquiry accepted"
}
```

### Validation response

Status: `422 Unprocessable Entity`

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Review the highlighted fields.",
  "fieldErrors": {
    "workEmail": "Enter a valid work email address."
  }
}
```

### Throttled response

Status: `429 Too Many Requests`

```json
{
  "code": "RATE_LIMITED",
  "message": "Try again later."
}
```

### Server response

Status: `500` or `503`

```json
{
  "code": "SUBMISSION_UNAVAILABLE",
  "message": "The enquiry service is temporarily unavailable."
}
```

## 22.4 Backend recommendation for the separate developer

Recommended AWS flow:

```text
Browser
  → Amazon API Gateway
  → AWS Lambda
  → Amazon SES
  → Internal enquiry inbox
  → Prospect acknowledgement email
```

Optional supporting services:

- AWS WAF for rate-based and managed rules if abuse requires it
- CloudWatch Logs and alarms
- Amazon SQS dead-letter or buffering pattern if delivery resilience requires it
- DynamoDB only if enquiry state or idempotency records are needed

The backend should implement:

- Server-side schema validation and normalization
- Maximum payload size
- CORS allowlist for production and approved preview origins
- Rate limiting and abuse detection
- Honeypot handling
- Idempotency or duplicate suppression where practical
- Safe output handling and email-template encoding
- Request ID generation
- Structured logs without full sensitive message content
- Failure alerts
- Retry policy that does not send duplicate acknowledgements
- Data-retention and deletion behavior consistent with the Privacy Policy

OWASP recommends treating untrusted input as data, applying appropriate validation and safe output handling, and protecting APIs from unrestricted resource consumption.[^owasp-xss][^owasp-api]

API Gateway supports stage- and method-level throttling and returns `429 Too Many Requests` when limits are exceeded.[^api-throttle]

## 22.5 Email requirements for the backend developer

Two emails are expected after an accepted enquiry:

1. Internal project-enquiry notification
2. Prospect acknowledgement

The sender domain must be verified in Amazon SES and configured for DKIM before production sending.[^ses]

Recommended sender identities:

- `projects@[DOMAIN]`
- `no-reply@[DOMAIN]` only for acknowledgment if replies are intentionally routed elsewhere

Preferred acknowledgement sender:

- A monitored address such as `hello@[DOMAIN]` or `projects@[DOMAIN]`

Email authentication requirements:

- SPF alignment as applicable
- DKIM
- DMARC policy introduced safely after monitoring
- Verified From domain
- Production SES access rather than sandbox-only behavior

The acknowledgement email must not repeat the full project summary if it could contain confidential information. A short confirmation and request ID is safer.

## 22.6 Temporary fallback before API readiness

The production site should not launch a form that silently fails. If the backend is not ready, use one of these explicit states:

1. Hide the form and display phone plus a working domain email address.
2. Display the form disabled with a clear message that online enquiries are temporarily unavailable.

Do not use a `mailto:` form submission as the primary flow because behavior varies by user environment and provides poor validation and tracking.

## 23. AWS Hosting and Deployment

## 23.1 Recommended hosting pattern

```text
GitHub repository
  → AWS Amplify Hosting build
  → Static Next.js export in /out
  → AWS global CDN
  → Custom domain and managed TLS certificate
```

AWS Amplify supports Git-based continuous deployment, custom domains, and pull-request preview deployments.[^amplify-domain][^amplify-preview]

## 23.2 Branch strategy

- `main` — production
- `staging` — shared review environment
- `feature/*` — development branches with pull requests

Recommended release flow:

1. Developer opens a pull request into `staging` or `main` according to team practice.
2. Automated checks run.
3. Amplify creates a preview URL where enabled.
4. Content, responsive layout, accessibility, and functionality are reviewed.
5. Approved changes merge.
6. Amplify deploys the target branch.

PR previews should be treated as non-production and should not be indexed. Add appropriate noindex controls or access restrictions where practical.

## 23.3 Amplify build specification

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm use 22
        - npm ci
    build:
      commands:
        - npm run check
  artifacts:
    baseDirectory: out
    files:
      - "**/*"
  cache:
    paths:
      - ~/.npm/**/*
```

The deployment developer must verify the build image includes the required Node version or configure an exact version. AWS advises specifying an exact Node version rather than `latest` in build configuration.[^amplify-build]

## 23.4 Domain and canonical host

Pending domain purchase, the recommended canonical pattern is:

```text
https://[DOMAIN]/
```

Redirect `www.[DOMAIN]` to the apex domain or choose the reverse, but use only one canonical host consistently.

Requirements:

- Managed TLS certificate
- HTTP to HTTPS redirect
- One canonical hostname
- DNS ownership verification
- Domain renewal and account ownership documented
- Domain registered in a company-controlled account, not a contractor’s personal account

## 23.5 Redirects

Required redirects:

- HTTP → HTTPS
- Alternate hostname → canonical hostname
- Trailing-slash consistency
- Any renamed content route → current route using 301
- Custom 404 behavior

Amplify supports permanent redirects, temporary redirects, rewrites, and not-found handling.[^amplify-redirects]

## 23.6 Security headers

Store headers in repository-root `customHttp.yml` so configuration is versioned. AWS Amplify supports repository-managed custom headers.[^amplify-headers]

Illustrative starting point:

```yaml
customHeaders:
  - pattern: "**"
    headers:
      - key: "Strict-Transport-Security"
        value: "max-age=31536000; includeSubDomains"
      - key: "X-Content-Type-Options"
        value: "nosniff"
      - key: "Referrer-Policy"
        value: "strict-origin-when-cross-origin"
      - key: "Permissions-Policy"
        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
      - key: "X-Frame-Options"
        value: "DENY"
      - key: "Content-Security-Policy"
        value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' https://[CONTACT-API-HOST]; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://[CONTACT-API-HOST]; upgrade-insecure-requests"
```

The deployment developer must adapt and test the CSP against the final application. Do not copy the placeholder host literally. Reduce `'unsafe-inline'` where the final framework output and styling approach allow it.

## 23.7 AWS access and ownership

- AWS account must be company-controlled.
- Use named identities and multi-factor authentication.
- Use least-privilege roles.
- Do not share root credentials.
- Do not give the frontend repository permission to send SES email.
- Separate production and non-production configuration.
- Document who owns Route 53, Amplify, SES, API Gateway, Lambda, and billing access.

## 23.8 Operational visibility

Even without visitor analytics, retain:

- Amplify build and deployment logs
- Failed-build notifications
- Backend CloudWatch logs and alarms for form failures
- SES delivery and bounce monitoring as configured by the backend developer
- A simple incident contact and rollback procedure

## 23.9 Rollback

- Keep prior successful Amplify deployments available for rollback.
- Tag major production releases in Git.
- Do not delete the previous stable branch during a release.
- If the form backend fails, switch to the documented contact fallback without taking the entire site offline.

## 24. SEO and Discoverability

## 24.1 Technical SEO

Every public page requires:

- Unique title
- Unique meta description
- Canonical URL
- Open Graph title, description, and image
- Social-card metadata
- Indexing directive appropriate to environment
- Descriptive H1
- Correct internal linking
- Inclusion in sitemap where indexable

### Recommended title pattern

```text
{Page Topic} | Fast Digital Solutions
```

Home title example:

```text
Cloud, AI and Digital Engineering | Fast Digital Solutions
```

Do not force every service keyword into every title.

## 24.2 Robots and sitemap

- Generate `sitemap.xml` from approved, public routes.
- Exclude drafts, previews, and unverified case studies.
- Production `robots.txt` should allow normal crawling and reference the sitemap.
- Non-production environments should use `noindex` and should not be submitted to search engines.

## 24.3 Structured data

Use `Organization` JSON-LD on the home or About page with only verified fields. Google recommends accurate organization details such as name, URL, logo, telephone, address, and founding date when applicable.[^organization-schema]

Initial shape:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Fast Digital Solutions",
  "url": "https://[DOMAIN-PENDING]",
  "logo": "https://[DOMAIN-PENDING]/logo.png",
  "foundingDate": "2023",
  "telephone": "+1-302-464-5943",
  "email": "hello@[DOMAIN-PENDING]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1207 Delaware Ave #1166",
    "addressLocality": "Wilmington",
    "addressRegion": "DE",
    "postalCode": "19806",
    "addressCountry": "US"
  }
}
```

Do not publish placeholder values. Do not use `LocalBusiness` solely because a mailing address exists.

Add `Article` structured data to approved insight articles when author, date, headline, image, and publisher fields are accurate.

## 24.4 Content SEO

- Write for the client question first and the keyword second.
- Create one primary intent per page.
- Use natural service terminology.
- Add relevant internal links between services, industries, work, insights, and contact.
- Avoid location-keyword pages for cities where the company has no genuine presence.
- Avoid mass-generated thin pages.
- Avoid invented statistics and unattributed industry claims.

## 24.5 Search tools

No analytics script is required. Google Search Console may be configured after domain ownership is established because it does not require adding behavioral analytics to the site. This is optional and should be controlled by the company’s domain owner.

## 25. Privacy and Legal Requirements

### 25.1 Initial privacy posture

Because Version 1 has no analytics or advertising scripts:

- Do not show a cookie banner unless non-essential cookies or similar storage are actually introduced.
- Do not set marketing cookies.
- Do not load third-party fonts.
- Minimize third-party scripts.
- Do not collect more form information than needed to respond and assess fit.

### 25.2 Contact-data handling

Before launch, define:

- Internal recipients
- Authorized access
- Storage location, if any
- Retention period
- Deletion process
- Handling of access or deletion requests
- Incident response contact
- Whether data crosses jurisdictions

A provisional retention recommendation is **12 months for non-client enquiries**, subject to legal review and operational needs. This must not be published as final policy until the owner and legal reviewer approve it.

### 25.3 Legal review items

- Exact legal entity and legal name
- Formation date
- Terms of Use
- Privacy Policy
- Accessibility Statement
- Contractual service descriptions
- Client logo and testimonial permissions
- Career application handling
- Trademark and business-name clearance

The USPTO recommends conducting a comprehensive clearance search for similar marks before relying on a company name or filing an application.[^uspto]

## 26. Security Requirements

### 26.1 Frontend

- No secrets in the repository or client bundle
- No unsafe rendering of user-supplied HTML
- No `dangerouslySetInnerHTML` for form content
- Sanitize any future rich content at build time
- Maintain a restrictive CSP
- Keep dependencies current
- Enable Dependabot or equivalent dependency alerts
- Pin production dependencies
- Review lockfile changes
- Use HTTPS only
- No third-party scripts without security and privacy review

### 26.2 Contact API

- Server-side validation, independent of client validation
- Maximum body size and field lengths
- CORS allowlist
- Rate limits and burst limits
- Abuse controls
- Safe email-template escaping
- No arbitrary recipient address from user input
- No attachment or remote-URL fetching
- Generic public error responses
- Structured internal logging
- Alerting for repeated failures or abuse
- Least-privilege IAM role
- Environment-specific configuration

### 26.3 Software supply chain

- Use GitHub branch protection on `main`
- Require pull-request review for production changes
- Run lint, type check, tests, and build before merge
- Restrict repository administrator access
- Enable MFA for source-control accounts
- Review dependency licenses where required
- Avoid unmaintained packages for simple UI functions

## 27. Performance Requirements

### 27.1 Core Web Vitals targets

- LCP: ≤ 2.5 seconds
- INP: ≤ 200 milliseconds
- CLS: ≤ 0.1

These are Google’s current “good experience” thresholds for Core Web Vitals.[^vitals]

### 27.2 Lab targets

On representative production pages using a mobile Lighthouse profile:

- Performance: ≥ 90
- Accessibility: ≥ 90, with a goal of 100 for automated checks
- Best Practices: ≥ 90
- SEO: ≥ 90

### 27.3 Budgets

- Initial JavaScript transferred per ordinary content page: target under 200 KB gzip
- Home-page total transfer excluding optional video: target under 1.5 MB
- Hero visual: target under 300 KB on mobile
- Individual below-fold images: generally under 200 KB at delivered size
- No autoplay background video in Version 1
- No more than two self-hosted font families
- Avoid more than four initially loaded font files
- No third-party marketing script budget at launch because none are allowed

### 27.4 Performance practices

- Static HTML generation
- CDN delivery
- Explicit image dimensions
- Correct responsive image sizes
- Preload only critical assets
- Defer noncritical JavaScript
- Avoid large animation libraries
- Avoid layout-changing animation
- Use long-lived caching for fingerprinted assets
- Keep HTML caching compatible with safe deployments
- Measure production output, not only local development

Google recommends prioritizing discoverable LCP resources, reducing unnecessary JavaScript, sizing images, and avoiding layout-inducing animations.[^cwv-practices]

## 28. Testing and Quality Assurance

## 28.1 Automated checks

Every pull request should run:

1. Dependency installation from lockfile
2. Formatting check
3. ESLint
4. TypeScript type check
5. Unit/component tests
6. Content-schema validation
7. Static production build
8. Critical Playwright tests where CI resources permit
9. Accessibility checks on priority pages

## 28.2 Functional test coverage

At minimum, test:

- Header navigation
- Mobile-menu open, close, focus behavior, and escape behavior
- All primary CTA destinations
- Contact-form client validation
- Successful accepted response
- 422 field-error response
- 429 throttled response
- Network timeout
- 500/503 response
- Form resubmission behavior
- Phone and email links
- Draft-content exclusion
- Verified-content gating
- Custom 404 page

## 28.3 Content QA

Before production:

- Verify spelling, grammar, and consistency
- Confirm phone number formatting and link
- Confirm address wording
- Remove all placeholder domains, emails, API hosts, images, and legal names
- Confirm every date
- Confirm every named person and role
- Confirm every client permission
- Confirm every metric and testimonial against source material
- Confirm no development-only notes are visible
- Confirm all downloadable files are approved and accessible

## 28.4 Responsive QA matrix

Test representative widths including:

- 320 px
- 375 px
- 430 px
- 768 px
- 1024 px
- 1280 px
- 1440 px
- 1920 px

Also test:

- Portrait and landscape orientations
- Browser zoom at 200%
- Long navigation labels
- Long names and company names in the form
- User font scaling where supported

## 28.5 Browser QA

Manual smoke testing in:

- Chrome
- Edge
- Firefox
- Safari on macOS or iOS

Critical form and navigation flows must work in all supported browsers.

## 28.6 Visual QA

- Compare implementation with approved designs at key widths
- Confirm type wrapping is deliberate
- Confirm section spacing remains consistent
- Confirm no accidental pure-white or cool-gray sections disrupt the warm palette
- Confirm clay accent is not overused
- Confirm cards do not become a repetitive template wall
- Confirm images are sharp but appropriately compressed
- Confirm dark sections retain contrast and do not dominate the page
- Confirm hover states do not cause layout movement

## 28.7 Accessibility QA

A release cannot pass based solely on an automated score. Perform the manual checks listed in Section 19.6 and record findings.

## 28.8 Security QA

- Inspect production bundle for secrets
- Verify CSP and other response headers
- Verify HTTP redirects to HTTPS
- Verify canonical host redirect
- Test disallowed origins against the contact API
- Test oversized and malformed payloads against the backend
- Test rate limiting
- Confirm logs do not expose full sensitive form content unnecessarily
- Confirm dependency vulnerability status

## 29. Definition of Done and Acceptance Criteria

Version 1 is ready for production only when all P0 criteria below are met.

### 29.1 Brand and design

- [ ] The site follows the approved Warm Precision direction.
- [ ] The off-brown palette is implemented through design tokens.
- [ ] No neon gradient mesh, glassmorphism-led layout, generic 3D, fake dashboards, or AI-generated people are present.
- [ ] The temporary wordmark is replaced by the approved logo or formally accepted for launch.
- [ ] Typography, spacing, iconography, and motion are consistent.
- [ ] The site looks intentionally designed at mobile, tablet, laptop, and wide-desktop sizes.

### 29.2 Content and credibility

- [ ] Exact legal entity details are verified or omitted.
- [ ] The 2023 start-year statement is verified.
- [ ] The address is labelled “Business mailing address.”
- [ ] No claim implies a walk-in Delaware office unless true.
- [ ] No fake client, logo, testimonial, person, metric, award, certification, or partner status is published.
- [ ] Representative scenarios are clearly labelled.
- [ ] All proof records meet the verification gate.
- [ ] Placeholder domain, email, API, logo, and legal text are resolved.

### 29.3 Pages

- [ ] Home page is complete.
- [ ] Services index and six service detail pages are complete.
- [ ] Industries page is complete.
- [ ] Work page uses approved evidence or clearly labelled scenarios.
- [ ] How We Work page is complete.
- [ ] About page is complete.
- [ ] Contact page is complete.
- [ ] Privacy, Terms, Accessibility, and 404 pages are complete.
- [ ] Insights contains at least three approved substantive articles or is removed from primary navigation.
- [ ] Careers accurately displays open roles or a no-open-role state.

### 29.4 Contact experience

- [ ] The form uses the approved fields and validation rules.
- [ ] The API endpoint is configured outside source code.
- [ ] Success, validation, throttling, timeout, and server-error states work.
- [ ] The form is keyboard and screen-reader usable.
- [ ] The internal notification and prospect acknowledgment are tested by the backend owner.
- [ ] SES domain verification and email authentication are complete.
- [ ] A fallback contact path is available.

### 29.5 Technical quality

- [ ] Strict TypeScript passes.
- [ ] Linting passes.
- [ ] Unit tests pass.
- [ ] Critical end-to-end tests pass.
- [ ] Static export completes.
- [ ] No production runtime dependency on a Next.js server exists.
- [ ] No secrets are present in the client bundle or repository.
- [ ] Security headers are deployed and tested.
- [ ] Production domain and TLS work.
- [ ] Canonical redirects work.

### 29.6 Accessibility and performance

- [ ] WCAG 2.2 AA review is complete.
- [ ] Keyboard navigation is complete and logical.
- [ ] Visible focus is present.
- [ ] Form errors are accessible.
- [ ] Reduced motion works.
- [ ] No critical automated accessibility violations remain.
- [ ] Lighthouse targets are met on representative pages or documented exceptions are approved.
- [ ] No significant layout shift occurs during loading.

### 29.7 Handoff

- [ ] README is complete.
- [ ] Environment variables are documented.
- [ ] Amplify build and branch settings are documented.
- [ ] Domain and AWS ownership are documented.
- [ ] Content editing and proof-approval procedures are documented.
- [ ] Rollback instructions are documented.
- [ ] Pending post-launch items are transferred to an owned backlog.

## 30. Delivery Sequence

The work should proceed in this order.

### Phase 0 — Business verification and content inventory

- Confirm legal entity
- Confirm formation date
- Confirm domain and email plan
- Confirm business hours
- Collect logo and brand assets
- Collect leadership information
- Inventory real client proof and permissions
- Confirm privacy and contact-data handling

Development can begin with safe placeholders, but production launch cannot bypass the relevant gates.

### Phase 1 — Foundation

- Repository setup
- Next.js static-export configuration
- TypeScript, Tailwind, testing, and formatting setup
- Design tokens
- Global typography and layout
- Content schemas
- Header, footer, buttons, and foundational components
- AWS configuration files

### Phase 2 — Core pages

- Home
- Services index
- Six service pages
- Industries
- How We Work
- About
- Contact
- Legal and utility pages

### Phase 3 — Trust and editorial content

- Representative scenarios or verified case studies
- Insights index and three launch articles
- Careers state
- Leadership content when approved
- Final logo and approved imagery

### Phase 4 — Integration and QA

- Contact API integration
- Form state testing
- Accessibility review
- Responsive QA
- Content verification
- Performance optimization
- Security-header validation
- SEO metadata and structured data

### Phase 5 — Production release

- Domain connection
- TLS and canonical redirects
- Production environment variables
- SES and form-endpoint validation
- Final legal and content approval
- Deployment
- Smoke test
- Rollback readiness

## 31. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Exact legal name is unknown | Incorrect footer, contracts, schema, or legal pages | Keep public brand only; block legal suffix publication until verified |
| Domain and email are pending | Incomplete metadata, form fallback, and email authentication | Use visible build warnings; make domain/email production blockers |
| Logo is pending | Visual rework | Build a flexible wordmark slot and neutral design system; replace before launch |
| Real client proof is unavailable | Weak trust section or temptation to fabricate | Use transparent representative scenarios and process evidence; publish named work later |
| Leadership information is unavailable | About page may feel thin | Lead with mission and operating principles; omit fake profiles |
| Contact backend is delayed | Core conversion path unavailable | Use phone and working domain email fallback; do not launch a broken form |
| Very broad service list | Site appears generic | Group into six focused service categories and explain client situations |
| Regulated-industry positioning without proof | Credibility and legal risk | Defer regulated sectors until experience and controls are verified |
| Rush to launch | Accessibility, content, or security defects | Enforce P0 acceptance criteria and automated build gates |
| Static-export limitations overlooked | Broken runtime functionality | Keep dynamic behavior external and document unsupported Next.js features |
| Brown palette becomes dated or heavy | Reduced clarity and modernity | Use brown as a controlled accent within light neutral space; retain high contrast |
| Design becomes generic or AI-like | Brand trust damage | Enforce explicit visual guardrails and human design review |
| No analytics | Limited quantitative optimization | Use operational feedback initially; add privacy-reviewed analytics only in a later decision |

## 32. Pending Decisions and Required Inputs

### 32.1 Production blockers

- [ ] Exact legal company name and entity type
- [ ] Delaware file number or equivalent formation evidence
- [ ] Exact legal formation date and confirmation of the 2023 public statement
- [ ] Purchased production domain
- [ ] Domain-based company email addresses
- [ ] Internal enquiry-recipient email address
- [ ] Contact API production endpoint
- [ ] Final logo and favicon assets
- [ ] Approved Privacy Policy and Terms of Use
- [ ] Confirmed form-data retention and deletion process
- [ ] Confirmed operational business hours if they will be shown
- [ ] AWS, domain, GitHub, and billing account ownership

### 32.2 Content blockers for optional trust modules

- [ ] Client names and written logo permissions
- [ ] Approved testimonials with real names, roles, and permission
- [ ] Case-study facts, screenshots, and measurable outcomes
- [ ] Certifications and verification links
- [ ] Partner status and permission to use marks
- [ ] Leadership names, roles, bios, headshots, and profile URLs

The site can launch without these optional modules, but it cannot substitute invented content.

### 32.3 Insights and careers inputs

- [ ] Real authors for the first three articles
- [ ] Approved article drafts and sources
- [ ] Careers contact route
- [ ] Real open roles or approval of the no-open-role state
- [ ] Equal-opportunity and applicant privacy wording, if applications are accepted

### 32.4 Recommended future decisions

- Privacy-focused analytics or continued no-analytics position
- Headless CMS only if publishing frequency justifies it
- Additional case-study and industry pages
- Multilingual support
- Scheduling integration
- Newsletter
- Client portal
- Expanded support offerings

## 33. Launch Checklist

### Business and legal

- [ ] Legal identity verified
- [ ] Public brand usage approved
- [ ] Name and trademark clearance reviewed
- [ ] Address wording approved
- [ ] Phone routing tested
- [ ] Privacy and Terms approved
- [ ] All client and testimonial permissions archived

### Domain and email

- [ ] Domain registered in company-controlled account
- [ ] DNS configured
- [ ] TLS active
- [ ] Canonical host selected
- [ ] Domain email addresses working
- [ ] SES identity verified
- [ ] DKIM active
- [ ] SPF and DMARC reviewed
- [ ] Internal and acknowledgement emails tested

### Content

- [ ] Every page approved
- [ ] No placeholder values remain
- [ ] No draft routes are indexed
- [ ] No invented proof appears
- [ ] Contact response wording is operationally accurate
- [ ] Insights and careers meet their launch conditions

### Design and UX

- [ ] Final logo installed
- [ ] Favicon and social image installed
- [ ] Warm Precision palette confirmed
- [ ] Mobile navigation tested
- [ ] Contact form tested
- [ ] All CTA links tested
- [ ] Empty, loading, success, and error states reviewed

### Technical

- [ ] Production build passes
- [ ] Amplify deployment succeeds
- [ ] Security headers verified
- [ ] Redirects verified
- [ ] Sitemap and robots verified
- [ ] Structured data validated
- [ ] 404 page verified
- [ ] Rollback tested or documented

### Accessibility and performance

- [ ] Keyboard test complete
- [ ] Screen-reader smoke test complete
- [ ] Zoom and text-reflow tests complete
- [ ] Contrast review complete
- [ ] Reduced-motion review complete
- [ ] Lighthouse review complete
- [ ] Core page-weight budgets reviewed

### Operations

- [ ] Website owner identified
- [ ] Repository owner identified
- [ ] AWS owner identified
- [ ] Form backend owner identified
- [ ] Enquiry-response owner identified
- [ ] Failed-form alert route identified
- [ ] Content update process documented
- [ ] Incident and rollback contacts documented

## 34. Draft Homepage Content Framework

This section is a starting point for design and copy refinement. It is not permission to add unsupported claims.

### Hero

**Technology delivery built around your business.**

Fast Digital Solutions helps growing organizations modernize applications, move to the cloud, automate operations, and strengthen engineering delivery—from discovery through ongoing support.

**Primary CTA:** Discuss your project  
**Secondary CTA:** Explore our capabilities

### Capability strip

Cloud & Platform · AI & Automation · Software Engineering · Quality Engineering · Flexible Teams

### Client-first section

**Your priorities stay at the center.**

We work in clear stages, share progress early, document decisions, and shape the delivery model around your team, systems, and business goals.

- Clear scope, priorities, and ownership
- Working demonstrations and early feedback
- Quality and documentation throughout delivery
- Flexible engagement models

### Services introduction

**Connected capabilities for complex delivery needs.**

Bring together the cloud, software, data, quality, and delivery skills needed to move a defined business priority forward.

### Delivery introduction

**A practical path from problem to progress.**

Align on the outcome. Architect the right approach. Deliver in visible increments. Validate what matters. Improve with the learning captured along the way.

### About preview

**Built to be a practical technology partner.**

Serving clients since 2023, Fast Digital Solutions focuses on clear communication, accountable delivery, and technology choices shaped around the client’s operating reality.

This paragraph may be published only after the 2023 wording is verified.

### Final CTA

**Tell us what needs to move forward.**

Share your goals, current constraints, and desired timeline. A member of our team will respond within two business days.

**CTA:** Discuss your project

## 35. Research References

The PRD uses the following research as a benchmark and technical basis. Accessed August 26, 2026.

[^thoughtworks]: [Thoughtworks — Who we work with](https://www.thoughtworks.com/en-us/clients)
[^slalom]: [Slalom — Customer stories](https://www.slalom.com/gb/en/customer-stories)
[^epam]: [EPAM — Consumer services and client-work structure](https://www.epam.com/industries/consumer)
[^next-static]: [Next.js — Static exports](https://nextjs.org/docs/app/guides/static-exports)
[^next-install]: [Next.js — Installation and system requirements](https://nextjs.org/docs/app/getting-started/installation)
[^amplify-node]: [AWS Amplify — Node.js version support for Next.js apps](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-supported-features.html)
[^amplify-preview]: [AWS Amplify — Web previews for pull requests](https://docs.aws.amazon.com/amplify/latest/userguide/pr-previews.html)
[^amplify-domain]: [AWS Amplify — Connecting a custom domain](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html)
[^amplify-build]: [AWS Amplify — Customizing the build image and version pinning](https://docs.aws.amazon.com/amplify/latest/userguide/custom-build-image.html)
[^amplify-headers]: [AWS Amplify — Setting custom headers](https://docs.aws.amazon.com/amplify/latest/userguide/setting-custom-headers.html)
[^amplify-redirects]: [AWS Amplify — Redirects and rewrites](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html)
[^ses]: [Amazon SES — Domain DKIM verification](https://docs.aws.amazon.com/ses/latest/APIReference/API_VerifyDomainDkim.html)
[^api-throttle]: [Amazon API Gateway — Request throttling](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)
[^wcag]: [W3C — Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
[^vitals]: [web.dev — Web Vitals](https://web.dev/articles/vitals)
[^cwv-practices]: [web.dev — Effective ways to improve Core Web Vitals](https://web.dev/articles/top-cwv)
[^organization-schema]: [Google Search Central — Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
[^ftc]: [Federal Trade Commission — Final rule banning fake reviews and testimonials](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials)
[^owasp-xss]: [OWASP Cheat Sheet Series — Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
[^owasp-api]: [OWASP — API Security Project](https://owasp.org/www-project-api-security/)
[^uspto]: [USPTO — Search the trademark database and clearance guidance](https://www.uspto.gov/trademarks/search)

---

**End of Product Requirements Document**
