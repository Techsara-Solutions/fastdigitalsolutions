import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { InsightCard } from "@/components/content/InsightCard";
import { CtaPanel } from "@/components/content/CtaPanel";
import { getPublishedInsight, getPublishedInsights, type Insight } from "@/lib/insights";
import { getService } from "@/content/services";
import { siteConfig } from "@/content/site";
import { formatDate } from "@/lib/format";

/**
 * Insights index and article pages (PRD §14.8) as one optional catch-all
 * route: static export requires at least one generated path per dynamic
 * route, and article paths exist only for approved AND verified articles
 * (PRD §17.2) — which may legitimately be zero. The empty-slug variant is the
 * index, so this route always generates at least /insights/.
 */

type InsightsPageProps = {
  params: Promise<{ slug?: string[] }>;
};

export function generateStaticParams() {
  return [
    { slug: [] as string[] },
    ...getPublishedInsights().map((insight) => ({ slug: [insight.frontmatter.slug] })),
  ];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: InsightsPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    return buildMetadata({
      title: "Insights",
      description:
        "Practical writing from Fast Digital Solutions on cloud, AI and automation, software delivery, and quality engineering.",
      path: "/insights/",
    });
  }
  const insight = getPublishedInsight(slug[0] ?? "");
  if (!insight) return {};
  return buildMetadata({
    title: insight.frontmatter.title,
    description: insight.frontmatter.description,
    path: `/insights/${insight.frontmatter.slug}/`,
  });
}

export default async function InsightsPage({ params }: InsightsPageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) return <InsightsIndex />;
  const insight = getPublishedInsight(slug[0] ?? "");
  if (!insight || slug.length > 1) notFound();
  return <InsightArticle insight={insight} />;
}

function InsightsIndex() {
  const insights = getPublishedInsights();

  return (
    <>
      <Section surface="paper" spacing="tight" ariaLabelledby="insights-hero">
        <Container>
          <div className="max-w-[46rem] py-6">
            <p className="eyebrow mb-4">Insights</p>
            <h1 id="insights-hero" className="text-h1 font-semibold">
              Thinking you can use before you talk to us.
            </h1>
            <p className="mt-6 text-lead text-muted">
              Practical writing on cloud, AI and automation, software delivery, and quality
              engineering — written to be useful whether or not we ever work together.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="canvas" ariaLabelledby="articles-heading">
        <Container>
          <h2 id="articles-heading" className="sr-only">
            Articles
          </h2>
          {insights.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {insights.map((insight) => (
                <InsightCard key={insight.frontmatter.slug} insight={insight} />
              ))}
            </div>
          ) : (
            <div className="max-w-[40rem] rounded-[12px] border border-stone bg-paper p-8">
              <p className="text-[1.0625rem] leading-relaxed text-ink/85">
                Our first articles are being prepared and reviewed. In the meantime, if there is a
                topic you would like to talk through directly, call us at{" "}
                <a href={siteConfig.phoneHref} className="font-semibold text-clay-dark underline">
                  {siteConfig.phoneDisplay}
                </a>{" "}
                or use the contact page.
              </p>
            </div>
          )}
        </Container>
      </Section>

      <CtaPanel
        heading="Have a question an article hasn't answered?"
        copy="Tell us what you are weighing up — we are glad to share an honest view, even when the answer is 'you don't need us for that.'"
        ctaLabel="Talk through the challenge"
      />
    </>
  );
}

/** Extract h2 headings for the table of contents, matching rehype-slug ids. */
function buildToc(content: string): { id: string; text: string }[] {
  const slugger = new GithubSlugger();
  return content
    .split("\n")
    .filter((line) => /^##\s+/.test(line))
    .map((line) => {
      const text = line.replace(/^##\s+/, "").trim();
      return { id: slugger.slug(text), text };
    });
}

function InsightArticle({ insight }: { insight: Insight }) {
  const { frontmatter, content, readingTimeMinutes } = insight;
  const toc = buildToc(content);
  const relatedServices = frontmatter.relatedServiceSlugs
    .map((serviceSlug) => getService(serviceSlug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Insights", href: "/insights/" },
          { label: frontmatter.title },
        ]}
      />

      <Section surface="paper" spacing="tight" ariaLabelledby="article-heading">
        <Container size="reading">
          <p className="eyebrow mb-4">{frontmatter.topic}</p>
          <h1 id="article-heading" className="text-h1 font-semibold">
            {frontmatter.title}
          </h1>
          <p className="mt-5 text-lead text-muted">{frontmatter.description}</p>
          <p className="mt-6 border-t border-stone pt-5 text-sm text-muted">
            {frontmatter.author} · {frontmatter.authorRole} · Published{" "}
            {formatDate(frontmatter.publishedAt)}
            {frontmatter.updatedAt ? ` · Updated ${formatDate(frontmatter.updatedAt)}` : ""} ·{" "}
            {readingTimeMinutes} min read
          </p>
        </Container>
      </Section>

      <Section surface="paper" spacing="tight">
        <Container size="reading">
          {toc.length >= 3 ? (
            <nav
              aria-labelledby="toc-heading"
              className="mb-10 rounded-[12px] border border-stone bg-canvas p-6"
            >
              <h2
                id="toc-heading"
                className="text-sm font-bold uppercase tracking-[0.1em] text-muted"
              >
                In this article
              </h2>
              <ol className="mt-3 space-y-1.5">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-[0.9375rem] font-medium text-clay-dark hover:underline"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <div className="rich-text">
            <MDXRemote source={content} options={{ mdxOptions: { rehypePlugins: [rehypeSlug] } }} />
          </div>

          {relatedServices.length > 0 ? (
            <aside className="mt-14 rounded-[12px] border border-stone bg-canvas p-6">
              <h2 className="text-base font-bold">Related services</h2>
              <ul className="mt-3 space-y-2">
                {relatedServices.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}/`}
                      className="font-semibold text-clay-dark hover:underline"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </Container>
      </Section>

      <CtaPanel
        heading="Talk this through with us."
        copy="If this article touches something you are working on, we are glad to share an honest view of your situation."
        ctaLabel="Talk through the challenge"
      />
    </>
  );
}
