# Content Guide

How to edit, add, and approve content — and the rules the build enforces.
The authoritative policy is PRD §2 (credibility), §14 (page requirements),
and §17 (content model).

## Where content lives

| File                               | Contains                                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| `src/content/site.ts`              | Brand identity: brand/legal name, domain, email, phone, address, API endpoint |
| `src/content/navigation.ts`        | Primary nav + mega-menu groups, footer links, the Insights nav gate           |
| `src/content/image-manifest.ts`    | Every photograph on the site: source file, crop, retouch ops, alt text        |
| `src/content/services.ts`          | The six service groups (cards + full detail pages)                            |
| `src/content/industries.ts`        | The four focus industries                                                     |
| `src/content/engagement-models.ts` | The four engagement models                                                    |
| `src/content/scenarios.ts`         | Representative scenarios (always labelled illustrative)                       |
| `src/content/case-studies.ts`      | Real client work — **empty until permissions exist**                          |
| `src/content/people.ts`            | Leadership — **empty until real, approved profiles exist**                    |
| `src/content/proof.ts`             | Testimonials, logos, metrics, certifications — **empty until verified**       |
| `src/content/careers.ts`           | Open roles (empty = honest no-open-roles state)                               |
| `src/content/insights/*.mdx`       | Articles (frontmatter + MDX body)                                             |
| `src/content/legal/*.mdx`          | Privacy, Terms, Accessibility (draft-marked until legal review)               |
| `src/content/delivery-method.ts`   | The five delivery stages and working commitments                              |

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

Edit `src/content/site.ts`. The domain (`https://fastdigitalsolutions.com`),
email, and legal name (`Fast Digital Solutions LLC`) are set. `brandName` is
the short name used in the wordmark, navigation, and titles; `legalName` is
used only in legal contexts (footer copyright, legal pages, consent text,
structured data). Add the final logo as `public/images/logo.svg` to clear the
last identity warning.

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

## Images

Photography goes through a build-time pipeline; nothing is optimized at
runtime. The raw originals live in the gitignored repo-root `images/` folder
(keep a copy outside the repo too — see `docs/IMAGE-LICENSES.md` for the
licence log). What is committed is generated.

### Add or replace a photo

1. Put the original (highest resolution, no watermark, licence recorded in
   `docs/IMAGE-LICENSES.md`) under `images/<slot-folder>/`.
2. Add or edit its entry in `src/content/image-manifest.ts`:
   - `id` — kebab-case; becomes the filename prefix and the `<Picture id>`.
   - `source` — path under `images/`. **Each source may be used once** on the
     whole site; the build fails otherwise.
   - `class` (`hero | band | feature | card | tile | cover | thumb`) picks the
     output widths and quality; `aspect` picks the crop shape.
   - `focus` `{x, y}` in 0–1 chooses what the crop keeps; `ops.zoom` tightens
     it; `ops.flip` mirrors; `ops.blurRegions` (source pixels) hide logos or
     readable third-party text; `ops.saturation` grades warm shots toward
     neutral. All coordinates are measured on the original file **before** any
     flip.
   - `alt` — describe what is actually shown. These are licensed workplace
     photos, never "our team" or "our client". Backgrounds under a scrim are
     `decorative: true` with `alt: ""`.
3. Run `npm run images` (a few minutes; `--only <id>` for one slot) and check
   the size table it prints. Derivatives land in `public/images/`, the typed
   record in `src/generated/images.ts`.
4. Reference the id from content (`cardImageId`/`heroImageId` on a service,
   `tileImageId` on an industry, `coverImageId` in an insight's frontmatter)
   or a page (`<PageHero image="…">`, `<Picture id="…">`).
5. Commit `public/images/` and `src/generated/images.ts` together with the
   manifest. `npm run build` fails if they have drifted apart.

Budgets: card/tile/cover/feature derivatives must stay under 200 KB, hero and
band under 260 KB — the pipeline refuses to emit larger files. Never use
photos presented as the team, AI-generated people, or fake product
screenshots.
