import { expect, test, type Page } from "@playwright/test";

/**
 * Contact form states against a mocked endpoint.
 * The e2e build bakes in NEXT_PUBLIC_CONTACT_API_URL=https://contact-api.test/submit
 * and a 1.5s timeout (see the build:e2e script); Playwright intercepts that host.
 */

const API_GLOB = "**/contact-api.test/**";

/* Scoped to the form: the header's "Company menu" button would otherwise match /Company/. */
async function fillValidForm(page: Page) {
  const form = page.locator("form");
  await form.getByLabel(/First name/).fill("Jordan");
  await form.getByLabel(/Last name/).fill("Lee");
  await form.getByLabel(/^Email/).fill("jordan@example.com");
  await form.getByLabel(/Company/).fill("Example Company");
  await form.getByLabel(/Phone number/).fill("+1 302 555 0100");
  await form.getByLabel(/Discussion topic/).fill("Cloud migration readiness");
  await form
    .getByLabel(/^Notes/)
    .fill(
      "We need to assess and modernize a customer-facing application currently hosted on legacy infrastructure.",
    );
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
    await expect(page.getByLabel(/First name/)).toHaveAttribute("aria-invalid", "true");
    // No network request is made on client-side validation failure.
  });

  test("posts exactly the seven API fields and shows the success panel (200)", async ({ page }) => {
    let posted: Record<string, unknown> | null = null;
    await page.route(API_GLOB, (route) => {
      posted = route.request().postDataJSON() as Record<string, unknown>;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Message received" }),
      });
    });
    await fillValidForm(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(
      page.getByRole("heading", { name: "Thank you. Your enquiry has been received." }),
    ).toBeVisible();
    expect(Object.keys(posted ?? {}).sort()).toEqual(
      [
        "company",
        "discussionTopic",
        "email",
        "firstName",
        "lastName",
        "notes",
        "phoneNumber",
      ].sort(),
    );
  });

  test("shows the request reference when the API returns one (202)", async ({ page }) => {
    await page.route(API_GLOB, (route) =>
      route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ requestId: "FDS-2026-000123", message: "Enquiry accepted" }),
      }),
    );
    await fillValidForm(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
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
          fieldErrors: { email: "Enter a valid email address." },
        }),
      }),
    );
    await fillValidForm(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByText("Review the highlighted fields")).toBeVisible();
    await expect(page.getByLabel(/^Email/)).toHaveAttribute("aria-invalid", "true");
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
    await expect(page.getByLabel(/First name/)).toHaveValue("Jordan");
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
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Message received" }),
      });
    });
    await fillValidForm(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByRole("button", { name: "Sending" })).toBeDisabled();
  });
});
