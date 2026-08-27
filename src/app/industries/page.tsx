import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { PageHero } from "@/components/content/PageHero";
import { IndustryPanel } from "@/components/content/IndustryPanel";
import { CtaPanel } from "@/components/content/CtaPanel";
import { industries } from "@/content/industries";
import { getService } from "@/content/services";
import { workingCommitments } from "@/content/delivery-method";

export const metadata: Metadata = buildMetadata({
  title: "Industries",
  description:
    "Where our services naturally apply: technology and SaaS, retail and digital commerce, professional services and business operations, and logistics and supply chain.",
  path: "/industries/",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        headingId="industries-hero"
        variant="split"
        image="hero-industries"
        eyebrow="Industries"
        title="We start from how your operation actually runs."
        lead="We do not claim deep specialization everywhere. We focus on four operating contexts where our services naturally apply, and approach each through the challenges its teams face, not through industry buzzwords."
      />

      <Section surface="canvas" ariaLabelledby="industry-list-heading">
        <Container>
          <h2 id="industry-list-heading" className="sr-only">
            Focus industries
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {industries.map((industry) => (
              <IndustryPanel
                key={industry.slug}
                industry={industry}
                relevantServices={industry.relevantServiceSlugs
                  .map((slug) => getService(slug))
                  .filter((s): s is NonNullable<typeof s> => Boolean(s))}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section surface="paper" ariaLabelledby="cross-industry-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr]">
            <SectionIntro
              id="cross-industry-heading"
              eyebrow="Across industries"
              title="What stays the same, whoever we work with."
              lead="Delivery discipline does not change by sector. These principles apply to every engagement."
            />
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {workingCommitments.map((commitment) => (
                <li key={commitment} className="flex gap-3 text-[0.9375rem] text-ink/85">
                  <span
                    aria-hidden="true"
                    className="mt-[0.55em] h-1 w-3 shrink-0 rounded-full bg-accent/70"
                  />
                  {commitment}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <CtaPanel
        heading="Working in a different context?"
        copy="The four industries above are where we focus, not a boundary. If the challenge fits our capabilities, we are happy to talk it through."
        ctaLabel="Talk through the challenge"
      />
    </>
  );
}
