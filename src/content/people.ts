import type { Person } from "@/lib/schemas";
import { isPublishable } from "@/lib/schemas";

/**
 * Leadership profiles (PRD §14.7).
 *
 * EMPTY BY DESIGN. Until real leadership information is provided and approved:
 * no invented names, roles, bios, headshots, or profile links, and no
 * anonymous silhouettes. The About page simply omits the section while this
 * list has no publishable entries.
 */
export const people: Person[] = [];

export function getPublishedPeople(): Person[] {
  return people.filter(isPublishable);
}
