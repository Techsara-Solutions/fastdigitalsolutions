import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { ServiceCard } from "@/components/content/ServiceCard";
import { CtaPanel } from "@/components/content/CtaPanel";
import { services } from "@/content/services";
import { engagementModels } from "@/content/engagement-models";
import { workingCommitments } from "@/content/delivery-method";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Six connected capability areas — cloud and platform engineering, AI and automation, software engineering, quality engineering, application support, and flexible delivery teams.",
  path: "/services/",
});

export default function ServicesIndexPage() {
  return (
    <>
      <Section surface="paper" spacing="tight" ariaLabelledby="services-hero">
        <Container>
          <div className="max-w-[46rem] py-6">
            <p className="eyebrow mb-4">Services</p>
            <h1 id="services-hero" className="text-h1 font-semibold">
              Start from the problem you need to solve.
            </h1>
            <p className="mt-6 text-lead text-muted">
              Six connected capability areas cover the delivery needs we see most often in growing
              organizations. Each one begins with your situation — the systems, constraints, and
              outcomes involved — before any technology choice is made.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="canvas" ariaLabelledby="service-groups-heading">
        <Container>
          <h2 id="service-groups-heading" className="sr-only">
            Service groups
          </h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} variant="detailed" />
            ))}
          </div>
        </Container>
      </Section>

      <Section surface="paper" ariaLabelledby="principles-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionIntro
                id="principles-heading"
                eyebrow="Across every service"
                title="The same delivery discipline, whatever the work."
                lead="These operating principles apply to every engagement, regardless of which capabilities it draws on."
              />
              <ul className="mt-8 space-y-3">
                {workingCommitments.map((commitment) => (
                  <li key={commitment} className="flex gap-3 text-[0.9375rem] text-ink/85">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-1 w-3 shrink-0 rounded-full bg-clay/70"
                    />
                    {commitment}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-h3 font-semibold">Ways to engage</h3>
              <dl className="mt-6 space-y-6">
                {engagementModels.map((model) => (
                  <div key={model.slug} className="border-l border-stone pl-5">
                    <dt className="font-bold">{model.name}</dt>
                    <dd className="mt-1 text-[0.9375rem] text-muted">{model.explanation}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      <CtaPanel
        heading="Not sure which capability fits?"
        copy="Describe the situation and we will recommend a practical starting point — which may be smaller than you expect."
        ctaLabel="Talk through the challenge"
      />
    </>
  );
}
