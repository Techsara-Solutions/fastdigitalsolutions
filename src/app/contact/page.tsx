import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig, isPlaceholder, getContactApiUrl } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Tell Fast Digital Solutions about your goal, challenge, or delivery gap. We respond within two business days with an appropriate next step.",
  path: "/contact/",
});

const DEFAULT_TIMEOUT_MS = 12000;

/**
 * Contact page (PRD §14.10). The API endpoint is injected at build time from
 * NEXT_PUBLIC_CONTACT_API_URL; when it is absent, the page shows the explicit
 * fallback state instead of a silently failing form (PRD §22.6).
 */
export default function ContactPage() {
  // Blank and placeholder endpoints both resolve to undefined, so an unset CI
  // variable can never produce a form that posts nowhere.
  const apiUrl = getContactApiUrl();
  const timeoutMs = Number(process.env.NEXT_PUBLIC_CONTACT_API_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const address = siteConfig.mailingAddress;

  return (
    <>
      <Section surface="paper" spacing="tight" ariaLabelledby="contact-hero">
        <Container>
          <div className="max-w-[46rem] py-6">
            <p className="eyebrow mb-4">Contact</p>
            <h1 id="contact-hero" className="text-h1 font-semibold">
              Let&rsquo;s understand what you need to move forward.
            </h1>
            <p className="mt-6 text-lead text-muted">
              Share the business goal, current challenge, or delivery gap. We will review the
              details and respond {siteConfig.responseCommitment} with an appropriate next step.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="canvas" spacing="tight" ariaLabelledby="contact-form-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[7fr_5fr]">
            <div>
              <h2 id="contact-form-heading" className="text-h3 font-semibold">
                Tell us about the project
              </h2>
              <div className="mt-6">
                {apiUrl ? (
                  <ContactForm apiUrl={apiUrl} timeoutMs={timeoutMs} />
                ) : (
                  <div className="rounded-[12px] border border-stone bg-paper p-8" role="status">
                    <h3 className="text-lg font-bold">
                      Online enquiries are temporarily unavailable
                    </h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                      Our enquiry form is not accepting submissions right now. Please call us
                      directly — we are glad to talk through your project on the phone.
                    </p>
                    <p className="mt-5 text-lg font-semibold">
                      <a
                        href={siteConfig.phoneHref}
                        className="text-clay-dark underline underline-offset-4"
                      >
                        {siteConfig.phoneDisplay}
                      </a>
                    </p>
                    <p className="mt-1 text-sm text-muted">{siteConfig.timeZoneLabel}</p>
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-8 lg:pl-8">
              <div>
                <h2 className="text-base font-bold">Prefer to talk?</h2>
                <p className="mt-2 text-[0.9375rem] text-muted">
                  <a
                    href={siteConfig.phoneHref}
                    className="font-semibold text-clay-dark hover:underline"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                  <br />
                  {siteConfig.timeZoneLabel}
                </p>
              </div>
              {!isPlaceholder(siteConfig.email) ? (
                <div>
                  <h2 className="text-base font-bold">Email</h2>
                  <p className="mt-2 text-[0.9375rem] text-muted">
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="font-semibold text-clay-dark hover:underline"
                    >
                      {siteConfig.email}
                    </a>
                  </p>
                </div>
              ) : null}
              <div>
                <h2 className="text-base font-bold">{address.label}</h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                  {address.line1}
                  <br />
                  {address.city}, {address.region} {address.postalCode}
                  <br />
                  {address.country}
                </p>
              </div>
              <div>
                <h2 className="text-base font-bold">What to expect</h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                  A considered reply {siteConfig.responseCommitment} — an introductory conversation,
                  a recommended next step, or an honest &ldquo;we&rsquo;re not the right fit.&rdquo;
                  See{" "}
                  <Link
                    href="/how-we-work/"
                    className="font-semibold text-clay-dark hover:underline"
                  >
                    what happens after you enquire
                  </Link>
                  .
                </p>
              </div>
              <div>
                <h2 className="text-base font-bold">Accessibility</h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                  If the form presents a barrier, call us instead — and please tell us so we can fix
                  it. Our{" "}
                  <Link
                    href="/accessibility/"
                    className="font-semibold text-clay-dark hover:underline"
                  >
                    accessibility statement
                  </Link>{" "}
                  explains our commitment.
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">
                  Your information is used only to respond to your enquiry. Read the{" "}
                  <Link href="/privacy/" className="font-semibold text-clay-dark hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
