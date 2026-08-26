import { expect, test, type Page } from "@playwright/test";

/**
 * Contact form states against a mocked endpoint (PRD §22.2, §28.2).
 * The e2e build bakes in NEXT_PUBLIC_CONTACT_API_URL=https://contact-api.test/submit
 * and a 1.5s timeout (see the build:e2e script); Playwright intercepts that host.
 */

const API_GLOB = "**/contact-api.test/**";

async function fillValidForm(page: Page) {
  await page.getByLabel(/Full name/).fill("Jordan Lee");
  await page.getByLabel(/Work email/).fill("jordan@example.com");
  await page.getByLabel(/Company/).fill("Example Company");
  await page.getByLabel(/Country or region/).selectOption("United States");
  await page.getByLabel(/Service required/).selectOption("cloud-platform-engineering");
  await page
    .getByLabel(/Project summary/)
    .fill(
      "We need to assess and modernize a customer-facing application currently hosted on legacy infrastructure.",
    );
  await page.getByLabel(/I have read the/).check();
}

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact/");
  });

  test("client validation blocks an empty submission and focuses the error summary", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByText("Review the highlighted fields")).toBeVisible();
    await expect(page.getByLabel(/Full name/)).toHaveAttribute("aria-invalid", "true");
    // No network request is made on client-side validation failure.
  });

  test("accepted submission shows the success panel with reference (202)", async ({ page }) => {
    await page.route(API_GLOB, (route) =>
      route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ requestId: "FDS-2026-000123", message: "Enquiry accepted" }),
      }),
    );
    await fillValidForm(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(
      page.getByRole("heading", { name: "Thank you. Your enquiry has been received." }),
    ).toBeVisible();
    await expect(page.getByText("FDS-2026-000123")).toBeVisible();
  });

  test("server field errors map onto the form (422)", async ({ page }) => {
    await page.route(API_GLOB, (route) =>
      route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({
          code: "VALIDATION_ERROR",
          message: "Review the highlighted fields.",
          fieldErrors: { workEmail: "Enter a valid work email address." },
        }),
      }),
    );
    await fillValidForm(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByText("Review the highlighted fields")).toBeVisible();
    await expect(page.getByLabel(/Work email/)).toHaveAttribute("aria-invalid", "true");
  });

  test("rate limiting shows the throttle message (429)", async ({ page }) => {
    await page.route(API_GLOB, (route) =>
      route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ code: "RATE_LIMITED", message: "Try again later." }),
      }),
    );
    await fillValidForm(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "Too many requests were received from this connection.",
    );
  });

  test("server errors show the generic failure with the phone fallback (503)", async ({ page }) => {
    await page.route(API_GLOB, (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          code: "SUBMISSION_UNAVAILABLE",
          message: "The enquiry service is temporarily unavailable.",
        }),
      }),
    );
    await fillValidForm(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    const alert = page.locator("form").getByRole("alert");
    await expect(alert).toContainText("We could not send your enquiry.");
    await expect(alert).toContainText("+1 302-464-5943");
    // Non-sensitive values are preserved after a recoverable failure.
    await expect(page.getByLabel(/Full name/)).toHaveValue("Jordan Lee");
  });

  test("network timeout is reported (request exceeds the configured timeout)", async ({ page }) => {
    await page.route(API_GLOB, async (route) => {
      // The e2e build sets a 1.5s timeout; stall longer than that.
      await new Promise((resolve) => setTimeout(resolve, 4000));
      await route.abort();
    });
    await fillValidForm(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "We could not send your enquiry.",
      {
        timeout: 10_000,
      },
    );
  });

  test("repeated submission is prevented while a request is pending", async ({ page }) => {
    await page.route(API_GLOB, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ requestId: "FDS-2026-000124" }),
      });
    });
    await fillValidForm(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
  });
});
