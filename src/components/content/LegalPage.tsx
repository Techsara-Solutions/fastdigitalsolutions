import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { formatDate } from "@/lib/format";
import type { LegalDoc } from "@/lib/legal";

/**
 * Shared rendering for Privacy, Terms, and Accessibility pages (PRD §14.11).
 * Draft documents carry a visible "pending legal review" banner — legal review
 * is a production launch blocker (PRD §32.1), and the banner makes the state
 * impossible to miss.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <Section surface="paper" spacing="tight" ariaLabelledby="legal-heading">
        <Container size="reading">
          <p className="eyebrow mb-4">Legal</p>
          <h1 id="legal-heading" className="text-h1 font-semibold">
            {doc.title}
          </h1>
          <p className="mt-4 text-sm text-muted">Last reviewed: {formatDate(doc.lastReviewed)}</p>
          {doc.reviewStatus === "draft-pending-legal-review" ? (
            <p className="mt-6 rounded-[10px] border border-accent/50 bg-accent/10 px-4 py-3 text-sm font-medium text-accent-dark">
              Draft — this document is pending legal review and may change before final publication.
            </p>
          ) : null}
        </Container>
      </Section>
      <Section surface="paper" spacing="tight">
        <Container size="reading">
          <div className="rich-text">
            <MDXRemote
              source={doc.content}
              options={{ mdxOptions: { rehypePlugins: [rehypeSlug] } }}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
