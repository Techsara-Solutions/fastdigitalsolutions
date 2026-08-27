import Link from "next/link";
import type { Industry, Service } from "@/lib/schemas";
import { isImageId, SIZES } from "@/lib/images";
import { Picture } from "@/components/ui/Picture";

type IndustryPanelProps = {
  industry: Industry;
  /** Resolved relevant services, for capability links on the industries page. */
  relevantServices?: Service[];
  /**
   * "panel" — text panel with common needs (industries page)
   * "tile"  — photo tile with the name and challenge over a bottom scrim (home)
   */
  variant?: "panel" | "tile";
};

/**
 * Industry tile/panel. Emphasizes the operating challenge — never a claim of
 * market dominance or industry client logos.
 */
export function IndustryPanel({
  industry,
  relevantServices,
  variant = "panel",
}: IndustryPanelProps) {
  const imageId =
    variant === "tile" && isImageId(industry.tileImageId) ? industry.tileImageId : null;

  if (imageId) {
    return (
      <article
        data-surface="dark"
        className="group relative isolate flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-[12px] bg-navy text-paper sm:aspect-[3/2] lg:aspect-[4/3]"
      >
        <Picture
          id={imageId}
          decorative
          sizes={SIZES.card2}
          pictureClassName="absolute inset-0 -z-20"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div aria-hidden="true" className="photo-scrim--bottom -z-10" />
        <div className="p-6 lg:p-8">
          <h3 className="text-h3 font-semibold">
            <Link href="/industries/" className="after:absolute after:inset-0">
              {industry.name}
            </Link>
          </h3>
          <p className="mt-2 max-w-[28rem] text-[0.9375rem] leading-relaxed text-paper/90">
            {industry.challenge}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-[12px] border border-stone bg-surface-card p-6 lg:p-8">
      <h3 className="text-h3 font-semibold">{industry.name}</h3>
      <p className="mt-3 text-[0.9375rem] font-medium text-accent-dark">{industry.challenge}</p>
      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">{industry.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-2 border-t border-stone pt-5">
        {industry.commonNeeds.map((need) => (
          <li
            key={need}
            className="rounded-full border border-stone bg-canvas px-3 py-1 text-xs font-medium text-ink/80"
          >
            {need}
          </li>
        ))}
      </ul>
      {relevantServices && relevantServices.length > 0 ? (
        <div className="mt-5">
          <h4 className="text-sm font-bold text-ink">Relevant capabilities</h4>
          <ul className="mt-2 space-y-1.5">
            {relevantServices.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}/`}
                  className="text-sm font-medium text-accent-dark hover:underline"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
