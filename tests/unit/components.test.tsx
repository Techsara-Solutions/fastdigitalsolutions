import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";
import { ScenarioCard } from "@/components/content/ScenarioCard";
import { ContactForm } from "@/components/forms/ContactForm";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { scenarios } from "@/content/scenarios";
import { getPrimaryNavigation } from "@/content/navigation";

vi.mock("next/navigation", () => ({
  usePathname: () => "/contact/",
}));

describe("Button", () => {
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

describe("ScenarioCard", () => {
  it("always shows the illustrative label", () => {
    const scenario = scenarios[0]!;
    render(<ScenarioCard scenario={scenario} />);
    expect(screen.getByText("Example engagement scenario")).toBeInTheDocument();
  });
});

describe("SiteHeader mega-menu", () => {
  it("toggles the Services panel from its disclosure button and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<SiteHeader items={getPrimaryNavigation()} />);

    const button = screen.getByRole("button", { name: "Services menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "All services" })).toBeVisible();

    await user.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
  });
});

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/First name/), "Jordan");
  await user.type(screen.getByLabelText(/Last name/), "Lee");
  await user.type(screen.getByLabelText(/^Email/), "jordan@example.com");
  await user.type(screen.getByLabelText(/Company/), "Example Company");
  await user.type(screen.getByLabelText(/Phone number/), "+1 302 555 0100");
  await user.type(screen.getByLabelText(/Discussion topic/), "Cloud migration readiness");
  await user.type(
    screen.getByLabelText(/^Notes/),
    "We need to assess and modernize a customer-facing application on legacy infrastructure.",
  );
  await user.click(screen.getByLabelText(/I have read the/));
}

describe("ContactForm", () => {
  it("shows a focused error summary after an invalid submission", async () => {
    const user = userEvent.setup();
    render(<ContactForm apiUrl="https://contact-api.test/submit" timeoutMs={1000} />);

    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    const summaryTitle = await screen.findByText("Review the highlighted fields");
    expect(summaryTitle).toBeInTheDocument();
    // Inline errors are connected to their fields.
    const nameInput = screen.getByLabelText(/First name/);
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveAttribute("aria-describedby");
  });

  it("posts exactly the seven API fields and shows the success panel on 200", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Message received" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactForm apiUrl="https://contact-api.test/submit" timeoutMs={5000} />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    expect(
      await screen.findByRole("heading", { name: /Thank you\. Your enquiry has been received\./ }),
    ).toBeInTheDocument();

    const body = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string);
    expect(Object.keys(body).sort()).toEqual(
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
    expect(body.firstName).toBe("Jordan");
    expect(body.phoneNumber).toBe("+1 302 555 0100");

    vi.unstubAllGlobals();
  });

  it("shows the request reference when the API returns one (202)", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ requestId: "FDS-2026-000123" }), {
          status: 202,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    render(<ContactForm apiUrl="https://contact-api.test/submit" timeoutMs={5000} />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    expect(await screen.findByText("FDS-2026-000123")).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it("shows the rate-limit message on 429", async () => {
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
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Too many requests were received from this connection.",
    );
    // Values are preserved after a recoverable failure.
    expect(screen.getByLabelText(/First name/)).toHaveValue("Jordan");

    vi.unstubAllGlobals();
  });
});
