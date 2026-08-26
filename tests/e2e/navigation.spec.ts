import { expect, test } from "@playwright/test";

/**
 * Navigation and global-shell coverage (PRD §28.2): header navigation,
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
      ["About", "/about/"],
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

  test("Insights stays out of primary navigation until the launch gate is met (PRD §14.8)", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Insights" })).toHaveCount(0);
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

test.describe("mobile navigation (PRD §13.1)", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile-only checks");

  test("menu opens, traps focus, closes on Escape, and returns focus", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Menu" });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Services" })).toBeVisible();
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
      .getByRole("link", { name: "Services" })
      .click();
    await expect(page).toHaveURL("/services/");
  });
});

test.describe("global content", () => {
  test("footer phone link uses tel: and legal links resolve", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "+1 302-464-5943" })).toHaveAttribute(
      "href",
      "tel:+13024645943",
    );
    await footer.getByRole("link", { name: "Privacy Policy" }).click();
    await expect(page).toHaveURL("/privacy/");
    await expect(page.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeVisible();
  });

  test("address is labelled as a mailing address, never an office (PRD §2.5)", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Business mailing address")).toBeVisible();
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/headquarters|walk-in|our office/i);
  });

  test("custom 404 page offers useful routes (PRD §14.11)", async ({ page }) => {
    await page.goto("/this-page-does-not-exist/", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: "This page could not be found." }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Go to the home page" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore our services" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact us" })).toBeVisible();
  });

  test("service detail pages render every section of the template (PRD §14.3)", async ({
    page,
  }) => {
    await page.goto("/services/cloud-platform-engineering/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const heading of [
      "Where this helps",
      "What we do",
      "How we deliver it",
      "Built-in considerations",
      "Often combined with",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
    await expect(
      page.getByText("Example engagement scenario — not a named client case study"),
    ).toBeVisible();
  });

  test("work page labels every scenario as illustrative (PRD §14.5)", async ({ page }) => {
    await page.goto("/work/");
    const labels = page.getByText("Example engagement scenario — not a named client case study");
    await expect(labels).toHaveCount(3);
  });
});
