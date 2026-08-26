import type { Certification, ClientLogo, Metric, Testimonial } from "@/lib/schemas";
import { isPublishable } from "@/lib/schemas";

/**
 * Gated trust content (PRD §2.2, §16.4): client logos, testimonials, metrics,
 * certifications.
 *
 * ALL EMPTY BY DESIGN. The FTC prohibits fake or misattributed testimonials,
 * and the PRD forbids invented clients, metrics, certifications, awards, and
 * partner statuses. Components for this content exist but render nothing until
 * records here are both approved and verified with an approval reference.
 */
export const testimonials: Testimonial[] = [];
export const clientLogos: ClientLogo[] = [];
export const metrics: Metric[] = [];
export const certifications: Certification[] = [];

export function getPublishedTestimonials(): Testimonial[] {
  return testimonials.filter(isPublishable);
}

export function getPublishedClientLogos(): ClientLogo[] {
  return clientLogos.filter(isPublishable);
}

export function getPublishedMetrics(): Metric[] {
  return metrics.filter(isPublishable);
}

export function getPublishedCertifications(): Certification[] {
  return certifications.filter(isPublishable);
}
