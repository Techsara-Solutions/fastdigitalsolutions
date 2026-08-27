import Link from "next/link";
import type { Scenario } from "@/lib/schemas";
import { SCENARIO_LABEL } from "@/content/scenarios";

/**
 * Representative-scenario card (PRD §14.1G, §14.5 State A).
 * The illustrative label is structural and always rendered — scenarios must
 * never read as named client case studies.
 */
export function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <article className="flex h-full flex-col rounded-[12px] border border-stone bg-paper p-6 lg:p-8">
      <p className="mb-4 inline-flex w-fit items-center rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal-dark">
        Example engagement scenario
      </p>
      <h3 className="text-h3 font-semibold">
        <Link href={`/work/#${scenario.slug}`} className="hover:text-accent-dark">
          {scenario.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">
        {scenario.situation}
      </p>
      <p className="mt-5 text-sm text-muted/80">
        <span className="sr-only">{SCENARIO_LABEL}</span>
      </p>
      <Link
        href={`/work/#${scenario.slug}`}
        className="text-sm font-semibold text-accent-dark hover:underline"
      >
        View representative work <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
