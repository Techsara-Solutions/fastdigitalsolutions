import Link from "next/link";
import type { Insight } from "@/lib/insights";
import { formatDate } from "@/lib/format";

/** Insight card for index and preview listings (PRD §14.1I, §14.8). */
export function InsightCard({ insight }: { insight: Insight }) {
  const { frontmatter, readingTimeMinutes } = insight;
  return (
    <article className="group relative flex h-full flex-col rounded-[12px] border border-stone bg-white/40 p-6 lg:p-8">
      <p className="eyebrow !text-xs">{frontmatter.topic}</p>
      <h3 className="mt-3 text-h3 font-semibold">
        <Link
          href={`/insights/${frontmatter.slug}/`}
          className="after:absolute after:inset-0 group-hover:text-clay-dark"
        >
          {frontmatter.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">
        {frontmatter.description}
      </p>
      <p className="mt-5 border-t border-stone pt-4 text-sm text-muted">
        {frontmatter.author} · {formatDate(frontmatter.publishedAt)} · {readingTimeMinutes} min read
      </p>
    </article>
  );
}
