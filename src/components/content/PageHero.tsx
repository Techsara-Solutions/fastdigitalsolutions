import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Picture } from "@/components/ui/Picture";
import { SIZES, type ImageId } from "@/lib/images";

type PageHeroProps = {
  /** id for the h1, referenced by the section's aria-labelledby. */
  headingId: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Buttons rendered under the lead. */
  actions?: ReactNode;
  /** Extra content under the lead/actions (e.g. a byline rule). */
  children?: ReactNode;
  /**
   * "text"        — copy only (legal, 404, no photo available)
   * "split"       — copy left, rounded photo right; photo shown on every viewport
   * "full-bleed"  — photo behind an espresso scrim with copy over the darker left side
   */
  variant?: "text" | "split" | "full-bleed";
  image?: ImageId;
};

/**
 * Shared page opener. The hero photo is the only `priority` image on a page;
 * everything below the fold lazy-loads.
 */
export function PageHero({
  headingId,
  eyebrow,
  title,
  lead,
  actions,
  children,
  variant = "text",
  image,
}: PageHeroProps) {
  const copy = (
    <>
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h1 id={headingId} className="text-h1 font-semibold [text-wrap:pretty]">
        {title}
      </h1>
      {lead ? (
        <p className="mt-6 text-lead text-muted [[data-surface=dark]_&]:text-paper/90">{lead}</p>
      ) : null}
      {actions ? <div className="mt-8 flex flex-wrap gap-4">{actions}</div> : null}
      {children}
    </>
  );

  if (variant === "full-bleed" && image) {
    return (
      <Section surface="photo" spacing="none" ariaLabelledby={headingId}>
        <Picture
          id={image}
          priority
          decorative
          sizes={SIZES.full}
          pictureClassName="absolute inset-0 -z-20"
          className="h-full w-full object-cover"
        />
        <div aria-hidden="true" className="photo-scrim -z-10" />
        <Container className="flex min-h-[28rem] items-end py-16 md:min-h-[34rem] md:py-24 lg:min-h-[38rem]">
          <div className="max-w-[46rem]">{copy}</div>
        </Container>
      </Section>
    );
  }

  if (variant === "split" && image) {
    return (
      <Section surface="paper" spacing="tight" ariaLabelledby={headingId}>
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <div className="max-w-[46rem] py-2">{copy}</div>
            <Picture
              id={image}
              priority
              sizes={SIZES.feature}
              pictureClassName="block overflow-hidden rounded-[20px] bg-canvas"
              className="aspect-[4/3] object-cover"
            />
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section surface="paper" spacing="tight" ariaLabelledby={headingId}>
      <Container>
        <div className="max-w-[46rem] py-6">{copy}</div>
      </Container>
    </Section>
  );
}
