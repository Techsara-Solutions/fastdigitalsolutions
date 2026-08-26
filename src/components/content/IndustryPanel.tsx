import Link from "next/link";
import type { Industry, Service } from "@/lib/schemas";

type IndustryPanelProps = {
  industry: Industry;
  /** Resolved relevant services, for capability links on the industries page. */
  relevantServices?: Service[];
};

/**
 * Industry tile/panel (PRD §14.1F, §14.4). Emphasizes the operating challenge —
 * never a claim of market dominance or industry client logos.
 */
export function IndustryPanel({ industry, relevantServices }: IndustryPanelProps) {
  return (
    <article className="flex h-full flex-col rounded-[12px] border border-stone bg-white/40 p-6 lg:p-8">
      <h3 className="text-h3 font-semibold">{industry.name}</h3>
      <p className="mt-3 text-[0.9375rem] font-medium text-clay-dark">{industry.challenge}</p>
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
                  className="text-sm font-medium text-clay-dark hover:underline"
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
