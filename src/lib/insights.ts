import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  insightFrontmatterSchema,
  isPublishable,
  type InsightFrontmatter,
} from "@/lib/schemas";

/**
 * Filesystem-based insights loader (PRD §14.8, §17.1).
 * Runs at build time only — the site is a static export, so every article and
 * the reading time computed here are frozen into the generated HTML.
 */

const INSIGHTS_DIR = path.join(process.cwd(), "src", "content", "insights");
const WORDS_PER_MINUTE = 225;

export type Insight = {
  frontmatter: InsightFrontmatter;
  /** Raw MDX body (without frontmatter). */
  content: string;
  wordCount: number;
  readingTimeMinutes: number;
};

function parseInsightFile(filePath: string): Insight {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = insightFrontmatterSchema.parse({
    ...data,
    slug: data.slug ?? path.basename(filePath).replace(/\.mdx$/, ""),
  });
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  return {
    frontmatter,
    content,
    wordCount,
    readingTimeMinutes: Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE)),
  };
}

export function getAllInsights(): Insight[] {
  if (!fs.existsSync(INSIGHTS_DIR)) return [];
  return fs
    .readdirSync(INSIGHTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => parseInsightFile(path.join(INSIGHTS_DIR, file)))
    .sort((a, b) => b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt));
}

/** Only approved AND verified articles are ever published (PRD §2.2, §17.2). */
export function getPublishedInsights(): Insight[] {
  return getAllInsights().filter((insight) => isPublishable(insight.frontmatter));
}

export function getPublishedInsight(slug: string): Insight | undefined {
  return getPublishedInsights().find((insight) => insight.frontmatter.slug === slug);
}
