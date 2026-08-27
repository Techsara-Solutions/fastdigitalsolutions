import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Picture } from "@/components/ui/Picture";
import { siteConfig } from "@/content/site";
import { SIZES, type ImageId } from "@/lib/images";

type CtaPanelProps = {
  heading?: string;
  copy?: string;
  ctaLabel?: string;
  /** Heading id — override when a page renders more than one panel. */
  id?: string;
  /** Photo behind the espresso scrim; the one global band photo by default. */
  image?: ImageId | null;
};

/**
 * Final contact CTA band, reused across pages with contextual heading/copy.
 * The photograph is decorative (alt="") and lazy — it is always below the fold.
 */
export function CtaPanel({
  heading = "Tell us what needs to move forward.",
  copy = "Share your goals, current constraints, and desired timeline. A member of our team will respond within two business days.",
  ctaLabel = "Discuss your project",
  id = "cta-heading",
  image = "band-cta",
}: CtaPanelProps) {
  return (
    <Section surface={image ? "photo" : "espresso"} spacing="none" ariaLabelledby={id}>
      {image ? (
        <>
          <Picture
            id={image}
            decorative
            sizes={SIZES.full}
            pictureClassName="absolute inset-0 -z-20"
            className="h-full w-full object-cover"
          />
          <div aria-hidden="true" className="photo-scrim--full -z-10" />
        </>
      ) : null}
      <Container className="py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 id={id} className="text-h2 font-semibold">
              {heading}
            </h2>
            <p className="mt-5 max-w-[38rem] text-lead text-paper/90">{copy}</p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <Button href="/contact/" variant="onDark">
              {ctaLabel}
            </Button>
            <p className="text-sm text-paper/85">
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
    </Section>
  );
}
