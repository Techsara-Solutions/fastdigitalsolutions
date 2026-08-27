import Link from "next/link";
import type { Insight } from "@/lib/insights";
import { formatDate } from "@/lib/format";
import { isImageId, SIZES } from "@/lib/images";
import { Picture } from "@/components/ui/Picture";

/** Insight card for index and preview listings. */
export function InsightCard({ insight }: { insight: Insight }) {
  const { frontmatter, readingTimeMinutes } = insight;
  const coverId = isImageId(frontmatter.coverImageId) ? frontmatter.coverImageId : null;
  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-[12px] border border-stone bg-surface-card">
      {coverId ? (
        <div className="aspect-[16/9] overflow-hidden bg-canvas">
          <Picture
            id={coverId}
            sizes={SIZES.card3}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6 lg:p-8">
        <p className="eyebrow !text-xs">{frontmatter.topic}</p>
        <h3 className="mt-3 text-h3 font-semibold">
          <Link
            href={`/insights/${frontmatter.slug}/`}
            className="after:absolute after:inset-0 group-hover:text-accent-dark"
          >
            {frontmatter.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">
          {frontmatter.description}
        </p>
        <p className="mt-5 border-t border-stone pt-4 text-sm text-muted">
          {frontmatter.author} · {formatDate(frontmatter.publishedAt)} · {readingTimeMinutes} min
          read
        </p>
      </div>
    </article>
  );
}
