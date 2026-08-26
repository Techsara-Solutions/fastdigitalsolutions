# Content Guide

How to edit, add, and approve content — and the rules the build enforces.
The authoritative policy is PRD §2 (credibility), §14 (page requirements),
and §17 (content model).

## Where content lives

| File                               | Contains                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `src/content/site.ts`              | Brand identity: name, phone, address, placeholders (domain/email/legal name) |
| `src/content/navigation.ts`        | Primary nav, footer links, the Insights nav gate                             |
| `src/content/services.ts`          | The six service groups (cards + full detail pages)                           |
| `src/content/industries.ts`        | The four focus industries                                                    |
| `src/content/engagement-models.ts` | The four engagement models                                                   |
| `src/content/scenarios.ts`         | Representative scenarios (always labelled illustrative)                      |
| `src/content/case-studies.ts`      | Real client work — **empty until permissions exist**                         |
| `src/content/people.ts`            | Leadership — **empty until real, approved profiles exist**                   |
| `src/content/proof.ts`             | Testimonials, logos, metrics, certifications — **empty until verified**      |
| `src/content/careers.ts`           | Open roles (empty = honest no-open-roles state)                              |
| `src/content/insights/*.mdx`       | Articles (frontmatter + MDX body)                                            |
| `src/content/legal/*.mdx`          | Privacy, Terms, Accessibility (draft-marked until legal review)              |
| `src/content/delivery-method.ts`   | The five delivery stages and working commitments                             |

After any edit, run `npm run validate:content` (or just `npm run build` —
validation runs automatically and **blocks the build** on violations).

## The non-negotiable rules (PRD §2)

Never add, even "temporarily":

- Client names or logos without written permission
- Testimonials that are not real, attributed, and approved
- Metrics, outcomes, or statistics that are not evidenced
- People (names, bios, headshots) who have not approved their profile
- Certifications, partner statuses, or awards that are not verifiable
- Fake job openings
- Any claim of a staffed Delaware office — the address is only ever labelled
  **"Business mailing address"**

The build gate exists to make violations fail loudly, not to be worked around.
If content is marked `publishStatus: "approved"` it must also be
`verified: true` **and** carry an `approvalReference` (e.g. a file/email ref
where the permission is archived), or the build fails.

## Common tasks

### Update identity data (domain, email, legal name, logo)

Edit `src/content/site.ts`. Replace the `[DOMAIN-PENDING]` values, set
`legalName` when formation documents confirm it, and add the final logo as
`public/images/logo.svg` (the build warning disappears when each is resolved).
Also set the `NEXT_PUBLIC_SITE_URL` repository variable for deploys
(see DEPLOYMENT.md) — that is what turns off `noindex`.

### Publish an Insights article

1. Add `src/content/insights/<slug>.mdx` with complete frontmatter
   (see the existing drafts): title, description, topic, **real author name
   and role**, dates, `relatedServiceSlugs`.
2. Body must be substantive — approved articles under **900 words fail the
   build** (PRD §14.8). Cite sources for factual claims.
3. Keep `publishStatus: "draft"` until the owner approves; then set
   `publishStatus: "approved"` and `verified: true`.
4. Insights automatically enters primary navigation when **3** approved
   articles exist — never force it earlier.

The three launch drafts (`aws-migration-readiness-checklist`,
`where-ai-automation-creates-value`, `quality-engineering-in-delivery`) are
fully written but need real authors assigned (`[AUTHOR-PENDING]`) and owner
review before approval. Update `publishedAt` to the real publication date at
approval time.

### Add a case study (Work page)

Only when based on real work with permission (PRD §14.5). Add a record to
`src/content/case-studies.ts`:

- `kind: "anonymized"` — descriptor must be factually accurate and
  contractually permitted (e.g. "North American B2B software company").
- `kind: "named"` — requires written client permission for name/logo, approved
  copy and metrics, and `approvalReference` pointing at the archived approval.

Published case studies appear automatically on `/work/` and related service
pages.

### Add a testimonial / client logo / metric / certification

Add to `src/content/proof.ts` with the full proof record. The corresponding
components (`src/components/trust/TrustSections.tsx`) are already built and
render automatically once a record is publishable. They render nothing —
by design — until then.

### Add leadership profiles

Add to `src/content/people.ts` with real name, role, bio, and (optionally) an
approved headshot in `public/images/`. The About page's leadership section
appears automatically. No silhouettes, no stand-ins (PRD §14.7).

### Post a job opening

Add a role to `src/content/careers.ts` with every field from PRD §14.9
(responsibilities, skills, hiring process, application destination) and an
approval record. With zero publishable roles the page shows the honest
no-open-roles state.

### Edit legal pages

Edit `src/content/legal/*.mdx`. Each page shows a **"Draft — pending legal
review"** banner while `reviewStatus: "draft-pending-legal-review"`; flip to
`"approved"` only after counsel signs off (production blocker, PRD §32.1).
Update `lastReviewed` whenever the text changes. Note: MDX comments are
`{/* ... */}`, not `<!-- ... -->`.

## Voice and style (PRD §7.4)

Calm, direct, specific. Client situation before capability, outcomes before
tools. Banned phrases (do not reintroduce them): "unlock limitless potential",
"revolutionize your business", "cutting-edge", "seamless", "future-proof",
"harness the power of", "game-changing", "one-stop solution", "world-class",
"best-in-class". Sentence case headings; uppercase only for eyebrow labels.

## Images (PRD §15.7, §20.6)

Pre-optimize before committing (static export does no runtime optimization):
correct dimensions, AVIF/WebP where possible, under ~200 KB below the fold.
Every informative image needs real alt text; decorative images get `alt=""`.
Never use stock photos presented as the team, AI-generated people, or fake
product screenshots.
