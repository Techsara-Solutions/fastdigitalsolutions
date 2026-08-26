import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";
import { ScenarioCard } from "@/components/content/ScenarioCard";
import { ContactForm } from "@/components/forms/ContactForm";
import { scenarios } from "@/content/scenarios";

vi.mock("next/navigation", () => ({
  usePathname: () => "/contact/",
}));

describe("Button (PRD §19.1)", () => {
  it("renders a link when given an href (navigation)", () => {
    render(<Button href="/contact/">Discuss your project</Button>);
    const link = screen.getByRole("link", { name: "Discuss your project" });
    // Next normalizes trailing slashes in the test environment; the built app
    // applies trailingSlash: true globally.
    expect(link.getAttribute("href")).toMatch(/^\/contact\/?$/);
  });

  it("renders a real button for actions", () => {
    render(<Button type="submit">Send enquiry</Button>);
    expect(screen.getByRole("button", { name: "Send enquiry" })).toHaveAttribute("type", "submit");
  });
});

describe("ScenarioCard (PRD §2.3)", () => {
  it("always shows the illustrative label", () => {
    const scenario = scenarios[0]!;
    render(<ScenarioCard scenario={scenario} />);
    expect(screen.getByText("Example engagement scenario")).toBeInTheDocument();
  });
});

describe("ContactForm (PRD §22.2)", () => {
  it("shows a focused error summary after an invalid submission", async () => {
    const user = userEvent.setup();
    render(<ContactForm apiUrl="https://contact-api.test/submit" timeoutMs={1000} />);

    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    const summaryTitle = await screen.findByText("Review the highlighted fields");
    expect(summaryTitle).toBeInTheDocument();
    // Inline errors are connected to their fields.
    const nameInput = screen.getByLabelText(/Full name/);
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveAttribute("aria-describedby");
  });

  it("shows the success panel with the request reference on 202", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ requestId: "FDS-2026-000123", message: "Enquiry accepted" }), {
        status: 202,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactForm apiUrl="https://contact-api.test/submit" timeoutMs={5000} />);

    await user.type(screen.getByLabelText(/Full name/), "Jordan Lee");
    await user.type(screen.getByLabelText(/Work email/), "jordan@example.com");
    await user.type(screen.getByLabelText(/Company/), "Example Company");
    await user.selectOptions(screen.getByLabelText(/Country or region/), "United States");
    await user.selectOptions(
      screen.getByLabelText(/Service required/),
      "cloud-platform-engineering",
    );
    await user.type(
      screen.getByLabelText(/Project summary/),
      "We need to assess and modernize a customer-facing application on legacy infrastructure.",
    );
    await user.click(screen.getByLabelText(/I have read the/));
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    expect(
      await screen.findByRole("heading", { name: /Thank you\. Your enquiry has been received\./ }),
    ).toBeInTheDocument();
    expect(screen.getByText("FDS-2026-000123")).toBeInTheDocument();

    const body = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string);
    expect(body.sourcePath).toBe("/contact/");
    expect(body.website).toBe("");

    vi.unstubAllGlobals();
  });

  it("shows the rate-limit message on 429 (PRD §22.2)", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ code: "RATE_LIMITED", message: "Try again later." }), {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    render(<ContactForm apiUrl="https://contact-api.test/submit" timeoutMs={5000} />);

    await user.type(screen.getByLabelText(/Full name/), "Jordan Lee");
    await user.type(screen.getByLabelText(/Work email/), "jordan@example.com");
    await user.type(screen.getByLabelText(/Company/), "Example Company");
    await user.selectOptions(screen.getByLabelText(/Country or region/), "United States");
    await user.selectOptions(screen.getByLabelText(/Service required/), "not-sure-yet");
    await user.type(
      screen.getByLabelText(/Project summary/),
      "A long enough project summary describing the goal and constraints in detail.",
    );
    await user.click(screen.getByLabelText(/I have read the/));
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Too many requests were received from this connection.",
    );
    // Values are preserved after a recoverable failure.
    expect(screen.getByLabelText(/Full name/)).toHaveValue("Jordan Lee");

    vi.unstubAllGlobals();
  });
});
