import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/content/PageHero";
import { CtaPanel } from "@/components/content/CtaPanel";
import { scenarios, SCENARIO_LABEL } from "@/content/scenarios";
import { getPublishedCaseStudies } from "@/content/case-studies";
import { getService } from "@/content/services";

export const metadata: Metadata = buildMetadata({
  title: "Capabilities in practice",
  description:
    "Representative engagement scenarios showing how Fast Digital Solutions' services combine around common client needs. Named client work is published only with permission.",
  path: "/work/",
});

/**
 * Work page (PRD §14.5). State A: no verified named work yet, so the page
 * presents clearly labelled representative scenarios. Published case studies
 * automatically appear here when approved and verified records exist.
 */
export default function WorkPage() {
  const caseStudies = getPublishedCaseStudies();

  return (
    <>
      <PageHero
        headingId="work-hero"
        variant="split"
        image="hero-work"
        eyebrow="Work"
        title="Capabilities in practice"
        lead="These representative scenarios show how our services can be combined around common client needs. Named client work will be published only with permission."
      />

      {caseStudies.length > 0 ? (
        <Section surface="canvas" ariaLabelledby="case-studies-heading">
          <Container>
            <h2 id="case-studies-heading" className="text-h2 font-semibold">
              Client work
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {caseStudies.map((study) => (
                <article
                  key={study.slug}
                  className="rounded-[12px] border border-stone bg-paper p-6 lg:p-8"
                >
                  <p className="text-sm font-semibold text-accent-dark">{study.clientDescriptor}</p>
                  <h3 className="mt-2 text-h3 font-semibold">{study.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                    {study.context}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section surface="canvas" ariaLabelledby="scenarios-heading">
        <Container>
          <h2 id="scenarios-heading" className="text-h2 font-semibold">
            Representative scenarios
          </h2>
          <div className="mt-10 space-y-8">
            {scenarios.map((scenario) => (
              <article
                key={scenario.slug}
                id={scenario.slug}
                className="scroll-mt-24 rounded-[12px] border border-stone bg-paper p-6 md:p-10"
              >
                <p className="mb-5 inline-flex items-center rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal-dark">
                  {SCENARIO_LABEL}
                </p>
                <h3 className="text-h3 font-semibold">{scenario.title}</h3>
                <div className="mt-6 grid gap-8 lg:grid-cols-3">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-muted">
                      The situation
                    </h4>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/85">
                      {scenario.situation}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-muted">
                      How we would approach it
                    </h4>
                    <ol className="mt-3 space-y-2.5">
                      {scenario.approach.map((step, index) => (
                        <li
                          key={step}
                          className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink/85"
                        >
                          <span aria-hidden="true" className="font-bold text-accent-dark">
                            {index + 1}.
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-muted">
                      Typical outcomes
                    </h4>
                    <ul className="mt-3 space-y-2.5">
                      {scenario.typicalOutcomes.map((outcome) => (
                        <li
                          key={outcome}
                          className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink/85"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.55em] h-1 w-3 shrink-0 rounded-full bg-accent/70"
                          />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-8 border-t border-stone pt-5 text-sm text-muted">
                  Draws on:{" "}
                  {scenario.serviceSlugs.map((slug, index) => {
                    const service = getService(slug);
                    if (!service) return null;
                    return (
                      <span key={slug}>
                        {index > 0 ? " · " : ""}
                        <Link
                          href={`/services/${slug}/`}
                          className="font-semibold text-accent-dark hover:underline"
                        >
                          {service.name}
                        </Link>
                      </span>
                    );
                  })}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <CtaPanel
        heading="Facing something similar?"
        copy="Describe your situation and we will tell you honestly how we would approach it — and whether we are the right team for it."
      />
    </>
  );
}
