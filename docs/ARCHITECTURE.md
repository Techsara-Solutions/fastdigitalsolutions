# Architecture

## Stack

| Layer     | Choice                                                                                           | PRD ref       |
| --------- | ------------------------------------------------------------------------------------------------ | ------------- |
| Framework | Next.js 16 (App Router), React 19, **static export** (`output: "export"`, `trailingSlash: true`) | §20.1–20.2    |
| Language  | TypeScript, `strict` + `noUncheckedIndexedAccess`                                                | §20.1         |
| Styling   | Tailwind CSS 4 (CSS-first `@theme` tokens in `src/styles/globals.css`)                           | §15           |
| Content   | Typed TS modules + MDX (insights/legal), validated with Zod                                      | §17           |
| MDX       | `next-mdx-remote/rsc` + `gray-matter`, compiled at build time                                    | §14.8, §14.11 |
| Forms     | React Hook Form + Zod resolver                                                                   | §22           |
| Fonts     | Self-hosted Manrope + Source Serif 4 variable WOFF2 (latin subsets) via `next/font/local`        | §15.4, §20.7  |
| Tests     | Vitest + Testing Library (unit), Playwright + axe-core (E2E/a11y)                                | §28           |
| CI/CD     | GitHub Actions → EC2 + Nginx                                                                     | see below     |

## Key decisions

### Static export, no server

Every route is known at build time and exported to plain HTML in `out/`.
There are no Server Actions, API routes, middleware, or runtime redirects
(PRD §20.3). The contact form calls the external API directly from the
browser. Consequences:

- The **insights route** is an optional catch-all
  (`src/app/insights/[[...slug]]/page.tsx`): static export requires each
  dynamic route to generate ≥1 path, but article paths exist only for
  approved articles — which is legitimately zero at launch. The empty-slug
  variant is the index page, so the route always generates.
- **Images** are unoptimized at runtime (`images.unoptimized`); assets must be
  pre-optimized before being added to `public/images/` (PRD §20.6).
- `robots.txt`/`sitemap.xml` are Next metadata routes forced static.

### Hosting: EC2 + Nginx (deviation from PRD §23)

The PRD recommends AWS Amplify Hosting. The owner chose **EC2 + Nginx with a
GitHub Actions pipeline** instead (decision recorded 2026-08-26). What this
changes versus the PRD:

| PRD assumption (Amplify)          | This implementation (EC2)                                                    |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `amplify.yml` build spec          | `.github/workflows/deploy.yml`                                               |
| `customHttp.yml` security headers | `deploy/nginx/fastdigitalsolutions.conf`                                     |
| Managed TLS + CDN                 | certbot TLS on the instance; no CDN (CloudFront can be added in front later) |
| PR preview deployments            | Not available; CI runs full checks + E2E on every PR instead                 |
| Managed rollback UI               | Timestamped releases on the server + symlink swap (last 5 kept)              |

The site remains a pure static artifact, so migrating to Amplify, S3+CloudFront,
or any static host later requires **zero application changes**.

### The credibility gate (PRD §2)

The defining constraint: no invented clients, testimonials, metrics, people,
certifications, or claims — ever. Enforced in three layers:

1. **Schema**: every proof record carries `publishStatus`/`verified`
   (`src/lib/schemas.ts`); scenarios are structurally `illustrative: true`.
2. **Build gate**: `scripts/validate-content.ts` runs before every build
   (`prebuild`) and **fails** on: approved-but-unverified proof, approved
   records without an `approvalReference`, duplicate/invalid slugs, broken
   cross-references, approved insights under 900 words or with placeholder
   authors, missing legal files.
3. **Render gate**: components only ever receive `getPublished*()` filtered
   data; trust components render `null` with no publishable records; the
   Insights nav item appears only at ≥3 published articles.

### Placeholder policy (PRD §17.3)

`src/content/site.ts` is the single source of identity data. Values containing
`PENDING` (domain, email) plus `legalName: null` and the missing logo drive:
build warnings, `noindex` on every page, an empty sitemap, withheld JSON-LD,
the contact-form fallback, and the omitted footer email. Resolving the real
values in one place flips all of this at the next build.

## Directory map

```
src/
├── app/                  one folder per route (PRD §12.2 sitemap)
├── components/
│   ├── ui/               Container, Section, SectionIntro, Button
│   ├── layout/           SiteHeader (client), SiteFooter, Breadcrumbs, SkipLink, Wordmark
│   ├── content/          cards, timeline, CTA panel, hero motif, MDX page shells
│   ├── forms/            ContactForm (client; full PRD §22 state machine)
│   └── trust/            data-gated proof components (render null when empty)
├── content/              ALL editable content (see docs/CONTENT-GUIDE.md)
├── lib/                  schemas, loaders (insights/legal), metadata, fonts, utils
└── styles/globals.css    design tokens + base + rich-text styles
scripts/validate-content.ts   the build gate
deploy/                   nginx config + EC2 setup script
tests/unit | tests/e2e    Vitest | Playwright
```

## Design system notes (PRD §15 "Warm Precision")

- Palette tokens exactly per §15.3 (`paper`, `canvas`, `stone`, `ink`,
  `espresso`, `muted`, `clay`, `clay-dark`, `olive`), plus one addition:
  **`olive-dark` (#4c4b36)** — the scenario-label badge text needed it to pass
  WCAG AA contrast (verified by axe in CI); base `olive` failed at small sizes,
  as §15.3's color rules anticipated.
- Type scale as `--text-*` tokens with the §15.4 clamp values; Source Serif 4
  appears only in pull statements.
- Only two client components exist: `SiteHeader` (menu/scroll state) and
  `ContactForm`. Everything else renders at build time — total JS stays low.
- Motion: 150–250ms color/transform transitions only; a global
  `prefers-reduced-motion` rule collapses all animation (PRD §15.9).

## Testing strategy (PRD §28)

- **Unit (Vitest)**: schema/gate logic, content integrity (slug uniqueness,
  cross-references, 900-word floor), contact validation rules, form state
  machine (success/429/error-summary), Button semantics.
- **E2E (Playwright, desktop + mobile projects)**: navigation, mobile-menu
  focus/Escape/scroll-lock, CTA destinations, all contact-form states against
  a mocked API (`build:e2e` bakes in a mock endpoint; Playwright intercepts
  it), 404, scenario labelling, no horizontal overflow at 320–1280px.
- **Accessibility**: axe-core WCAG 2.2 AA scans on 11 priority pages fail CI
  on any violation. Manual checks (screen reader, 200%/400% zoom,
  forced-colors) are tracked in IMPLEMENTATION-STATUS.md — automated passes
  alone do not satisfy PRD §28.7.
