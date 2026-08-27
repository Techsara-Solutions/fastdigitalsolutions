import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/content/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig, getContactApiUrl } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Tell Fast Digital Solutions about your goal, challenge, or delivery gap. We respond within two business days with a clear next step.",
  path: "/contact/",
});

const DEFAULT_TIMEOUT_MS = 12000;

/**
 * Contact page. The production endpoint is the built-in default, so the form
 * always renders; NEXT_PUBLIC_CONTACT_API_URL can still override it.
 */
export default function ContactPage() {
  const apiUrl = getContactApiUrl() ?? siteConfig.contactApiUrl;
  const timeoutMs = Number(process.env.NEXT_PUBLIC_CONTACT_API_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const address = siteConfig.mailingAddress;

  return (
    <>
      <PageHero
        headingId="contact-hero"
        variant="split"
        image="hero-contact"
        eyebrow="Contact"
        title={<>Let&rsquo;s understand what you need to move forward.</>}
        lead={`Share the business goal, current challenge, or delivery gap. We will review the details and respond ${siteConfig.responseCommitment} with a clear next step.`}
      />

      <Section surface="canvas" spacing="tight" ariaLabelledby="contact-form-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[7fr_5fr]">
            <div>
              <h2 id="contact-form-heading" className="text-h3 font-semibold">
                Tell us about the project
              </h2>
              <div className="mt-6">
                <ContactForm apiUrl={apiUrl} timeoutMs={timeoutMs} />
              </div>
            </div>

            <aside className="space-y-8 lg:pl-8">
              <div>
                <h2 className="text-base font-bold">Prefer to talk?</h2>
                <p className="mt-2 text-[0.9375rem] text-muted">
                  <a
                    href={siteConfig.phoneHref}
                    className="font-semibold text-accent-dark hover:underline"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                  <br />
                  {siteConfig.timeZoneLabel}
                </p>
              </div>
              <div>
                <h2 className="text-base font-bold">Email</h2>
                <p className="mt-2 text-[0.9375rem] text-muted">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="font-semibold text-accent-dark hover:underline"
                  >
                    {siteConfig.email}
                  </a>
                </p>
              </div>
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
                  You will hear back {siteConfig.responseCommitment}. That reply is usually an
                  introductory conversation or a recommended next step, and sometimes a plain answer
                  that we are not the right fit. See{" "}
                  <Link
                    href="/how-we-work/"
                    className="font-semibold text-accent-dark hover:underline"
                  >
                    what happens after you enquire
                  </Link>
                  .
                </p>
              </div>
              <div>
                <h2 className="text-base font-bold">If the form gives you trouble</h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                  Call or email us instead, and please tell us what went wrong so we can fix it.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
