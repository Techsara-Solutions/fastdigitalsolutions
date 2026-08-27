import type { ImageSlot } from "@/lib/image-types";

/**
 * Photography manifest — one entry per placement on the site.
 *
 * Rules (docs/CONTENT-GUIDE.md § Images):
 * - every source file is used exactly once (the validator enforces it);
 * - coordinates are measured on the original file before any flip;
 * - alt text describes the photo honestly — these are licensed stock images of
 *   workplaces, never presented as our team or clients;
 * - after editing, run `npm run images` and commit `public/images` together
 *   with `src/generated/images.ts`.
 *
 * Bump PIPELINE_VERSION when the class width/quality tables change so the
 * validator forces a regeneration.
 */
export const PIPELINE_VERSION = 1;

const S = "02-services";
const I = "03-industries";
const C = "04-team-candids";

export const imageManifest: readonly ImageSlot[] = [
  /* ---------------------------------------------------------------- home */
  {
    id: "hero-home",
    source: `${I}/technology-saas/tech-saas-01-three-people-desk-window--pexels-7653473.jpg`,
    class: "hero",
    aspect: "16:9",
    focus: { x: 0.5, y: 0.5 },
    ops: { flip: true },
    alt: "Three colleagues working on laptops at a shared desk beside a bright office window.",
  },
  {
    id: "card-service-cloud",
    source: `${S}/cloud-platform-engineering/cloud-01-fibre-patch-panel--pexels-4682189.jpg`,
    class: "card",
    aspect: "3:2",
    alt: "Close-up of fibre-optic cables plugged into a network patch panel.",
  },
  {
    id: "card-service-ai",
    source: `${S}/ai-data-automation/ai-data-02-analytics-dashboard-overhead--pexels-577195.jpg`,
    class: "card",
    aspect: "3:2",
    focus: { x: 0.5, y: 0.45 },
    alt: "Overhead view of a laptop showing an analytics dashboard with charts.",
  },
  {
    id: "card-service-software",
    source: `${S}/software-engineering-modernization/software-01-developer-dual-monitors--pexels-16129703.jpg`,
    class: "card",
    aspect: "3:2",
    focus: { x: 0.55, y: 0.45 },
    ops: {
      blurRegions: [
        { x: 1500, y: 2150, w: 130, h: 110 },
        { x: 3890, y: 2310, w: 130, h: 110 },
        { x: 1560, y: 2950, w: 290, h: 80 },
      ],
    },
    alt: "A developer seen from behind, working across two monitors of code.",
  },
  {
    id: "card-service-quality",
    source: `${S}/quality-engineering-test-automation/quality-01-phone-app-laptop-code--pexels-892769.jpg`,
    class: "card",
    aspect: "3:2",
    alt: "A phone showing an app screen held in front of a laptop displaying code.",
  },
  {
    id: "card-service-support",
    source: `${S}/application-maintenance-managed-support/support-01-headset-engineer-desk--pexels-5453921.jpg`,
    class: "card",
    aspect: "3:2",
    alt: "An engineer wearing a headset at a desk with a monitor, talking with a colleague.",
  },
  {
    id: "card-service-teams",
    source: `${S}/flexible-delivery-teams/teams-01-five-people-meeting-table--pexels-7988664.jpg`,
    class: "card",
    aspect: "3:2",
    alt: "Five people with laptops working together around a meeting table.",
  },
  {
    id: "tile-industry-technology-saas",
    source: `${I}/technology-saas/tech-saas-02-three-colleagues-laptop--pexels-39204862.jpg`,
    class: "tile",
    aspect: "4:3",
    alt: "Three colleagues gathered around one laptop in an office.",
  },
  {
    id: "tile-industry-retail",
    source: `${S}/quality-engineering-test-automation/quality-02-phone-vs-laptop-check--pexels-20044369.jpg`,
    class: "tile",
    aspect: "4:3",
    focus: { x: 0.665, y: 0.52 },
    ops: {
      zoom: 1.35,
      saturation: 0.85,
      blurRegions: [{ x: 1180, y: 0, w: 560, h: 900, sigma: 20 }],
    },
    alt: "Someone comparing a shopping app on a phone with the same storefront on a laptop.",
  },
  {
    id: "tile-industry-logistics",
    source: `${S}/ai-data-automation/ai-data-01-laptop-map-analysis--pexels-8441819.jpg`,
    class: "tile",
    aspect: "4:3",
    focus: { x: 0.45, y: 0.5 },
    alt: "A laptop showing a regional map with percentage markers, next to printed forms.",
  },
  {
    id: "tile-industry-professional-services",
    source: `${C}/candid-02-office-planning-board--pexels-7428212.jpg`,
    class: "tile",
    aspect: "4:3",
    focus: { x: 0.45, y: 0.5 },
    ops: { zoom: 1.15, blurRegions: [{ x: 4650, y: 1080, w: 988, h: 440, sigma: 22 }] },
    alt: "Three people in a bright office, one writing notes at a desk with a laptop.",
  },
  {
    id: "band-cta",
    source: "05-cta-band/cta-01-blue-hour-tower-sky--pexels-303335.jpg",
    class: "band",
    aspect: "2.4:1",
    focus: { x: 0.5, y: 0.55 },
    decorative: true,
    alt: "",
  },

  /* ---------------------------------------------------- section heroes */
  {
    id: "hero-services",
    source: `${S}/cloud-platform-engineering/cloud-03-server-rack-blue--pexels-17489157.jpg`,
    class: "hero",
    aspect: "16:9",
    ops: { saturation: 0.8 },
    decorative: true,
    alt: "",
  },
  {
    id: "hero-industries",
    source: `${S}/flexible-delivery-teams/teams-03-team-review-laptop--pexels-5256817.jpg`,
    class: "feature",
    aspect: "4:3",
    alt: "A team reviewing documents and a laptop together at a table.",
  },
  {
    id: "hero-how-we-work",
    source: `${C}/candid-01-whiteboard-sticky-notes--pexels-7792859.jpg`,
    class: "feature",
    aspect: "4:3",
    alt: "Colleagues arranging sticky notes on a whiteboard during a planning session.",
  },
  {
    id: "feature-how-we-work-stages",
    source: `${C}/candid-03-sketching-flow-notebook--pexels-7278587.jpg`,
    class: "feature",
    aspect: "4:3",
    alt: "Hands sketching a flow diagram in a notebook beside a laptop.",
  },
  {
    id: "hero-about",
    source: `${C}/candid-04-two-colleagues-desk-plants--pexels-36765663.jpg`,
    class: "feature",
    aspect: "4:3",
    alt: "Two colleagues talking at a desk in an office with plants.",
  },
  {
    id: "hero-work",
    source: `${S}/software-engineering-modernization/software-02-developer-html-monitor--pexels-7988081.jpg`,
    class: "feature",
    aspect: "4:3",
    focus: { x: 0.5, y: 0.4 },
    alt: "A developer at a desk reading markup on a large monitor.",
  },
  {
    id: "hero-careers",
    source: `${S}/software-engineering-modernization/software-06-laptop-code-notebook--pexels-4841641.jpg`,
    class: "feature",
    aspect: "4:3",
    focus: { x: 0.5, y: 0.4 },
    alt: "Hands typing on a laptop next to an open notebook and pen.",
  },
  {
    id: "hero-contact",
    source: `${S}/application-maintenance-managed-support/support-03-headset-on-monitor--pexels-8867229.jpg`,
    class: "feature",
    aspect: "4:3",
    focus: { x: 0.5, y: 0.4 },
    alt: "A headset resting on top of a monitor at a tidy desk.",
  },
  {
    id: "hero-insights",
    source:
      "07-insights/document-heavy-operations/insight-docs-01-stack-of-folders--pexels-6567865.jpg",
    class: "feature",
    aspect: "4:3",
    focus: { x: 0.5, y: 0.5 },
    alt: "Hands holding a stack of coloured document folders.",
  },

  /* ------------------------------------------------ service detail heroes */
  {
    id: "hero-service-cloud-platform-engineering",
    source: `${S}/cloud-platform-engineering/cloud-02-server-racks-leds--pexels-5050305.jpg`,
    class: "feature",
    aspect: "4:3",
    alt: "Rows of server racks with status LEDs in a data centre.",
  },
  {
    id: "hero-service-ai-data-automation",
    source: `${S}/ai-data-automation/ai-data-03-data-screens-desk--pexels-36598869.jpg`,
    class: "feature",
    aspect: "4:3",
    focus: { x: 0.55, y: 0.5 },
    ops: { blurRegions: [{ x: 120, y: 100, w: 280, h: 680, sigma: 12 }] },
    alt: "A desk with monitors showing data tables and charts, a hand on the keyboard.",
  },
  {
    id: "hero-service-software-engineering-modernization",
    source: `${S}/software-engineering-modernization/software-03-dual-monitors-code-front--pexels-16129724.jpg`,
    class: "feature",
    aspect: "4:3",
    focus: { x: 0.45, y: 0.5 },
    ops: {
      blurRegions: [
        { x: 1550, y: 2530, w: 150, h: 120 },
        { x: 3740, y: 2070, w: 140, h: 110 },
      ],
    },
    alt: "A developer typing at a desk with two monitors of code and a terminal.",
  },
  {
    id: "hero-service-quality-engineering",
    source: `${S}/quality-engineering-test-automation/quality-03-flowchart-tablet-stylus--pexels-34212988.jpg`,
    class: "feature",
    aspect: "4:3",
    ops: { saturation: 0.75 },
    alt: "A flowchart drawn on a tablet with a stylus, next to sticky notes and code.",
  },
  {
    id: "hero-service-application-maintenance-support",
    source: `${S}/application-maintenance-managed-support/support-02-support-team-headsets-room--pexels-7682106.jpg`,
    class: "feature",
    aspect: "4:3",
    alt: "A support team wearing headsets working together in a bright meeting room.",
  },
  {
    id: "hero-service-flexible-delivery-teams",
    source: `${S}/flexible-delivery-teams/teams-02-three-people-laptops--pexels-7988661.jpg`,
    class: "feature",
    aspect: "4:3",
    alt: "Three people working side by side on laptops.",
  },

  /* ------------------------------------------------------------ navigation */
  {
    id: "nav-services",
    source: `${S}/software-engineering-modernization/software-04-code-screen-detail--pexels-4439901.jpg`,
    class: "thumb",
    aspect: "3:2",
    alt: "Close-up of source code on a dark screen.",
  },
  {
    id: "nav-company",
    source: "05-cta-band/cta-02-glass-towers-dusk--pexels-18106080.jpg",
    class: "thumb",
    aspect: "3:2",
    focus: { x: 0.5, y: 0.55 },
    alt: "Glass office towers reflecting the sky at dusk.",
  },

  /* ---------------------------------------------------- insight covers */
  {
    id: "cover-insight-where-ai-automation-creates-value",
    source:
      "07-insights/document-heavy-operations/insight-docs-02-office-copier--pexels-9301897.jpg",
    class: "cover",
    aspect: "16:9",
    focus: { x: 0.5, y: 0.6 },
    alt: "A person operating an office copier with the lid raised.",
  },
  {
    id: "cover-insight-quality-engineering-in-delivery",
    source: `${S}/software-engineering-modernization/software-05-code-closeup-bokeh--pexels-6424585.jpg`,
    class: "cover",
    aspect: "16:9",
    alt: "Close-up of code on a screen with a shallow depth of field.",
  },
  {
    id: "cover-insight-aws-migration-readiness-checklist",
    source: `${S}/cloud-platform-engineering/cloud-04-network-switch-ports--pexels-13963756.jpg`,
    class: "cover",
    aspect: "16:9",
    alt: "Close-up of Ethernet cables connected to a network switch.",
  },
];
