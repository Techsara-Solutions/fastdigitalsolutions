import type { CaseStudy } from "@/lib/schemas";
import { isPublishable } from "@/lib/schemas";

/**
 * Named or anonymized case studies (PRD §14.5 States B/C).
 *
 * EMPTY BY DESIGN. A case study may only be added here when it is based on
 * real work AND the required permissions exist (PRD §14.5):
 * written client permission (for named work), approved descriptions and
 * outcomes, approved quotes, and an internal approval reference.
 *
 * Records that are not `publishStatus: "approved"` AND `verified: true` are
 * excluded from every page and fail the production content gate if marked
 * approved without verification.
 */
export const caseStudies: CaseStudy[] = [];

export function getPublishedCaseStudies(): CaseStudy[] {
  return caseStudies.filter(isPublishable);
}
