import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Automated accessibility checks with axe-core on priority pages
 * (PRD §19.6, §28.1). Automated passes are necessary but not sufficient —
 * manual keyboard, screen-reader, zoom, and contrast checks are tracked in
 * docs/IMPLEMENTATION-STATUS.md.
 */

const PRIORITY_PAGES = [
  "/",
  "/services/",
  "/services/cloud-platform-engineering/",
  "/industries/",
  "/work/",
  "/how-we-work/",
  "/about/",
  "/careers/",
  "/contact/",
  "/insights/",
  "/insights/aws-migration-readiness-checklist/",
];

test.describe("axe-core scans", () => {
  test.skip(({ isMobile }) => Boolean(isMobile), "axe runs once on the desktop project");

  for (const path of PRIORITY_PAGES) {
    test(`no automated WCAG violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        results.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.map((node) => node.target),
        })),
      ).toEqual([]);
    });
  }

  test("no automated WCAG violations with the Services mega-menu open", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Services menu" }).click();
    await expect(page.locator("#nav-panel-services")).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });
});

test.describe("responsive behavior (PRD §18.2)", () => {
  test.skip(({ isMobile }) => Boolean(isMobile), "uses explicit viewport sizes");

  for (const width of [320, 375, 768, 1280]) {
    test(`no horizontal page overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", "/services/", "/work/", "/contact/"]) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${path} overflows at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});
