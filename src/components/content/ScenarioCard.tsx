import Link from "next/link";
import type { Scenario } from "@/lib/schemas";
import { SCENARIO_LABEL } from "@/content/scenarios";

/**
 * Representative-scenario card. The illustrative label is always rendered so
 * scenarios never read as named client case studies.
 */
export function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <article className="flex h-full flex-col rounded-[12px] border border-stone bg-surface-card p-6 lg:p-8">
      <p className="mb-4 inline-flex w-fit items-center rounded-full border border-olive/40 bg-olive/10 px-3 py-1 text-xs font-semibold text-olive-dark">
        {SCENARIO_LABEL}
      </p>
      <h3 className="text-h3 font-semibold">
        <Link href={`/work/#${scenario.slug}`} className="hover:text-accent-dark">
          {scenario.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">
        {scenario.situation}
      </p>
      <Link
        href={`/work/#${scenario.slug}`}
        className="mt-5 text-sm font-semibold text-accent-dark hover:underline"
      >
        See how we would approach it <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
