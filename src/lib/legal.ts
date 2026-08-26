import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const legalFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  lastReviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reviewStatus: z.enum(["draft-pending-legal-review", "approved"]),
});

export type LegalDoc = z.infer<typeof legalFrontmatterSchema> & { content: string };

/** Loads a legal MDX document at build time (PRD §14.11, §17.1). */
export function getLegalDoc(name: "privacy" | "terms" | "accessibility"): LegalDoc {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "src", "content", "legal", `${name}.mdx`),
    "utf8",
  );
  const { data, content } = matter(raw);
  return { ...legalFrontmatterSchema.parse(data), content };
}
