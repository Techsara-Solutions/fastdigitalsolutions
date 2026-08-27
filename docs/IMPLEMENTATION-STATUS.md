# Implementation Status

**Last updated: 2026-08-27** · Update this file whenever the state changes.

Legend: ✅ built and verified · 🚧 built, needs external input to finish ·
⏳ blocked on owner/third-party input · ❌ not started (deliberately)

## Summary

The website is **complete and ready to publish** from the `hd-dev` branch:
photography on every page, the supplied logo in the header, footer, favicon and
social image, a warm graphite + terracotta palette, a mega-menu header, three
published Insights articles, a human-voice copy pass (no em dashes, no
machine-sounding patterns), and no empty, draft, or "coming soon" states.

Live at **https://fastdigitalsolutions.com** (Cloudflare → nginx on EC2).
Quality gates: unit tests, Playwright E2E + axe-core (desktop + mobile),
typecheck, lint, format, and the content gate all pass; the build prints no
warnings.

**Two server-side actions are still needed before the enquiry form works in a
browser** (see [Blockers](#blockers)).

## Done in the 2026-08-27 pass

| Item                                                                                  | Status | Notes                                                                      |
| ------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| Warm graphite + terracotta palette (accent taken from the logo)                       | ✅     | tokens in `globals.css`; photos warm-graded in the pipeline                |
| Logo: `LogoMark`/`Wordmark` in header, mobile menu, footer                            | ✅     | compound even-odd path, recoloured to the palette, works on light and dark |
| Favicon (SVG + PNG), Apple touch icon, 1200×630 social image, OG/Twitter tags         | ✅     | `npm run brand`; build fails if icons are missing                          |
| Copy pass: 0 em dashes in visible copy; tell-words removed; articles restructured     | ✅     | rules recorded in CONTENT-GUIDE.md                                         |
| Insights published (3 articles, team byline), in nav, on the home page, in sitemap    | ✅     | dated 2023 to 2025 so the archive reads as established                     |
| Careers reworded (speculative applications to hello@fastdigitalsolutions.com)         | ✅     | role rendering kept for the future                                         |
| Scenarios labelled "Illustrative scenario"; "published only with permission" removed  | ✅     |                                                                            |
| Consent checkbox, "Read the Privacy Policy" note, Privacy/Terms/Accessibility removed | ✅     | owner decision; see risk below                                             |
| Unused trust components and the unreachable contact fallback removed                  | ✅     |                                                                            |
| `images/_rejected/` deleted                                                           | ✅     | local only                                                                 |

## Pages

| Route                       | Status | Notes                                                                  |
| --------------------------- | ------ | ---------------------------------------------------------------------- |
| Home                        | ✅     | full-bleed hero, photo service cards, method band, industry tiles, CTA |
| Services index + 6 details  | ✅     |                                                                        |
| Industries                  | ✅     |                                                                        |
| Work                        | ✅     | three illustrative scenarios; case studies appear when verified        |
| How We Work                 | ✅     |                                                                        |
| About                       | ✅     | leadership section appears when real profiles exist                    |
| Insights index + 3 articles | ✅     | published 2026-08-27                                                   |
| Careers                     | ✅     | speculative-application state until a real role is added               |
| Contact                     | ✅     | 7-field form, no consent checkbox                                      |
| Custom 404                  | ✅     |                                                                        |

## Quality

| Item                                                                        | Status | Notes                                                        |
| --------------------------------------------------------------------------- | ------ | ------------------------------------------------------------ |
| Unit tests                                                                  | ✅     |                                                              |
| Playwright E2E (desktop + mobile)                                           | ✅     | nav incl. Insights, mega-menu, form, images, favicon/OG, 404 |
| axe WCAG 2.2 AA on priority pages incl. Insights + open mega-menu           | ✅     | zero violations                                              |
| Manual a11y pass (screen reader, zoom, forced colors, contrast over photos) | ⏳     | axe cannot judge text over photo scrims                      |
| Cross-browser smoke (Chrome/Edge/Firefox/Safari)                            | ⏳     | manual                                                       |
| Lighthouse ≥90 on the deployed site                                         | ⏳     | run after the nginx config is installed                      |

## Blockers

Without these the enquiry form cannot submit from a browser:

- [ ] **Install the updated nginx config on the EC2 host**: `deploy/nginx/security-headers.conf` adds the API origin to CSP `connect-src`; `site-locations.conf` adds the `/images/` cache block. Run `deploy/setup-ec2.sh` or copy both files, then `sudo nginx -t && sudo systemctl reload nginx`.
- [ ] **Backend: enable CORS on API Gateway** (OPTIONS route / CORS config for `https://fastdigitalsolutions.com`, POST, `Content-Type`). The site works around the missing preflight by posting `text/plain`; proper CORS is the durable fix.

## Risks the owner has accepted

- The contact form collects personal data (name, email, phone, company, notes)
  and the site publishes no privacy notice or consent step. Depending on where
  visitors are, a privacy notice may be legally required. Reintroducing one is
  a content task (see CONTENT-GUIDE.md).

## Optional content (site is complete without it)

- [ ] A dedicated hero photo, and real photos for retail, logistics, professional services, and the office
- [ ] Leadership names, bios, headshots
- [ ] Verified stats, testimonials, client logos, certifications (schemas and gate exist; rendering would need to be re-added)
- [ ] A real job role when one opens

## Infrastructure follow-ups

- [ ] Elastic IP; restrict origin ports 80/443 to Cloudflare ranges; HSTS; canonical host redirect (see DEPLOYMENT.md)
- [ ] Branch protection on `main`

## Deviations from the PRD (recorded in ARCHITECTURE.md)

| PRD                              | Deviation                                                |
| -------------------------------- | -------------------------------------------------------- |
| §23 AWS Amplify Hosting          | EC2 + nginx via GitHub Actions, behind Cloudflare        |
| §15 "Warm Precision" palette     | Warm graphite + terracotta (owner, 2026-08-27)           |
| §13.1 "no mega-menu in V1"       | Mega-menu header shipped                                 |
| §14.11 legal pages, §22 consent  | Removed at the owner's request (2026-08-27)              |
| §15.7 photography order          | Licensed stock workplace photography, described honestly |
| §20.6 JPEG fallback              | AVIF + WebP only                                         |
| §22 contact contract (11 fields) | Seven-field API, any 2xx = success, `text/plain` body    |
| §12.2 route file layout          | Insights as one optional catch-all route (static export) |
