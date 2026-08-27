# Architecture

## Stack

| Layer     | Choice                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router), React 19, **static export** (`output: "export"`, `trailingSlash: true`) |
| Language  | TypeScript, `strict` + `noUncheckedIndexedAccess`                                                |
| Styling   | Tailwind CSS 4 (CSS-first `@theme` tokens in `src/styles/globals.css`)                           |
| Content   | Typed TS modules + MDX (insights), validated with Zod                                            |
| MDX       | `next-mdx-remote/rsc` + `gray-matter`, compiled at build time                                    |
| Images    | Build-time pipeline (`sharp`): committed AVIF/WebP derivatives + typed record                    |
| Brand     | Build-time script (`sharp`): logo paths, favicons, social image from one source SVG              |
| Forms     | React Hook Form + Zod resolver                                                                   |
| Fonts     | Self-hosted Manrope + Source Serif 4 variable WOFF2 (latin subsets) via `next/font/local`        |
| Tests     | Vitest + Testing Library (unit), Playwright + axe-core (E2E/a11y)                                |
| CI/CD     | GitHub Actions → EC2 + Nginx behind Cloudflare                                                   |

## Key decisions

### Static export, no server

Every route is known at build time and exported to plain HTML in `out/`.
There are no Server Actions, API routes, middleware, or runtime redirects.
The contact form calls the external API directly from the browser.
Consequences:

- The **insights route** is an optional catch-all
  (`src/app/insights/[[...slug]]/page.tsx`): static export requires each
  dynamic route to generate at least one path, and the empty-slug variant is
  the index page, so the route always generates.
- **Images** are never optimized at runtime (`images.unoptimized`). See the
  image pipeline below.
- `robots.txt`/`sitemap.xml` are Next metadata routes forced static.

### Hosting: EC2 + Nginx (deviation from PRD §23)

The PRD recommends AWS Amplify Hosting. The owner chose **EC2 + Nginx with a
GitHub Actions pipeline** instead (decision recorded 2026-08-26), fronted by
Cloudflare since 2026-08-27. The site remains a pure static artifact, so
migrating to Amplify, S3+CloudFront, or any static host later requires zero
application changes. Details: [DEPLOYMENT.md](DEPLOYMENT.md).

### The credibility gate

The defining constraint: no invented clients, testimonials, metrics, people,
certifications, or claims. Enforced in three layers:

1. **Schema**: every proof record carries `publishStatus`/`verified`
   (`src/lib/schemas.ts`); scenarios are structurally `illustrative: true`.
2. **Build gate**: `scripts/validate-content.ts` runs before every build
   (`prebuild`) and **fails** on: approved-but-unverified proof, approved
   records without an `approvalReference`, duplicate/invalid slugs, broken
   cross-references, approved insights under 900 words or with placeholder
   authors, missing brand assets, and any photography problem (below).
3. **Render gate**: components only ever receive `getPublished*()` filtered
   data; the leadership grid renders `null` with no publishable records; the
   Insights nav item appears only at three or more published articles (met
   since 2026-08-27, when the three articles were approved under a team byline).

### Identity data

`src/content/site.ts` is the single source of identity data: the short brand
name (`brandName`, used in the wordmark, navigation, and titles), the registered
entity (`legalName: "Fast Digital Solutions LLC"`, used in the footer copyright
and JSON-LD), the live domain, email, phone, mailing address, and the
production contact endpoint. Any value still containing `PENDING` drives build
warnings, `noindex`, an empty sitemap, and withheld JSON-LD.

The site publishes no legal pages (Privacy, Terms, Accessibility were removed
at the owner's request on 2026-08-27) and the contact form carries no consent
checkbox. The form still collects personal data; that gap is the owner's to
close.

### Image pipeline (2026-08-27)

Raw photography lives in a gitignored repo-root `images/` folder (licensed
Pexels originals; licence log in [IMAGE-LICENSES.md](IMAGE-LICENSES.md),
dimension record in `src/content/image-sources.json`). What ships is generated:

```
src/content/image-manifest.ts   one slot per placement: source, class, aspect, focus, ops, alt
        │  npm run images  (scripts/build-images.ts, sharp; manual, local only)
        ▼
public/images/<id>-<w>.<hash>.{avif,webp}   committed derivatives (~5 MB total)
src/generated/images.ts                     committed typed record → <Picture id="…">
        │  prebuild
        ▼
scripts/validate-content.ts   fails the build if: a source is used twice, alt text is
                              missing, the manifest changed without regenerating
                              (manifestHash), a derivative is missing on disk, or a
                              file exceeds its class byte budget
```

- **Retouching is declarative**: horizontal flip, blur regions (logos,
  readable third-party text), saturation/brightness, zoom. Coordinates are
  measured on the original; blur is applied before the flip and the script
  mirrors the focal point. A site-wide warm grade (`recomb`) reconciles the
  cool-toned originals with the warm palette.
- **Formats**: AVIF + WebP only (a documented deviation from PRD §20.6's JPEG
  fallback; every shipping browser decodes both, and the `<img src>` fallback
  is the mid-width WebP). Filenames carry a content hash, so nginx serves
  `/images/` with a one-year immutable cache.
- **Rendering**: `PictureFrame` (plain markup) / `Picture` (server, resolves an
  id and hoists a `<link rel="preload">` for the page's one `priority` image).
  Not `next/image`: with `unoptimized` it emits a single `<img>` with no srcset
  or format negotiation.
- **Rule: every photograph appears once site-wide**; the validator enforces
  unique sources. The one global CTA band photo counts as a single placement.
- The photos are licensed workplace imagery, never presented as our team or
  clients (alt text describes what is shown).

### Brand assets (2026-08-27)

`brand/fds-logo.source.svg` is the supplied logo (a bitmap trace). `npm run
brand` (`scripts/build-brand.ts`) derives everything from it:

- `src/components/layout/logo-paths.ts`: the mark and its two counters baked
  into one compound path (`fill-rule: evenodd`, so the counters are real holes)
  plus the accent square. `LogoMark` renders it with `currentColor`, which is
  why the same component works on the light header and the dark footer.
- `src/app/icon.svg`, `src/app/icon.png` (32 px), `src/app/apple-icon.png`
  (180 px): Next file-convention icons, emitted automatically into every page.
  These use the **white mark on the espresso surface**, which reads better than
  a dark mark in a browser tab and on a home screen; the in-page logo still
  inherits `currentColor`.
- `public/images/og-default.<hash>.png` (1200×630) + `src/generated/brand.ts`:
  the social-share image. Page-level `openGraph` would drop a file-convention
  image, so `src/lib/metadata.ts` attaches it explicitly (and switches the
  Twitter card to `summary_large_image`) once the domain is real.

### Design system: warm graphite + terracotta (2026-08-27)

The owner's other website is blue, so the palette is deliberately warm. The
accent is the logo's own terracotta. Tokens in `src/styles/globals.css`:

| Token              | Role                                                      |
| ------------------ | --------------------------------------------------------- |
| `paper` / `canvas` | page background / alternate section (warm off-whites)     |
| `stone`            | borders, dividers                                         |
| `ink` / `muted`    | body / secondary text (warm charcoal; 16:1 and 7.4:1)     |
| `espresso`         | dark sections, footer, photo scrims                       |
| `accent`           | icons, rules, badges, hover tints (2.9:1: never for text) |
| `accent-dark`      | links and CTA background (5.8:1 on paper, white 6.1:1)    |
| `olive`/`-dark`    | secondary accent, scenario badges                         |
| `surface-card`     | card fill                                                 |

Other rules that changed from the PRD:

- **Mega-menu header** (PRD §13.1 said "no mega-menu in V1"): Services,
  Industries, and Company open full-width disclosure panels built from the
  content collections (`src/content/navigation.ts`). Pattern: top-level link +
  chevron button (`aria-expanded`/`aria-controls`), hover with intent on mouse,
  Escape returns focus, outside click / focus-out / navigation close. No
  `role="menu"`. Mobile: accordion groups inside the existing dialog; collapsed
  groups are not rendered so the focus trap never reaches a hidden link. The
  header has no `backdrop-filter`: that would become the containing block for
  the fixed-position dialog and clip it.
- **Motion**: `.reveal` is a CSS-only scroll-driven fade
  (`animation-timeline: view()` behind `@supports`, `screen`, and
  `prefers-reduced-motion: no-preference`); `.card-lift` is a 200 ms
  border/shadow/translate hover. No client JavaScript for motion.
- **Photo surfaces**: `Section surface="photo"` + `.photo-scrim*` utilities.
  Copy over photography is only placed where the espresso scrim is at least
  0.78 opaque, which keeps paper text above 4.5:1 on a white pixel.
- Client components are `SiteHeader` (+ `DesktopNav`/`MobileNav`) and
  `ContactForm`; everything else renders at build time.

### Copy rules

The owner does not want the site to read as machine-written. Beyond the
banned-phrase list in CONTENT-GUIDE.md: no em or en dashes in visible copy
(use commas, full stops, or "such as"); no runs of short imperative fragments;
no "**Bold lede.** explanation" paragraph templates in articles; keep hedge
words ("practical", "considered", "genuinely", "honest") rare. The Insights
articles are bylined "Fast Digital Solutions, Engineering team" (a real team
byline, not an invented person).

### Contact API contract (observed 2026-08-27)

`POST https://9jdb11lm21.execute-api.us-east-1.amazonaws.com/api/contact-message`
with the seven fields `firstName, lastName, email, company, phoneNumber,
discussionTopic, notes`. Observed response:

```
200 {"success": true, "contactId": "ct_20260827_013714_bf38d32e",
     "message": "Message received successfully.",
     "email": {"internalEmailStatus": "sent", "userEmailStatus": "sent"}}
```

Response headers: `access-control-allow-origin: https://fastdigitalsolutions.com`,
`vary: Origin`. **The gateway has no OPTIONS route** (preflight → 404), so the
form sends the JSON body as `text/plain`, a CORS "simple request" that needs
no preflight; the Lambda parses it as JSON regardless (verified). The form
treats any 2xx as success, shows `contactId` as the reference when present,
maps a 4xx `fieldErrors` body onto fields, treats 429 as the throttle state,
and everything else as the generic failure. The honeypot field is client-side
only. The endpoint is the built-in default in `site.ts`;
`NEXT_PUBLIC_CONTACT_API_URL` overrides it (the E2E build uses a mock host).

## Directory map

```
src/
├── app/                  one folder per route (+ icon.svg / icon.png / apple-icon.png)
├── components/
│   ├── ui/               Container, Section, SectionIntro, Button, Picture, PictureFrame
│   ├── layout/           SiteHeader + DesktopNav + MobileNav (client), SiteFooter, Wordmark, LogoMark, Breadcrumbs, SkipLink
│   ├── content/          PageHero, cards, tiles, timeline, CTA panel
│   ├── forms/            ContactForm (client; full state machine)
│   └── trust/            LeadershipGrid (renders null when empty)
├── content/              ALL editable content incl. image-manifest.ts (see docs/CONTENT-GUIDE.md)
├── generated/            images.ts + brand.ts, written by the scripts; do not edit
├── lib/                  schemas, loaders, metadata, fonts, image types/registry, utils
└── styles/globals.css    design tokens + base + rich-text + scrims + motion
brand/fds-logo.source.svg     the supplied logo
scripts/validate-content.ts   the build gate
scripts/build-images.ts       the image pipeline
scripts/build-brand.ts        logo paths, favicons, social image
public/images/                committed photo derivatives + og-default.<hash>.png
images/                       raw originals (gitignored)
deploy/                       nginx config + EC2 setup script
tests/unit | tests/e2e        Vitest | Playwright
```

## Testing strategy

- **Unit (Vitest)**: schema/gate logic, content integrity (slug uniqueness,
  cross-references, 900-word floor), contact validation rules and the
  seven-field payload, form state machine (200/202/429/error summary),
  mega-menu disclosure/Escape, Button semantics, env fallbacks.
- **E2E (Playwright, desktop + mobile projects)**: navigation incl. Insights,
  mega-menu open/close/Escape/outside-click/focus-out, mobile dialog +
  accordions, CTA destinations, all contact-form states against a mocked API
  (`build:e2e` bakes in a mock endpoint; Playwright intercepts it), 404,
  scenario labelling, favicon/OG tags, image markup (AVIF sources, dimensions,
  eager hero / lazy rest), no horizontal overflow at 320–1280px.
- **Accessibility**: axe-core WCAG 2.2 AA scans on the priority pages (incl.
  the Insights index and an article) plus the open mega-menu fail CI on any
  violation. Manual checks (screen reader, 200%/400% zoom, forced-colors,
  contrast over photos) are tracked in IMPLEMENTATION-STATUS.md; axe reports
  overlay contrast as "needs review", never as a violation.
