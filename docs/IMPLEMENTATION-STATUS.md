# Implementation Status

**Last updated: 2026-08-27** · Update this file whenever the state changes.

Legend: ✅ built and verified · 🚧 built, needs external input to finish ·
⏳ blocked on owner/third-party input · ❌ not started (deliberately)

## Summary

**V2 of the website is built** on top of the V1 foundation: a cool corporate
palette, photography on every page (32 licensed photos through a build-time
pipeline), a Robert Half–style mega-menu header, the finalised legal name
(Fast Digital Solutions LLC), the live domain baked in, and the contact form
rewired to the production API (seven fields, verified with a live POST).

The site is live at **https://fastdigitalsolutions.com** (Cloudflare → nginx on
EC2). Quality gates on this branch: 45 unit tests, the Playwright E2E +
axe-core suite (desktop + mobile), typecheck, lint, format, and the content
gate all pass.

**Two server-side actions are needed before the enquiry form works in a
browser** — see [Production blockers](#production-blockers).

## V2 upgrade (2026-08-27)

| Item                                                                                 | Status | Notes                                                                                                                             |
| ------------------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Cool corporate palette (`navy`, `accent`, `teal`, `surface-card`)                    | ✅     | tokens in `globals.css`; all pairs AA; axe clean on 11 pages + open menu                                                          |
| Image pipeline (`npm run images`, sharp → AVIF/WebP, hashed, committed)              | ✅     | 32 photos → 206 files, 5.2 MB; largest card 87 KB; build gate checks drift/size/uniqueness                                        |
| Every photo used exactly once; blur/crop/flip retouching                             | ✅     | HP badges, ticker names, flipchart text, branded can removed; hero mirrored for copy space                                        |
| `PageHero` (full-bleed / split / text) replacing 9 inline heroes                     | ✅     | one `priority` + preloaded image per page; rest lazy with explicit dimensions                                                     |
| Photo cards (services), photo tiles (industries), photo CTA band, insight covers     | ✅     |                                                                                                                                   |
| Mega-menu header (Services / Industries / Company) + mobile accordions               | ✅     | disclosure pattern, Escape/outside/focus-out close; E2E + unit + axe                                                              |
| Deeper footer (Services · Industries · Company · Contact), LLC copyright             | ✅     |                                                                                                                                   |
| Subtle motion (CSS-only scroll reveal, card lift), reduced-motion honoured           | ✅     | no client JS for motion; disabled for print                                                                                       |
| "Serving clients since 2023" removed everywhere; `foundingDate` dropped from JSON-LD | ✅     |                                                                                                                                   |
| Legal name in footer ©, legal pages, consent text, JSON-LD `legalName`               | ✅     | brand name unchanged in wordmark/nav/titles                                                                                       |
| Domain + email baked into `site.ts` → indexable, sitemap, canonicals, JSON-LD        | ✅     | `NEXT_PUBLIC_SITE_URL` is now only an override                                                                                    |
| Contact form → 7-field API, `text/plain` body (no preflight), `contactId` reference  | ✅     | live POST 2026-08-27 returned `200 {success, contactId, …}`; internal and user emails reported `sent`                             |
| nginx: `/images/` immutable cache + AVIF type; CSP `connect-src` includes the API    | 🚧     | **files updated in repo; must be installed on the server** (`deploy/setup-ec2.sh` or copy the two conf files, `nginx -t`, reload) |
| Docs: ARCHITECTURE, CONTENT-GUIDE, README, DEPLOYMENT, IMAGE-LICENSES                | ✅     |                                                                                                                                   |

## Pages

| Route                           | Status | Notes                                                                              |
| ------------------------------- | ------ | ---------------------------------------------------------------------------------- |
| Home                            | ✅     | full-bleed hero, photo service cards, dark method band, industry tiles, photo CTA  |
| Services index                  | ✅     | dark photo hero (server rack), detailed text cards                                 |
| 6 service detail pages          | ✅     | split hero with each service's second photo                                        |
| Industries                      | ✅     | split hero; text panels (photos live on the home tiles)                            |
| Work                            | ✅     | split hero; scenarios unchanged, case-study rendering ready                        |
| How We Work                     | ✅     | split hero + stages split photo                                                    |
| About                           | ✅     | split hero; leadership section auto-appears when real profiles exist               |
| Contact                         | ✅     | split hero; new form; fallback state only if the endpoint is overridden to PENDING |
| Careers                         | ✅     | split hero; honest no-open-roles state                                             |
| Insights index + 3 articles     | 🚧     | covers wired; articles still `draft` — need real authors + owner approval          |
| Privacy / Terms / Accessibility | 🚧     | now name the LLC; **still need legal review**                                      |
| Custom 404                      | ✅     |                                                                                    |

## Quality

| Item                                                                        | Status | Notes                                                                       |
| --------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------- |
| Unit tests (45)                                                             | ✅     | schemas, gating, content, form payload/states, mega-menu, env fallbacks     |
| Playwright E2E (desktop + mobile)                                           | ✅     | nav + mega-menu + mobile accordions, all form states, images, 404, overflow |
| Automated a11y: axe WCAG 2.2 AA on 11 pages + open mega-menu                | ✅     | zero violations                                                             |
| Manual a11y pass (screen reader, zoom, forced colors, contrast over photos) | ⏳     | required before sign-off — axe cannot judge text over photo scrims          |
| Cross-browser smoke (Chrome/Edge/Firefox/Safari)                            | ⏳     | manual                                                                      |
| Lighthouse ≥90 on the deployed site                                         | ⏳     | run after the nginx config is installed                                     |

## Production blockers

Do these first — without them the enquiry form cannot submit from a browser:

- [ ] **Install the updated nginx config on the EC2 host** (`deploy/nginx/security-headers.conf` adds the API origin to CSP `connect-src`; `site-locations.conf` adds the `/images/` block). Run `deploy/setup-ec2.sh` or copy both files, then `sudo nginx -t && sudo systemctl reload nginx`.
- [ ] **Backend: enable CORS on API Gateway** (OPTIONS route / CORS config with `https://fastdigitalsolutions.com`, methods POST, headers `Content-Type`). Today the preflight returns 404; the site works around it by posting `text/plain`, but a proper CORS setup is the durable fix and also lets the IP-hosted origin be added for testing if wanted.

Then, before public sign-off:

- [ ] Confirm the `hello@fastdigitalsolutions.com` mailbox exists (it is now shown in the footer, contact page, and JSON-LD)
- [ ] Legal review of Privacy / Terms / Accessibility → flip `reviewStatus` to `approved`
- [ ] Final logo + favicon + social-share image → `public/images/logo.svg` etc. (the pipeline can emit a 1200×630 OG image once the logo is final)
- [ ] Elastic IP for the instance; restrict origin ports 80/443 to Cloudflare ranges; HSTS; canonical host redirect (see DEPLOYMENT.md)
- [ ] Branch protection on `main`

## Content still wanted (site launches fine without)

- [ ] A dedicated hero photo (the current one is the mirrored office shot); real photos for retail, logistics, professional services, and the office/contact page — drop them in `images/`, update `src/content/image-manifest.ts`, run `npm run images`
- [ ] Real authors + approval for the 3 Insights articles (Insights then enters navigation automatically)
- [ ] Leadership names, bios, headshots
- [ ] Verified stats / testimonials / client logos / certifications (all rendering exists and activates when verified records are added)
- [ ] Delete `images/_rejected/` once the owner confirms the 26 rejects are not wanted (folder is local-only and gitignored)

## Follow-ups (nice to have)

- Arrow-key roving inside open mega-menu panels (Tab order is correct today)
- OG image generation in the pipeline once the logo/hero are final

## Deviations from the PRD (recorded in ARCHITECTURE.md)

| PRD                              | Deviation                                                       |
| -------------------------------- | --------------------------------------------------------------- |
| §23 AWS Amplify Hosting          | EC2 + nginx via GitHub Actions, behind Cloudflare               |
| §15 "Warm Precision" palette     | Replaced by the cool corporate palette (owner, 2026-08-27)      |
| §13.1 "no mega-menu in V1"       | Mega-menu header shipped (owner, 2026-08-27)                    |
| §15.7 photography order          | Licensed stock workplace photography, honestly described in alt |
| §20.6 JPEG fallback              | AVIF + WebP only                                                |
| §22 contact contract (11 fields) | Seven-field API, any 2xx = success, `text/plain` body           |
| §12.2 route file layout          | Insights as one optional catch-all route (static export)        |
