import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/content/PageHero";
import { ServiceCard } from "@/components/content/ServiceCard";
import { IndustryPanel } from "@/components/content/IndustryPanel";
import { ScenarioCard } from "@/components/content/ScenarioCard";
import { DeliveryTimeline } from "@/components/content/DeliveryTimeline";
import { InsightCard } from "@/components/content/InsightCard";
import { CtaPanel } from "@/components/content/CtaPanel";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { scenarios } from "@/content/scenarios";
import { engagementModels } from "@/content/engagement-models";
import { getPublishedInsights } from "@/lib/insights";
import { INSIGHTS_NAV_MINIMUM } from "@/content/navigation";

export const metadata: Metadata = buildMetadata({
  title: "",
  absoluteTitle: "Cloud, AI and Digital Engineering | Fast Digital Solutions",
  description:
    "Fast Digital Solutions helps growing organizations modernize applications, move to the cloud, automate operations, and strengthen engineering delivery, from discovery through ongoing support.",
  path: "/",
});

const commitments = [
  {
    title: "Clear scope, priorities, and ownership",
    detail:
      "Every engagement starts by agreeing what matters, who decides, and how progress is judged.",
  },
  {
    title: "Working demonstrations and early feedback",
    detail: "You see running software at a regular rhythm, not status reports about it.",
  },
  {
    title: "Quality and documentation throughout delivery",
    detail: "Testing, review, and documentation happen inside delivery, not as a phase after it.",
  },
  {
    title: "Flexible engagement models",
    detail: "Fixed scope, time and materials, dedicated team, or augmentation, shaped to the work.",
  },
];

export default function HomePage() {
  const publishedInsights = getPublishedInsights();
  const showInsights = publishedInsights.length >= INSIGHTS_NAV_MINIMUM;

  return (
    <>
      {/* A. Hero — full-bleed photograph, copy over the scrim */}
      <PageHero
        headingId="hero-heading"
        variant="full-bleed"
        image="hero-home"
        eyebrow="Cloud, AI and digital engineering"
        title="Technology delivery built around your business."
        lead="Fast Digital Solutions helps growing organizations modernize applications, move to the cloud, automate operations, and strengthen engineering delivery, from discovery through ongoing support."
        actions={
          <>
            <Button href="/contact/">Discuss your project</Button>
            <Button href="/services/" variant="outlineOnDark">
              Explore our capabilities
            </Button>
          </>
        }
      />

      {/* B. Capability strip */}
      <div className="border-b border-stone bg-canvas py-5">
        <Container>
          <ul
            aria-label="Capability areas"
            className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-ink/80"
          >
            {services.map((service, index) => (
              <li key={service.slug} className="flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-accent">
                    ·
                  </span>
                ) : null}
                <Link href={`/services/${service.slug}/`} className="hover:text-accent-dark">
                  {service.stripLabel}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* C. Client-first value section */}
      <Section surface="paper" ariaLabelledby="client-first-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr]">
            <SectionIntro
              id="client-first-heading"
              eyebrow="Client-first delivery"
              title="Your priorities set the agenda."
              lead="We work in clear stages, share progress early, document decisions, and shape the delivery model around your team, systems, and business goals."
            />
            <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {commitments.map((commitment) => (
                <li key={commitment.title} className="reveal border-t-2 border-accent/60 pt-4">
                  <h3 className="text-base font-bold">{commitment.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                    {commitment.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* D. Services overview — photo cards */}
      <Section surface="canvas" ariaLabelledby="services-heading">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionIntro
              id="services-heading"
              eyebrow="Services"
              title="Connected capabilities for complex delivery needs."
              lead="Bring together the cloud, software, data, quality, and delivery skills needed to move a defined business priority forward."
            />
            <Link href="/services/" className="font-semibold text-accent-dark hover:underline">
              All services <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.slug}
                service={service}
                variant="image"
                className="reveal"
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* E. How We Work preview — dark surface */}
      <Section surface="espresso" ariaLabelledby="method-heading">
        <Container>
          <SectionIntro
            id="method-heading"
            eyebrow="How we work"
            title="A practical path from problem to progress."
            lead="We start by agreeing on the outcome, then design the right approach, deliver in visible increments, check what matters before release, and carry the learning into whatever comes next."
          />
          <div className="mt-14">
            <DeliveryTimeline variant="preview" onDark />
          </div>
          <div className="mt-12">
            <Button href="/how-we-work/" variant="onDark">
              See how we work
            </Button>
          </div>
        </Container>
      </Section>

      {/* F. Industries — photo tiles */}
      <Section surface="paper" ariaLabelledby="industries-heading">
        <Container>
          <SectionIntro
            id="industries-heading"
            eyebrow="Industries"
            title="Operating contexts we understand."
            lead="Four environments where our services naturally apply, approached through the challenges their teams face day to day."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {industries.map((industry) => (
              <div key={industry.slug} className="reveal">
                <IndustryPanel industry={industry} variant="tile" />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* G. Work — representative scenarios, explicitly labelled */}
      <Section surface="canvas" ariaLabelledby="work-heading">
        <Container>
          <SectionIntro
            id="work-heading"
            eyebrow="Capabilities in practice"
            title="How these services combine around real needs."
            lead="Three illustrative scenarios that show how we approach the situations clients bring to us most often."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {scenarios.map((scenario) => (
              <div key={scenario.slug} className="reveal">
                <ScenarioCard scenario={scenario} />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* H. Engagement models */}
      <Section surface="paper" ariaLabelledby="models-heading">
        <Container>
          <SectionIntro
            id="models-heading"
            eyebrow="Ways to engage"
            title="Four ways to shape an engagement."
            lead="The engagement model follows the work, not a template."
          />
          <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {engagementModels.map((model) => (
              <div key={model.slug} className="border-l-2 border-accent/40 pl-5">
                <dt className="text-base font-bold">{model.name}</dt>
                <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">
                  {model.explanation}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-10">
            <Link
              href="/how-we-work/#engagement-models"
              className="font-semibold text-accent-dark hover:underline"
            >
              Compare engagement models <span aria-hidden="true">→</span>
            </Link>
          </p>
        </Container>
      </Section>

      {/* I. Insights preview — rendered only when ≥3 approved articles exist */}
      {showInsights ? (
        <Section surface="canvas" ariaLabelledby="insights-heading">
          <Container>
            <SectionIntro
              id="insights-heading"
              eyebrow="Insights"
              title="Thinking you can use before you talk to us."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {publishedInsights.slice(0, 3).map((insight) => (
                <InsightCard key={insight.frontmatter.slug} insight={insight} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* J. Final contact CTA */}
      <CtaPanel />
    </>
  );
}
