# Fast Digital Solutions — Corporate Website

Static-export Next.js website for Fast Digital Solutions, built to the
[Product Requirements Document](docs/prd/fast-digital-solutions-website-prd-v1.md)
(v1.0). Deployed to AWS EC2 via GitHub Actions.

**Documentation map**

| Document                                                       | Purpose                                      |
| -------------------------------------------------------------- | -------------------------------------------- |
| [docs/IMPLEMENTATION-STATUS.md](docs/IMPLEMENTATION-STATUS.md) | What is built vs. pending — read this first  |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)                       | CI/CD pipeline, EC2 setup, secrets, rollback |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)                   | Stack, structure, and key decisions          |
| [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)                 | Editing content and the proof-approval rules |
| [docs/prd/](docs/prd/)                                         | The authoritative PRD                        |

## Prerequisites

- **Node.js 22.x** (see `.nvmrc`; ≥ 20.9 works). `nvm use` picks the right version.
- **npm 10+** (ships with Node 22). The lockfile (`package-lock.json`) is committed — always install with `npm ci` in automation.

## Getting started

```bash
npm ci             # install exact locked dependencies
npm run dev        # local dev server at http://localhost:3000
```

## Scripts

| Command                                   | What it does                                                   |
| ----------------------------------------- | -------------------------------------------------------------- |
| `npm run dev`                             | Development server                                             |
| `npm run build`                           | Content validation gate + static production build → `out/`     |
| `npm run start:static`                    | Serve the static export locally (`npx serve out`)              |
| `npm run lint` / `npm run typecheck`      | ESLint / strict TypeScript                                     |
| `npm run test` / `npm run test:watch`     | Vitest unit tests                                              |
| `npm run build:e2e`                       | Build with a mocked contact API baked in (for E2E)             |
| `npm run test:e2e`                        | Playwright E2E + axe-core accessibility scans (build first)    |
| `npm run format` / `npm run format:check` | Prettier                                                       |
| `npm run validate:content`                | Run the content gate on its own                                |
| `npm run images`                          | Regenerate photo derivatives from `images/` (local only)       |
| `npm run brand`                           | Regenerate logo paths, favicons, and the social image          |
| `npm run check`                           | Everything CI runs: format, lint, typecheck, unit tests, build |

The static build output lands in **`out/`** — plain HTML/CSS/JS, servable by
any static host. There is no runtime Next.js server dependency.

## Environment variables

Copy `.env.example` to `.env.local` for local overrides. All variables are
**build-time** (embedded in the static output — never put secrets in them):

| Variable                             | Purpose                                                                                                                                                                                                        |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`               | Canonical origin override. Defaults to `https://fastdigitalsolutions.com` from `src/content/site.ts`; a value containing `PENDING` turns on `noindex` and empties the sitemap.                                 |
| `NEXT_PUBLIC_CONTACT_API_URL`        | Contact form endpoint override. Defaults to the production API Gateway URL in `src/content/site.ts`; the E2E build points it at a mock host, and a `PENDING` value shows the documented fallback (phone only). |
| `NEXT_PUBLIC_CONTACT_API_TIMEOUT_MS` | Contact request timeout (default 12000).                                                                                                                                                                       |

## Content editing

All content is typed data in `src/content/` (services, industries, scenarios,
careers, …) plus MDX in `src/content/insights/` and `src/content/legal/`.
**Read [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) before editing** — a
build-time gate blocks unverified proof content (client names, testimonials,
metrics, people) from ever publishing, per PRD §2.

## Branch strategy

- `hd-dev` — active implementation branch
- `dev` — integration (PR from `hd-dev`, created manually)
- `main` — production; **pushes to `main` deploy to EC2**

CI (lint, typecheck, tests, build, E2E) runs on **every pull request**, and on
`main` as the **CI gate** job inside the deploy workflow — the deploy job
declares `needs: ci`, so a commit that fails any check cannot reach production.
That gate lives in the workflow because repository branch protection requires a
paid plan for private repos.

There is no `push` trigger on `ci.yml`. Pushing to a branch with an open PR
would otherwise fire both `push` and `pull_request` for the same commit and run
everything twice. Pushing more commits to an open PR still re-runs the suite,
so nothing is lost — but a push to a branch with **no** open PR gets no CI.

## Deployment

GitHub Actions builds the static export and ships it to an EC2 instance
running Nginx (atomic release switch, last 5 releases kept for rollback).
Full runbook, required secrets, server setup, and TLS steps:
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Photography

Raw originals live in the gitignored `images/` folder; what ships is generated
by `npm run images` into `public/images/` (AVIF + WebP, hashed filenames) plus
a typed record in `src/generated/images.ts`, both committed. The build fails if
the manifest and the derivatives drift apart or if any photo is used twice.
How to add or replace a photo: [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md).

## Brand assets

The logo source is `brand/fds-logo.source.svg`; `npm run brand` derives the
header/footer mark, favicons, and the social-share image from it. Outputs are
committed and the build fails if the icons are missing.

## Proof-approval rules

Nothing may be invented to fill trust content (clients, testimonials,
metrics, people); see [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md), which
also carries the writing rules (no em dashes, no machine-sounding patterns).

## Contact-form integration contract

The frontend POSTs the seven documented fields (`firstName, lastName, email,
company, phoneNumber, discussionTopic, notes`) to the API Gateway endpoint in
`src/content/site.ts` and treats any 2xx as success, a 4xx `fieldErrors` body
as field errors, 429 as throttling, and everything else (or a timeout) as the
generic failure. The body is sent as `text/plain` to avoid a CORS preflight the
gateway does not answer — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Troubleshooting

| Symptom                                                           | Cause / fix                                                                                                                                                 |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build fails with `CONTENT VALIDATION FAILED`                      | A content rule was violated (duplicate slug, unverified proof marked approved, missing field). The message names the record; fix the content, not the gate. |
| Contact page shows "Online enquiries are temporarily unavailable" | `NEXT_PUBLIC_CONTACT_API_URL` was set to a `PENDING` placeholder — intended fallback.                                                                       |
| Build fails with `images/<id>: … run npm run images`              | The photo manifest changed (or a derivative is missing). Run `npm run images` locally and commit `public/images` + `src/generated/images.ts`.               |
| `npm run test:e2e` fails immediately                              | The E2E suite serves `out/`; run `npm run build:e2e` first.                                                                                                 |
| Every page is `noindex`                                           | `NEXT_PUBLIC_SITE_URL` was overridden with a `PENDING` value.                                                                                               |
| Windows: Prettier check fails on line endings                     | `.gitattributes` forces LF; re-clone or run `git add --renormalize .`                                                                                       |

