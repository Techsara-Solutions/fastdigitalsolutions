# Architecture

## Stack

| Layer     | Choice                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router), React 19, **static export** (`output: "export"`, `trailingSlash: true`) |
| Language  | TypeScript, `strict` + `noUncheckedIndexedAccess`                                                |
| Styling   | Tailwind CSS 4 (CSS-first `@theme` tokens in `src/styles/globals.css`)                           |
| Content   | Typed TS modules + MDX (insights/legal), validated with Zod                                      |
| MDX       | `next-mdx-remote/rsc` + `gray-matter`, compiled at build time                                    |
| Images    | Build-time pipeline (`sharp`) → committed AVIF/WebP derivatives + typed record                   |
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
  dynamic route to generate ≥1 path, but article paths exist only for
  approved articles — which is legitimately zero at launch. The empty-slug
  variant is the index page, so the route always generates.
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
certifications, or claims — ever. Enforced in three layers:

1. **Schema**: every proof record carries `publishStatus`/`verified`
   (`src/lib/schemas.ts`); scenarios are structurally `illustrative: true`.
2. **Build gate**: `scripts/validate-content.ts` runs before every build
   (`prebuild`) and **fails** on: approved-but-unverified proof, approved
   records without an `approvalReference`, duplicate/invalid slugs, broken
   cross-references, approved insights under 900 words or with placeholder
   authors, missing legal files, and any photography problem (below).
3. **Render gate**: components only ever receive `getPublished*()` filtered
   data; trust components render `null` with no publishable records; the
   Insights nav item appears only at ≥3 published articles.

### Identity data

`src/content/site.ts` is the single source of identity data: the short brand
name (`brandName` — wordmark, navigation, titles), the registered entity
(`legalName: "Fast Digital Solutions LLC"` — footer copyright, legal pages,
consent text, JSON-LD), the live domain, email, phone, mailing address, and the
production contact endpoint. Any value still containing `PENDING` drives build
warnings, `noindex`, an empty sitemap, and withheld JSON-LD.

### Image pipeline (V2, 2026-08-27)

Raw photography lives in a gitignored repo-root `images/` folder (~110 MB of
licensed Pexels originals; licence log in [IMAGE-LICENSES.md](IMAGE-LICENSES.md),
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
  mirrors the focal point.
- **Formats**: AVIF + WebP only (a documented deviation from PRD §20.6's
  JPEG fallback — every shipping browser decodes both; the `<img src>` fallback
  is the mid-width WebP). Filenames carry a content hash, so nginx serves
  `/images/` with a one-year immutable cache.
- **Rendering**: `PictureFrame` (plain markup) / `Picture` (server, resolves an
  id and hoists a `<link rel="preload">` for the page's one `priority` image).
  Not `next/image` — with `unoptimized` it emits a single `<img>` with no
  srcset or format negotiation.
- **Rule: every photograph appears once site-wide**; the validator enforces
  unique sources. The one global CTA band photo counts as a single placement.
- The photos are licensed workplace imagery, never presented as our team or
  clients (alt text describes what is shown).

### Design system V2 — "cool corporate" (2026-08-27)

Replaces the PRD §15 "Warm Precision" brown palette at the owner's request so
the photography (neutral/cool daylight, dark tech tones) and the palette read
as one system. Tokens in `src/styles/globals.css`:

| Token              | Role                                          |
| ------------------ | --------------------------------------------- |
| `paper` / `canvas` | page background / alternate section           |
| `stone`            | borders, dividers                             |
| `ink` / `muted`    | body / secondary text (17.4:1 and 7.6:1)      |
| `navy`             | dark sections, footer, photo scrims           |
| `accent`           | links, icons, focus (4.9:1 on paper)          |
| `accent-dark`      | primary CTA background (white text 8.7:1)     |
| `teal`/`teal-dark` | secondary accent, scenario badges             |
| `surface-card`     | card fill (replaces the old `bg-white/40–50`) |

Other rules that changed from the PRD:

- **Mega-menu header** (PRD §13.1 said "no mega-menu in V1"): Services,
  Industries, and Company open full-width disclosure panels built from the
  content collections (`src/content/navigation.ts`). Pattern: top-level link +
  chevron button (`aria-expanded`/`aria-controls`), hover with intent on mouse,
  Escape returns focus, outside click / focus-out / navigation close. No
  `role="menu"`. Mobile: accordion groups inside the existing dialog; collapsed
  groups are not rendered so the focus trap never reaches a hidden link.
- **Motion**: `.reveal` is a CSS-only scroll-driven fade
  (`animation-timeline: view()` behind `@supports` and
  `prefers-reduced-motion: no-preference`); `.card-lift` is a 200 ms
  border/shadow/translate hover. No client JavaScript for motion.
- **Photo surfaces**: `Section surface="photo"` + `.photo-scrim*` utilities.
  Copy over photography is only placed where the navy scrim is ≥ 0.78 opaque,
  which keeps paper text above 4.5:1 on a white pixel; `PageHero` full-bleed
  uses `text-wrap: pretty` and a 46rem column for that reason.
- Client components are `SiteHeader` (+ `DesktopNav`/`MobileNav`) and
  `ContactForm`; everything else renders at build time.

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
form sends the JSON body as `text/plain` — a CORS "simple request" that needs
no preflight; the Lambda parses it as JSON regardless (verified). The form
treats any 2xx as success, shows `contactId` as the reference when present,
maps a 4xx `fieldErrors` body onto fields, treats 429 as the throttle state,
and everything else as the generic failure. `consent` and the honeypot are
client-side only. The endpoint is the built-in default in `site.ts`;
`NEXT_PUBLIC_CONTACT_API_URL` overrides it (the E2E build uses a mock host).

## Directory map

```
src/
├── app/                  one folder per route
├── components/
│   ├── ui/               Container, Section, SectionIntro, Button, Picture, PictureFrame
│   ├── layout/           SiteHeader + DesktopNav + MobileNav (client), SiteFooter, Breadcrumbs, SkipLink, Wordmark
│   ├── content/          PageHero, cards, tiles, timeline, CTA panel, MDX page shells
│   ├── forms/            ContactForm (client; full state machine)
│   └── trust/            data-gated proof components (render null when empty)
├── content/              ALL editable content incl. image-manifest.ts (see docs/CONTENT-GUIDE.md)
├── generated/images.ts   generated by npm run images — do not edit
├── lib/                  schemas, loaders, metadata, fonts, image types/registry, utils
└── styles/globals.css    design tokens + base + rich-text + scrims + motion
scripts/validate-content.ts   the build gate
scripts/build-images.ts       the image pipeline
public/images/                committed photo derivatives
images/                       raw originals (gitignored)
deploy/                       nginx config + EC2 setup script
tests/unit | tests/e2e        Vitest | Playwright
```

## Testing strategy

- **Unit (Vitest)**: schema/gate logic, content integrity (slug uniqueness,
  cross-references, 900-word floor), contact validation rules and the
  seven-field payload, form state machine (200/202/429/error summary),
  mega-menu disclosure/Escape, Button semantics, env fallbacks.
- **E2E (Playwright, desktop + mobile projects)**: navigation, mega-menu
  open/close/Escape/outside-click/focus-out, mobile dialog + accordions,
  CTA destinations, all contact-form states against a mocked API (`build:e2e`
  bakes in a mock endpoint; Playwright intercepts it), 404, scenario
  labelling, image markup (AVIF sources, dimensions, eager hero / lazy rest),
  no horizontal overflow at 320–1280px.
- **Accessibility**: axe-core WCAG 2.2 AA scans on 11 priority pages plus the
  open mega-menu fail CI on any violation. Manual checks (screen reader,
  200%/400% zoom, forced-colors, contrast over photos) are tracked in
  IMPLEMENTATION-STATUS.md — axe reports overlay contrast as "needs review",
  never as a violation.
