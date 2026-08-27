import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Picture } from "@/components/ui/Picture";
import { SIZES } from "@/lib/images";
import { PageHero } from "@/components/content/PageHero";
import { PullStatement } from "@/components/content/PullStatement";
import { CtaPanel } from "@/components/content/CtaPanel";
import { afterEnquirySteps, deliveryStages, workingCommitments } from "@/content/delivery-method";
import { engagementModels } from "@/content/engagement-models";

export const metadata: Metadata = buildMetadata({
  title: "How we work",
  description:
    "The client-first delivery method behind every Fast Digital Solutions engagement, from alignment through delivery and validation, with visible progress and documented decisions.",
  path: "/how-we-work/",
});

export default function HowWeWorkPage() {
  return (
    <>
      <PageHero
        headingId="hww-hero"
        variant="split"
        image="hero-how-we-work"
        eyebrow="How we work"
        title="Delivery you can see, question, and steer."
        lead="Most delivery risk comes from working in the dark. Progress you cannot verify, decisions you were not part of, and problems raised too late to fix cheaply. Our method is built to remove that darkness."
      />

      <Section surface="canvas" spacing="tight" ariaLabelledby="philosophy-heading">
        <Container>
          <h2 id="philosophy-heading" className="sr-only">
            Delivery philosophy
          </h2>
          <div className="max-w-[46rem]">
            <PullStatement>
              We start by understanding the business context and turning it into a plan the team can
              work to. Then we deliver in visible increments, flag risks early, write decisions
              down, and leave behind systems and knowledge the client can maintain without us.
            </PullStatement>
          </div>
        </Container>
      </Section>

      {/* Five-stage method, in full */}
      <Section surface="paper" ariaLabelledby="stages-heading">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <SectionIntro
              id="stages-heading"
              eyebrow="The method"
              title="Five stages, each with visible outputs."
              lead="Each stage ends with something you can see and check, whether that is a plan, a running increment, a test result, or a handover document. Progress is never a matter of trust alone."
            />
            <Picture
              id="feature-how-we-work-stages"
              sizes={SIZES.feature}
              pictureClassName="block overflow-hidden rounded-[20px] bg-canvas"
              className="aspect-[4/3] object-cover"
            />
          </div>
          <div className="mt-12 space-y-10">
            {deliveryStages.map((stage) => (
              <article
                key={stage.name}
                className="grid gap-6 rounded-[12px] border border-stone bg-surface-card p-6 md:grid-cols-[auto_1fr_1fr] md:gap-10 md:p-8"
              >
                <div className="flex items-start gap-4 md:w-44">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent text-base font-bold text-accent-dark"
                  >
                    {stage.number}
                  </span>
                  <h3 className="pt-2 text-h3 font-semibold">{stage.name}</h3>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-muted">
                    Purpose
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {stage.purpose.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink/85"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.55em] h-1 w-3 shrink-0 rounded-full bg-accent/70"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-muted">
                    {stage.outputsTitle}
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {stage.outputs.map((output) => (
                      <li
                        key={output}
                        className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink/85"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.55em] h-1 w-3 shrink-0 rounded-full bg-olive/70"
                        />
                        {output}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Communication, governance, quality, documentation */}
      <Section surface="espresso" ariaLabelledby="commitments-heading">
        <Container>
          <SectionIntro
            id="commitments-heading"
            eyebrow="Working practices"
            title="Commitments we can be held to."
            lead="These are operating principles, not slogans. Each one is something you can check during an engagement."
          />
          <ul className="mt-12 grid gap-x-10 gap-y-5 md:grid-cols-2">
            {workingCommitments.map((commitment) => (
              <li
                key={commitment}
                className="flex gap-3 border-b border-white/10 pb-5 text-[0.9375rem] text-stone"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] h-1 w-3 shrink-0 rounded-full bg-accent"
                />
                {commitment}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Engagement models */}
      <Section surface="paper" id="engagement-models" ariaLabelledby="models-heading">
        <Container>
          <SectionIntro
            id="models-heading"
            eyebrow="Engagement models"
            title="Shape the engagement to the work."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {engagementModels.map((model) => (
              <article
                key={model.slug}
                className="rounded-[12px] border border-stone bg-surface-card p-6 lg:p-8"
              >
                <h3 className="text-h3 font-semibold">{model.name}</h3>
                <p className="mt-2 text-sm font-medium text-accent-dark">
                  Best for: {model.bestFor}
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  {model.explanation}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* What happens after enquiry */}
      <Section surface="canvas" ariaLabelledby="after-enquiry-heading">
        <Container>
          <SectionIntro
            id="after-enquiry-heading"
            eyebrow="After you get in touch"
            title="What happens when you enquire."
            lead="There is no sales cadence behind this. You get a reply from a person within two business days."
          />
          <ol className="mt-12 grid gap-8 md:grid-cols-5">
            {afterEnquirySteps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-accent bg-paper text-sm font-bold text-accent-dark"
                >
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-bold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <CtaPanel
        heading="See the method applied to your priority."
        copy="Tell us what needs to move forward and we will walk you through how we would run it, stage by stage."
      />
    </>
  );
}
