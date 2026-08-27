import { expect, test } from "@playwright/test";
import { services } from "../../src/content/services";

/**
 * Navigation and global-shell coverage: header navigation, desktop mega-menus,
 * mobile-menu behavior including focus and Escape, CTA destinations, phone
 * links, and the custom 404 page.
 */

test.describe("desktop navigation", () => {
  test.skip(({ isMobile }) => Boolean(isMobile), "desktop-only checks");

  test("primary navigation reaches every top-level page", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const [label, path] of [
      ["Services", "/services/"],
      ["Industries", "/industries/"],
      ["Work", "/work/"],
      ["How we work", "/how-we-work/"],
      ["Insights", "/insights/"],
      ["Company", "/about/"],
    ] as const) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.goto("/");
    }
  });

  test("header CTA leads to the contact page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("banner").getByRole("link", { name: "Discuss your project" }).click();
    await expect(page).toHaveURL("/contact/");
  });

  test("Insights is in primary navigation because three approved articles exist", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Insights", exact: true })).toHaveCount(1);
    await page.goto("/insights/");
    await expect(page.getByRole("link", { name: /AWS migration/ })).toBeVisible();
  });

  test("skip link focuses main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeFocused();
    await skipLink.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
  });
});

test.describe("desktop mega-menu", () => {
  test.skip(({ isMobile }) => Boolean(isMobile), "desktop-only checks");

  test("opens from the disclosure button, closes on Escape, and returns focus", async ({
    page,
  }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Services menu" });
    const panel = page.locator("#nav-panel-services");
    await expect(panel).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
    for (const service of services) {
      await expect(panel.getByRole("link", { name: service.name })).toBeVisible();
    }
    await expect(panel.getByRole("link", { name: /All services/ })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });

  test("only one panel is open at a time and an outside click closes it", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Services menu" }).click();
    await expect(page.locator("#nav-panel-services")).toBeVisible();

    await page.getByRole("button", { name: "Industries menu" }).click();
    await expect(page.locator("#nav-panel-industries")).toBeVisible();
    await expect(page.locator("#nav-panel-services")).toBeHidden();

    await page.mouse.click(20, 700);
    await expect(page.locator("#nav-panel-industries")).toBeHidden();
  });

  test("panel links navigate and the panel closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Services menu" }).click();
    const first = services[0]!;
    await page.locator("#nav-panel-services").getByRole("link", { name: first.name }).click();
    await expect(page).toHaveURL(`/services/${first.slug}/`);
    await expect(page.getByRole("banner").locator('[aria-expanded="true"]')).toHaveCount(0);
  });

  test("focus leaving the panel closes it", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Company menu" });
    await button.focus();
    await page.keyboard.press("Enter");
    const panel = page.locator("#nav-panel-company");
    await expect(panel).toBeVisible();
    const linkCount = await panel.getByRole("link").count();
    for (let i = 0; i <= linkCount; i += 1) {
      await page.keyboard.press("Tab");
    }
    await expect(panel).toBeHidden();
  });
});

test.describe("mobile navigation", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile-only checks");

  test("menu opens, traps focus, closes on Escape, and returns focus", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Menu" });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Services", exact: true })).toBeVisible();
    await expect(dialog.getByRole("link", { name: /302-464-5943/ })).toBeVisible();

    // Body scroll is locked while open.
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");

    // Escape closes and focus returns to the trigger.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("menu links navigate", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page
      .getByRole("dialog", { name: "Site navigation" })
      .getByRole("link", { name: "Services", exact: true })
      .click();
    await expect(page).toHaveURL("/services/");
  });

  test("submenu accordions reveal section links", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    const first = services[0]!;
    await expect(dialog.getByRole("link", { name: first.name })).toHaveCount(0);
    await dialog.getByRole("button", { name: "Services submenu" }).click();
    await dialog.getByRole("link", { name: first.name }).click();
    await expect(page).toHaveURL(`/services/${first.slug}/`);
  });
});

test.describe("global content", () => {
  test("footer carries the phone link, the legal name, and the logo", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "+1 302-464-5943" })).toHaveAttribute(
      "href",
      "tel:+13024645943",
    );
    await expect(footer.getByText(/© \d{4} Fast Digital Solutions LLC/)).toBeVisible();
    await expect(footer.getByRole("link", { name: "Fast Digital Solutions home" })).toBeVisible();
    await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute("href", /icon/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /og-default/,
    );
  });

  test("address is labelled as a mailing address, never an office", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Business mailing address")).toBeVisible();
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/headquarters|walk-in|our office/i);
    expect(bodyText).not.toMatch(/Serving clients since/i);
  });

  test("custom 404 page offers useful routes", async ({ page }) => {
    await page.goto("/this-page-does-not-exist/", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: "This page could not be found." }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Go to the home page" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore our services" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact us" })).toBeVisible();
  });

  test("service detail pages render every section of the template", async ({ page }) => {
    await page.goto("/services/cloud-platform-engineering/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const heading of [
      "Where this helps",
      "What we do",
      "How we deliver it",
      "Built-in considerations",
      "Often combined with",
    ]) {
      await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    }
    await expect(page.getByText("Illustrative scenario", { exact: true })).toBeVisible();
  });

  test("work page labels every scenario as illustrative", async ({ page }) => {
    await page.goto("/work/");
    const labels = page.getByText("Illustrative scenario", { exact: true });
    await expect(labels).toHaveCount(3);
  });

  test("photography ships as AVIF/WebP with dimensions and lazy loading", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("main picture img").first();
    await expect(hero).toHaveAttribute("width", /\d+/);
    await expect(hero).toHaveAttribute("height", /\d+/);
    await expect(hero).toHaveAttribute("loading", "eager");
    await expect(page.locator('picture source[type="image/avif"]').first()).toHaveAttribute(
      "srcset",
      /\.avif \d+w/,
    );
    const lazyCount = await page.locator('picture img[loading="lazy"]').count();
    expect(lazyCount).toBeGreaterThan(5);
  });
});
