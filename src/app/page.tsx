import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Button } from "@/components/ui/Button";
import { GeoMotif } from "@/components/content/GeoMotif";
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
    "Fast Digital Solutions helps growing organizations modernize applications, move to the cloud, automate operations, and strengthen engineering delivery—from discovery through ongoing support.",
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
    detail: "You see running software at a regular rhythm — not status reports about it.",
  },
  {
    title: "Quality and documentation throughout delivery",
    detail: "Testing, review, and documentation happen inside delivery, not as a phase after it.",
  },
  {
    title: "Flexible engagement models",
    detail:
      "Fixed scope, time and materials, dedicated team, or augmentation — shaped to the work.",
  },
];

export default function HomePage() {
  const publishedInsights = getPublishedInsights();
  const showInsights = publishedInsights.length >= INSIGHTS_NAV_MINIMUM;

  return (
    <>
      {/* A. Hero — text-led, no carousel, no automatic motion */}
      <Section
        surface="paper"
        spacing="tight"
        ariaLabelledby="hero-heading"
        className="overflow-hidden"
      >
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[7fr_5fr]">
            <div className="py-6 md:py-10">
              <h1 id="hero-heading" className="text-h1 font-semibold">
                Technology delivery built around your business.
              </h1>
              <p className="mt-6 max-w-[36rem] text-lead text-muted">
                Fast Digital Solutions helps growing organizations modernize applications, move to
                the cloud, automate operations, and strengthen engineering delivery—from discovery
                through ongoing support.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/contact/">Discuss your project</Button>
                <Button href="/services/" variant="secondary">
                  Explore our capabilities
                </Button>
              </div>
            </div>
            <GeoMotif className="hidden h-auto w-full max-w-[420px] justify-self-end lg:block" />
          </div>
        </Container>
      </Section>

      {/* B. Capability strip — text-based, deliberately NOT "Trusted by" */}
      <div className="border-y border-stone bg-canvas py-5">
        <Container>
          <ul
            aria-label="Capability areas"
            className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-ink/80"
          >
            {services.map((service, index) => (
              <li key={service.slug} className="flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-clay">
                    ·
                  </span>
                ) : null}
                <Link href={`/services/${service.slug}/`} className="hover:text-clay-dark">
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
              title="Your priorities stay at the center."
              lead="We work in clear stages, share progress early, document decisions, and shape the delivery model around your team, systems, and business goals."
            />
            <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {commitments.map((commitment) => (
                <li key={commitment.title} className="border-t-2 border-clay/50 pt-4">
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

      {/* D. Services overview */}
      <Section surface="canvas" ariaLabelledby="services-heading">
        <Container>
          <SectionIntro
            id="services-heading"
            eyebrow="Services"
            title="Connected capabilities for complex delivery needs."
            lead="Bring together the cloud, software, data, quality, and delivery skills needed to move a defined business priority forward."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </Section>

      {/* E. How We Work preview — dark surface */}
      <Section surface="espresso" ariaLabelledby="method-heading">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionIntro
              id="method-heading"
              eyebrow="How we work"
              title="A practical path from problem to progress."
              lead="Align on the outcome. Architect the right approach. Deliver in visible increments. Validate what matters. Improve with the learning captured along the way."
            />
          </div>
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

      {/* F. Industries */}
      <Section surface="paper" ariaLabelledby="industries-heading">
        <Container>
          <SectionIntro
            id="industries-heading"
            eyebrow="Industries"
            title="Operating contexts we understand."
            lead="Four environments where our services naturally apply — approached through the challenges teams actually face."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {industries.map((industry) => (
              <IndustryPanel key={industry.slug} industry={industry} />
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
            lead="Representative scenarios that show how we approach common client situations. Named client work is published only with permission."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {scenarios.map((scenario) => (
              <ScenarioCard key={scenario.slug} scenario={scenario} />
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
            lead="The model follows the work — not the other way round."
          />
          <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {engagementModels.map((model) => (
              <div key={model.slug} className="border-l border-stone pl-5">
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
              className="font-semibold text-clay-dark hover:underline"
            >
              Compare engagement models <span aria-hidden="true">→</span>
            </Link>
          </p>
        </Container>
      </Section>

      {/* I. Insights preview — rendered only when ≥3 approved articles exist (PRD §14.1I) */}
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
