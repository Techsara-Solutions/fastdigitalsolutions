import Link from "next/link";
import { Container } from "@/components/ui/Container";

export type Crumb = {
  label: string;
  href?: string;
};

/**
 * Breadcrumbs for service, insight, and case-study detail pages (PRD §13.4).
 * The final crumb is the current page (no link, aria-current).
 */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <Container>
      <nav aria-label="Breadcrumb" className="pt-6">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={crumb.label} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-stone">
                    /
                  </span>
                ) : null}
                {isLast || !crumb.href ? (
                  <span aria-current={isLast ? "page" : undefined} className="text-ink">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="hover:text-accent-dark hover:underline">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </Container>
  );
}
