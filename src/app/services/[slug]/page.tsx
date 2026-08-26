import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CtaPanel } from "@/components/content/CtaPanel";
import { services, getService } from "@/content/services";
import { scenarios, SCENARIO_LABEL } from "@/content/scenarios";
import { getPublishedCaseStudies } from "@/content/case-studies";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.name,
    description: service.clientNeed,
    path: `/services/${service.slug}/`,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.relatedSlugs
    .map((relatedSlug) => getService(relatedSlug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const scenario = service.scenarioSlug
    ? scenarios.find((s) => s.slug === service.scenarioSlug)
    : undefined;
  const caseStudy = getPublishedCaseStudies().find((study) =>
    study.serviceSlugs.includes(service.slug),
  );

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services/" },
          { label: service.name },
        ]}
      />

      {/* 1. Service-specific hero */}
      <Section surface="paper" spacing="tight" ariaLabelledby="service-hero">
        <Container>
          <div className="max-w-[46rem] py-4">
            <p className="eyebrow mb-4">{service.name}</p>
            <h1 id="service-hero" className="text-h1 font-semibold">
              {service.hero.headline}
            </h1>
            <p className="mt-6 text-lead text-muted">{service.hero.copy}</p>
          </div>
        </Container>
      </Section>

      {/* 2. Where this helps */}
      <Section surface="canvas" ariaLabelledby="situations-heading">
        <Container>
          <h2 id="situations-heading" className="text-h2 font-semibold">
            Where this helps
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {service.situations.map((situation) => (
              <li
                key={situation}
                className="rounded-[12px] border border-stone bg-paper p-6 text-[0.9375rem] leading-relaxed text-ink/85"
              >
                {situation}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 3. Capabilities, grouped into themes */}
      <Section surface="paper" ariaLabelledby="capabilities-heading">
        <Container>
          <h2 id="capabilities-heading" className="text-h2 font-semibold">
            What we do
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {service.capabilityGroups.map((group) => (
              <div key={group.title} className="border-t-2 border-clay/50 pt-5">
                <h3 className="text-lg font-bold">{group.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[0.9375rem] text-ink/85">
                      <span
                        aria-hidden="true"
                        className="mt-[0.55em] h-1 w-3 shrink-0 rounded-full bg-clay/70"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Delivery approach */}
      <Section surface="espresso" ariaLabelledby="approach-heading">
        <Container>
          <h2 id="approach-heading" className="text-h2 font-semibold">
            How we deliver it
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-2">
            {service.deliveryApproach.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-clay text-sm font-bold text-clay"
                >
                  {index + 1}
                </span>
                <p className="text-[0.9375rem] leading-relaxed text-stone">{step}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 5. Quality, security, and operational considerations */}
      <Section surface="paper" ariaLabelledby="considerations-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 id="considerations-heading" className="text-h2 font-semibold">
                Built-in considerations
              </h2>
              <ul className="mt-8 space-y-4">
                {service.considerations.map((consideration) => (
                  <li
                    key={consideration}
                    className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink/85"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-1 w-3 shrink-0 rounded-full bg-olive/80"
                    />
                    {consideration}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[12px] border border-stone bg-canvas p-6 lg:p-8">
              <h2 className="text-h3 font-semibold">What we deliberately don&rsquo;t promise</h2>
              <ul className="mt-5 space-y-4">
                {service.notPromised.map((item) => (
                  <li key={item} className="text-[0.9375rem] leading-relaxed text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* 7. Representative scenario or approved case study */}
      {caseStudy ? (
        <Section surface="canvas" ariaLabelledby="proof-heading">
          <Container>
            <h2 id="proof-heading" className="text-h2 font-semibold">
              {caseStudy.title}
            </h2>
            <p className="mt-4 max-w-[46rem] text-lead text-muted">{caseStudy.context}</p>
            <Link
              href={`/work/`}
              className="mt-6 inline-block font-semibold text-clay-dark hover:underline"
            >
              View this work <span aria-hidden="true">→</span>
            </Link>
          </Container>
        </Section>
      ) : scenario ? (
        <Section surface="canvas" ariaLabelledby="scenario-heading">
          <Container>
            <p className="mb-4 inline-flex items-center rounded-full border border-olive/40 bg-olive/10 px-3 py-1 text-xs font-semibold text-olive-dark">
              {SCENARIO_LABEL}
            </p>
            <h2 id="scenario-heading" className="text-h2 font-semibold">
              {scenario.title}
            </h2>
            <p className="mt-4 max-w-[46rem] text-[1.0625rem] leading-relaxed text-muted">
              {scenario.situation}
            </p>
            <Link
              href={`/work/#${scenario.slug}`}
              className="mt-6 inline-block font-semibold text-clay-dark hover:underline"
            >
              View representative work <span aria-hidden="true">→</span>
            </Link>
          </Container>
        </Section>
      ) : null}

      {/* 6. Related services */}
      <Section surface="paper" spacing="tight" ariaLabelledby="related-heading">
        <Container>
          <h2 id="related-heading" className="text-h3 font-semibold">
            Often combined with
          </h2>
          <ul className="mt-6 flex flex-wrap gap-4">
            {related.map((relatedService) => (
              <li key={relatedService.slug}>
                <Link
                  href={`/services/${relatedService.slug}/`}
                  className="inline-block rounded-[10px] border border-stone bg-white/50 px-5 py-3 text-[0.9375rem] font-semibold text-ink transition-colors hover:border-clay/60 hover:text-clay-dark"
                >
                  {relatedService.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 8. Contact CTA */}
      <CtaPanel
        heading={`Discuss ${service.stripLabel.toLowerCase()} for your situation.`}
        copy="Tell us where you are and what needs to change. We will respond within two business days with a practical next step."
      />
    </>
  );
}
