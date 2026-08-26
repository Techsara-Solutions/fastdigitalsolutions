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
| `npm run check`                           | Everything CI runs: format, lint, typecheck, unit tests, build |

The static build output lands in **`out/`** — plain HTML/CSS/JS, servable by
any static host. There is no runtime Next.js server dependency.

## Environment variables

Copy `.env.example` to `.env.local` for local overrides. All variables are
**build-time** (embedded in the static output — never put secrets in them):

| Variable                             | Purpose                                                                                                                                                                           |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`               | Canonical origin. While it contains `PENDING`, every page is `noindex`, the sitemap is empty, and Organization JSON-LD is withheld.                                               |
| `NEXT_PUBLIC_CONTACT_API_URL`        | Contact form endpoint (built by a separate backend developer). When unset, the contact page shows a documented fallback (form unavailable, phone shown) instead of a broken form. |
| `NEXT_PUBLIC_CONTACT_API_TIMEOUT_MS` | Contact request timeout (default 12000).                                                                                                                                          |

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

CI (lint, typecheck, tests, build, E2E) runs standalone on every pull request
and on pushes to `dev` and `hd-dev`. On `main` it runs as the **CI gate** job
inside the deploy workflow: the deploy job declares `needs: ci`, so a commit
that fails any check cannot reach production. That gate lives in the workflow
because repository branch protection requires a paid plan for private repos.

## Deployment

GitHub Actions builds the static export and ships it to an EC2 instance
running Nginx (atomic release switch, last 5 releases kept for rollback).
Full runbook, required secrets, server setup, and TLS steps:
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Placeholder and proof-approval rules

The company's domain, email, legal name, and logo are **pending**. The build
prints a warning block listing every unresolved placeholder; all of them are
production launch blockers (PRD §32.1). Nothing may be invented to fill them —
see [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md).

## Contact-form integration contract

The frontend POSTs JSON to `NEXT_PUBLIC_CONTACT_API_URL` and handles
`202 / 422 / 429 / 5xx / timeout` exactly as specified in PRD §22.3. The
backend (API Gateway → Lambda → SES) is owned by a separate developer; the
frontend never sends trusted fields (timestamp, IP, verification status).

## Troubleshooting

| Symptom                                                           | Cause / fix                                                                                                                                                 |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build fails with `CONTENT VALIDATION FAILED`                      | A content rule was violated (duplicate slug, unverified proof marked approved, missing field). The message names the record; fix the content, not the gate. |
| Contact page shows "Online enquiries are temporarily unavailable" | `NEXT_PUBLIC_CONTACT_API_URL` is unset — intended fallback per PRD §22.6.                                                                                   |
| `npm run test:e2e` fails immediately                              | The E2E suite serves `out/`; run `npm run build:e2e` first.                                                                                                 |
| Every page is `noindex`                                           | `NEXT_PUBLIC_SITE_URL` still contains `PENDING` — intended until the real domain exists.                                                                    |
| Windows: Prettier check fails on line endings                     | `.gitattributes` forces LF; re-clone or run `git add --renormalize .`                                                                                       |
