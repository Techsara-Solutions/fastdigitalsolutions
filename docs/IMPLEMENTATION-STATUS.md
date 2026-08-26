# Implementation Status

**Last updated: 2026-08-27** · Update this file whenever the state changes.

Legend: ✅ built and verified · 🚧 built, needs external input to finish ·
⏳ blocked on owner/third-party input · ❌ not started (deliberately)

## Summary

Version 1 of the website is **fully built and now hosted**: all 22 routes, the
design system, the contact form with every specified state, the
content-credibility gate, the test suite (29 unit + 45 E2E/accessibility tests,
all passing), the CI pipeline, and the EC2 deployment pipeline.

**The site is live at http://44.197.228.225/** — Amazon Linux 2023 + nginx,
serving all routes with security headers, compression, and asset caching
verified from the public internet. Crawlers are deliberately blocked until a
real domain exists.

What stands between this and a public production launch is **not code** — it
is the owner-supplied inputs and verifications listed under
[Production blockers](#production-blockers-prd-321).

## Foundation and tooling

| Item                                                                       | Status | Notes                                                        |
| -------------------------------------------------------------------------- | ------ | ------------------------------------------------------------ |
| Next.js 16 static export (no server runtime)                               | ✅     | `next.config.ts` per PRD §20.2                               |
| TypeScript strict, ESLint, Prettier                                        | ✅     | all clean                                                    |
| Tailwind 4 design tokens (Warm Precision palette, type scale, breakpoints) | ✅     | PRD §15.3–15.5; added `olive-dark` for AA contrast           |
| Self-hosted variable fonts (Manrope, Source Serif 4)                       | ✅     | latin subsets, `font-display: swap`, no third-party requests |
| Content schemas + build-blocking validation gate                           | ✅     | `scripts/validate-content.ts`; runs on every build           |
| Placeholder warning system                                                 | ✅     | build prints every unresolved production placeholder         |

## Pages (PRD §12.3 launch gates)

| Route                           | Status | Notes                                                                                   |
| ------------------------------- | ------ | --------------------------------------------------------------------------------------- |
| Home (10 sections A–J)          | ✅     | Insights preview auto-appears at ≥3 approved articles                                   |
| Services index                  | ✅     |                                                                                         |
| 6 service detail pages          | ✅     | full §14.3 template incl. "what we don't promise"                                       |
| Industries                      | ✅     | 4 industries, challenge-led copy                                                        |
| Work                            | ✅     | State A: 3 labelled representative scenarios; case-study rendering ready for States B/C |
| How We Work                     | ✅     | 5 stages, commitments, engagement models, after-enquiry sequence                        |
| About                           | ✅     | leadership section auto-appears when real profiles exist                                |
| Contact                         | ✅     | form + fallback state (fallback currently active — no API URL)                          |
| Careers                         | ✅     | honest no-open-roles state; role rendering built                                        |
| Insights index                  | ✅     | out of primary nav until 3 approved articles (gate automated)                           |
| 3 Insights articles             | 🚧     | fully drafted (900+ words each); need real authors + owner approval                     |
| Privacy / Terms / Accessibility | 🚧     | drafted with visible draft banner; **need legal review**                                |
| Custom 404                      | ✅     |                                                                                         |
| robots.txt / sitemap.xml        | ✅     | noindex/empty until real domain is configured                                           |

## Contact experience (PRD §22)

| Item                                                                           | Status | Notes                                                  |
| ------------------------------------------------------------------------------ | ------ | ------------------------------------------------------ |
| Full field spec incl. honeypot + consent                                       | ✅     |                                                        |
| All 7 states (idle/validation/submitting/202/422/429/timeout/5xx)              | ✅     | unit + E2E tested against mocked API                   |
| Accessibility behavior (error summary focus, live regions, value preservation) | ✅     |                                                        |
| No-backend fallback state                                                      | ✅     | active until the API URL is provided                   |
| Real backend (API Gateway → Lambda → SES)                                      | ⏳     | **separate developer**; frontend contract in PRD §22.3 |
| End-to-end test against the real endpoint                                      | ⏳     | after backend exists                                   |

## Quality (PRD §28–29)

| Item                                                            | Status | Notes                                                       |
| --------------------------------------------------------------- | ------ | ----------------------------------------------------------- |
| Unit tests (29)                                                 | ✅     | schemas, gating, content integrity, form logic              |
| Playwright E2E (45, desktop + mobile)                           | ✅     | nav, mobile menu focus/Escape, form states, 404, overflow   |
| Automated a11y: axe WCAG 2.2 AA on 11 pages                     | ✅     | zero violations; enforced in CI                             |
| Manual a11y pass (screen reader, 200%/400% zoom, forced colors) | ⏳     | required before launch (PRD §28.7) — automated ≠ sufficient |
| Cross-browser smoke (Chrome/Edge/Firefox/Safari)                | ⏳     | manual, before launch (PRD §28.5)                           |
| Lighthouse ≥90 on representative pages                          | ⏳     | run against the deployed site before launch                 |
| Content QA sweep (PRD §28.3)                                    | ⏳     | after placeholders are resolved                             |

## CI/CD and operations

| Item                                                    | Status | Notes                                                            |
| ------------------------------------------------------- | ------ | ---------------------------------------------------------------- |
| CI workflow (format/lint/typecheck/tests/build/E2E)     | ✅     | passing on hd-dev and dev                                        |
| Deploy workflow (main → EC2, atomic releases, rollback) | ✅     | secrets configured; fires on the first merge to `main`           |
| EC2 server provisioned (Amazon Linux 2023 + nginx)      | ✅     | `44.197.228.225`; setup script re-runnable                       |
| Nginx config (security headers, caching, gzip, 404)     | ✅     | verified over the public internet                                |
| First deployment (performed manually to validate)       | ✅     | release `20260826185249-5877ef2`, 133 files                      |
| GitHub secrets (EC2_HOST / EC2_USER / EC2_SSH_KEY)      | ✅     | set via `gh secret set`, key read from disk                      |
| EC2 setup script + runbook                              | ✅     | `deploy/setup-ec2.sh`, `docs/DEPLOYMENT.md`                      |
| Dependabot (npm + actions)                              | ✅     |                                                                  |
| **Elastic IP**                                          | ⏳     | **recommended now** — current IP changes on instance stop/start  |
| Branch protection on `main`                             | ⏳     | enable in GitHub settings (require CI + review)                  |
| Automated deploy proven end to end                      | ⏳     | happens on the first `main` merge; server side already validated |
| TLS + canonical host redirects                          | ⏳     | after domain purchase (runbook ready)                            |
| Restrict SSH (port 22) to trusted IPs                   | ⏳     | security-group hardening                                         |

## Production blockers (PRD §32.1)

Every item below must be resolved before public launch. None can be invented.

- [ ] Exact legal company name and entity type → `src/content/site.ts`
- [ ] Formation evidence + confirmation of the "Serving clients since 2023" wording
- [ ] Purchased production domain → `NEXT_PUBLIC_SITE_URL` variable + site.ts
- [ ] Domain-based email addresses → site.ts (footer/contact email appear automatically)
- [ ] Internal enquiry-recipient inbox (backend side)
- [ ] Contact API production endpoint → `NEXT_PUBLIC_CONTACT_API_URL` variable
- [ ] Final logo + favicon + social-share image → `public/` (wordmark used meanwhile)
- [ ] Legal review of Privacy / Terms / Accessibility (drafts ready) → flip `reviewStatus`
- [ ] Confirmed form-data retention and deletion process (provisional: 12 months)
- [ ] Business hours decision (only shown if operationally accurate)
- [ ] AWS / domain / GitHub / billing ownership documented
- [ ] Real authors assigned + approval for the 3 Insights articles (optional for launch; Insights stays out of nav otherwise)

## Optional trust content (PRD §32.2 — site launches fine without)

- [ ] Client names + written logo permissions
- [ ] Approved testimonials (real people, roles, permission archived)
- [ ] Case-study facts and approved outcomes
- [ ] Certifications / partner statuses with verification
- [ ] Leadership names, bios, headshots, profile URLs

All rendering for these already exists and activates automatically when
verified records are added — see docs/CONTENT-GUIDE.md.

## Hosting — done (2026-08-27)

EC2 provisioning, nginx configuration, the first deployment, and the GitHub
secrets are all complete. See [DEPLOYMENT.md](DEPLOYMENT.md) for the
environment details and the manual runbook.

Remaining infrastructure actions, in priority order:

1. **Allocate an Elastic IP** and update the `EC2_HOST` secret — without it the
   address changes if the instance is ever stopped.
2. **Restrict port 22** in the security group to trusted IPs.
3. **Enable branch protection** on `main` (require CI + a review).
4. Later: the purchased **domain** (then TLS via certbot) and the **contact API
   URL** from the backend developer.

## Deviations from the PRD (agreed)

| PRD                     | Deviation                                                                                                          | Recorded        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------- |
| §23 AWS Amplify Hosting | EC2 + Nginx via GitHub Actions, at owner request (2026-08-26)                                                      | ARCHITECTURE.md |
| §15.3 palette           | Added `olive-dark` token — base olive failed WCAG AA for small badge text (a possibility §15.3 itself anticipated) | ARCHITECTURE.md |
| §12.2 route file layout | Insights implemented as one optional catch-all route (static-export constraint); public URLs unchanged             | ARCHITECTURE.md |
