import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/content/site";

type CtaPanelProps = {
  heading?: string;
  copy?: string;
  ctaLabel?: string;
};

/**
 * Final contact CTA panel (PRD §14.1J), on the dark espresso surface.
 * Reused across pages with contextual heading/copy variations (PRD §13.3).
 */
export function CtaPanel({
  heading = "Tell us what needs to move forward.",
  copy = "Share your goals, current constraints, and desired timeline. A member of our team will respond within two business days.",
  ctaLabel = "Discuss your project",
}: CtaPanelProps) {
  return (
    <section
      data-surface="dark"
      aria-labelledby="cta-heading"
      className="bg-espresso py-16 text-paper md:py-24"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 id="cta-heading" className="text-h2 font-semibold">
              {heading}
            </h2>
            <p className="mt-5 max-w-[38rem] text-lead text-stone">{copy}</p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <Button href="/contact/" variant="onDark">
              {ctaLabel}
            </Button>
            <p className="text-sm text-stone">
              Or call{" "}
              <a
                href={siteConfig.phoneHref}
                className="font-semibold text-paper underline underline-offset-4"
              >
                {siteConfig.phoneDisplay}
              </a>{" "}
              · {siteConfig.timeZoneLabel}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
