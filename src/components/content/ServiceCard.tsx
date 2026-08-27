import Link from "next/link";
import type { Service } from "@/lib/schemas";
import { isImageId, SIZES } from "@/lib/images";
import { Picture } from "@/components/ui/Picture";

type ServiceCardProps = {
  service: Service;
  /**
   * "summary"  — home page text card
   * "detailed" — services index, with capabilities
   * "image"    — home page photo card (falls back to "summary" without a photo)
   */
  variant?: "summary" | "detailed" | "image";
  /** Wider placement in the grid — the photo gets a wider `sizes`. */
  featured?: boolean;
  className?: string;
};

/**
 * Service card. Composition varies by variant so a grid never reads as a
 * templated wall of identical cards.
 */
export function ServiceCard({
  service,
  variant = "summary",
  featured = false,
  className = "",
}: ServiceCardProps) {
  const imageId =
    variant === "image" && isImageId(service.cardImageId) ? service.cardImageId : null;

  return (
    <article
      className={`card-lift group relative flex h-full flex-col overflow-hidden rounded-[12px] border border-stone bg-surface-card ${className}`}
    >
      {imageId ? (
        <div className="aspect-[3/2] overflow-hidden bg-canvas">
          <Picture
            id={imageId}
            sizes={featured ? SIZES.card2 : SIZES.card3}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6 lg:p-8">
        <h3 className="text-h3 font-semibold">
          <Link
            href={`/services/${service.slug}/`}
            className="after:absolute after:inset-0 group-hover:text-accent-dark"
          >
            {service.name}
          </Link>
        </h3>
        <p className="mt-3 text-[0.9375rem] font-medium text-accent-dark">{service.clientNeed}</p>
        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">{service.summary}</p>

        {variant === "detailed" ? (
          <ul className="mt-5 space-y-1.5 border-t border-stone pt-5 text-sm text-ink/85">
            {service.cardCapabilities.map((capability) => (
              <li key={capability} className="flex gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] h-1 w-3 shrink-0 rounded-full bg-accent/70"
                />
                {capability}
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-6 text-sm font-semibold text-accent-dark">
          Explore {service.stripLabel.toLowerCase()}
          <span
            aria-hidden="true"
            className="ml-1 inline-block transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </p>
      </div>
    </article>
  );
}
