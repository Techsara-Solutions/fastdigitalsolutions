import Link from "next/link";
import type { Service } from "@/lib/schemas";

type ServiceCardProps = {
  service: Service;
  /** "summary" (home) or "detailed" (services index, with capabilities). */
  variant?: "summary" | "detailed";
};

/**
 * Service card (PRD §14.1D, §14.2). Composition varies subtly by variant so
 * the grid does not read as a templated wall of identical cards (PRD §15.2).
 */
export function ServiceCard({ service, variant = "summary" }: ServiceCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-[12px] border border-stone bg-white/50 p-6 transition-colors hover:border-clay/60 lg:p-8">
      <h3 className="text-h3 font-semibold">
        <Link
          href={`/services/${service.slug}/`}
          className="after:absolute after:inset-0 group-hover:text-clay-dark"
        >
          {service.name}
        </Link>
      </h3>
      <p className="mt-3 text-[0.9375rem] font-medium text-clay-dark">{service.clientNeed}</p>
      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">{service.summary}</p>

      {variant === "detailed" ? (
        <ul className="mt-5 space-y-1.5 border-t border-stone pt-5 text-sm text-ink/85">
          {service.cardCapabilities.map((capability) => (
            <li key={capability} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-[0.55em] h-1 w-3 shrink-0 rounded-full bg-clay/70"
              />
              {capability}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-6 text-sm font-semibold text-clay-dark">
        Explore {service.stripLabel.toLowerCase()}
        <span
          aria-hidden="true"
          className="ml-1 inline-block transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </p>
    </article>
  );
}
