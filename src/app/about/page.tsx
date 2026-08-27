import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { DeliveryTimeline } from "@/components/content/DeliveryTimeline";
import { PageHero } from "@/components/content/PageHero";
import { LeadershipGrid } from "@/components/trust/TrustSections";
import { CtaPanel } from "@/components/content/CtaPanel";
import { siteConfig, isPlaceholder } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Fast Digital Solutions is a digital engineering company focused on practical cloud, AI, software, quality, and delivery solutions for growing organizations.",
  path: "/about/",
});

const principles = [
  {
    title: "Client context first",
    detail:
      "We begin with your business problem, constraints, users, and operating environment — not with a solution looking for a home.",
  },
  {
    title: "Outcomes before tools",
    detail:
      "Technology choices follow from what needs to change for the business, and we explain the reasoning in plain terms.",
  },
  {
    title: "Evidence over adjectives",
    detail:
      "We would rather show a working increment, a documented decision, or a test result than reach for superlatives.",
  },
  {
    title: "Visible delivery",
    detail:
      "Work is planned, reviewed, tested, documented, and demonstrated in the open — including the risks.",
  },
  {
    title: "Maintainable by you",
    detail:
      "Documentation and knowledge transfer are deliverables. Systems should not depend on us to stay healthy.",
  },
  {
    title: "Honest scale",
    detail:
      "We are a focused team, and we say so. What we commit to, we can actually staff and deliver.",
  },
];

export default function AboutPage() {
  const address = siteConfig.mailingAddress;

  return (
    <>
      <PageHero
        headingId="about-hero"
        variant="split"
        image="hero-about"
        eyebrow="About"
        title="Built to be a practical technology partner."
        lead={siteConfig.categoryStatement}
      >
        <p className="mt-4 text-[1.0625rem] text-muted">
          We work with growing organizations that need experienced technology capacity, clear
          communication, and a delivery approach shaped around their business.
        </p>
      </PageHero>

      <Section surface="canvas" ariaLabelledby="mission-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr]">
            <SectionIntro
              id="mission-heading"
              eyebrow="Why we exist"
              title="Experienced delivery, without the overhead of a giant firm."
              lead="Growing organizations often face a gap: too complex for a generalist agency, too pragmatic for a global consultancy. We exist for that gap — meaningful cloud, software, AI, and quality work delivered by a team that stays close to the client."
            />
            <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {principles.map((principle) => (
                <li key={principle.title} className="border-t-2 border-accent/50 pt-4">
                  <h3 className="text-base font-bold">{principle.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                    {principle.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section surface="paper" ariaLabelledby="delivery-model-heading">
        <Container>
          <SectionIntro
            id="delivery-model-heading"
            eyebrow="Delivery model"
            title="Five stages we apply to every engagement."
          />
          <div className="mt-12">
            <DeliveryTimeline variant="preview" />
          </div>
          <p className="mt-10">
            <Link href="/how-we-work/" className="font-semibold text-accent-dark hover:underline">
              See how we work in detail <span aria-hidden="true">→</span>
            </Link>
          </p>
        </Container>
      </Section>

      {/* Leadership: renders only when approved, verified profiles exist (PRD §14.7).
          No silhouettes, no invented people. */}
      <LeadershipGrid />

      <Section surface="canvas" spacing="tight" ariaLabelledby="contact-details-heading">
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h2 id="contact-details-heading" className="text-h3 font-semibold">
                Reach us
              </h2>
              <p className="mt-4 text-[0.9375rem] text-muted">
                <a
                  href={siteConfig.phoneHref}
                  className="font-semibold text-accent-dark hover:underline"
                >
                  {siteConfig.phoneDisplay}
                </a>
                <br />
                {siteConfig.timeZoneLabel}
                {!isPlaceholder(siteConfig.email) ? (
                  <>
                    <br />
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="font-semibold text-accent-dark hover:underline"
                    >
                      {siteConfig.email}
                    </a>
                  </>
                ) : null}
              </p>
            </div>
            <div>
              <h2 className="text-h3 font-semibold">{address.label}</h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                {address.line1}
                <br />
                {address.city}, {address.region} {address.postalCode}
                <br />
                {address.country}
              </p>
            </div>
            <div>
              <h2 className="text-h3 font-semibold">Careers</h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                Interested in working with us?{" "}
                <Link href="/careers/" className="font-semibold text-accent-dark hover:underline">
                  See our careers page
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <CtaPanel />
    </>
  );
}
