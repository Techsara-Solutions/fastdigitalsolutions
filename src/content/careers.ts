import type { CareerRole } from "@/lib/schemas";
import { isPublishable } from "@/lib/schemas";

/**
 * Careers content.
 *
 * Roles may only be added when they are real; each must be approved and
 * verified before it publishes. With no advertised role, the page invites
 * speculative applications instead.
 */
export const careerRoles: CareerRole[] = [];

export const speculativeApplicationCopy =
  "We are not advertising a specific role right now, but we are always glad to hear from engineers, testers, and delivery people who work the way we do. Send a short note about what you would like to work on, along with your CV, and we will reply either way.";

export function getPublishedRoles(): CareerRole[] {
  return careerRoles.filter(isPublishable);
}
