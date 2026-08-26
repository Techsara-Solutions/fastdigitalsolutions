import type { CareerRole } from "@/lib/schemas";
import { isPublishable } from "@/lib/schemas";

/**
 * Careers content (PRD §14.9).
 *
 * EMPTY BY DESIGN: the page shows the honest no-open-roles state. Roles may
 * only be added when they are real; fake openings to appear larger are
 * forbidden. Each role must be approved and verified before it publishes.
 */
export const careerRoles: CareerRole[] = [];

export const noOpenRolesCopy =
  "We do not have a public opening at this time. Future opportunities will be posted here.";

export function getPublishedRoles(): CareerRole[] {
  return careerRoles.filter(isPublishable);
}
