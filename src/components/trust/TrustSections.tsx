import {
  getPublishedCertifications,
  getPublishedClientLogos,
  getPublishedMetrics,
  getPublishedTestimonials,
} from "@/content/proof";
import { getPublishedPeople } from "@/content/people";
import { Container } from "@/components/ui/Container";
import { SectionIntro } from "@/components/ui/SectionIntro";

/**
 * Data-gated trust components (PRD §2.2, §16.4).
 *
 * Every component here renders NOTHING until approved AND verified records
 * exist in the content layer. They must never be populated with invented
 * clients, quotes, numbers, certifications, or people.
 */

export function ClientLogoGrid() {
  const logos = getPublishedClientLogos();
  if (logos.length === 0) return null;
  return (
    <section aria-label="Clients" className="bg-paper py-16">
      <Container>
        <ul className="grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {logos.map((logo) => (
            <li key={logo.organization} className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export uses pre-optimized assets */}
              <img
                src={logo.logoSrc}
                alt={logo.logoAlt}
                className="max-h-10 w-auto"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function TestimonialSection() {
  const testimonials = getPublishedTestimonials();
  if (testimonials.length === 0) return null;
  return (
    <section aria-label="Client testimonials" className="bg-canvas py-16 md:py-24">
      <Container>
        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <figure
              key={`${testimonial.personName}-${testimonial.organization}`}
              className="rounded-[12px] border border-stone bg-paper p-8"
            >
              <blockquote className="font-serif text-xl leading-snug text-ink">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm text-muted">
                <span className="font-semibold text-ink">{testimonial.personName}</span> —{" "}
                {testimonial.personRole}, {testimonial.organization}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function MetricStrip() {
  const metrics = getPublishedMetrics();
  if (metrics.length === 0) return null;
  return (
    <section aria-label="Delivery metrics" className="border-y border-stone bg-canvas py-10">
      <Container>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <li key={metric.label}>
              <p className="text-h2 font-semibold text-clay-dark">{metric.value}</p>
              <p className="mt-1 text-sm text-muted">{metric.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function CertificationList() {
  const certifications = getPublishedCertifications();
  if (certifications.length === 0) return null;
  return (
    <section aria-label="Certifications" className="bg-paper py-16">
      <Container>
        <ul className="flex flex-wrap gap-4">
          {certifications.map((certification) => (
            <li
              key={certification.name}
              className="rounded-full border border-stone bg-canvas px-4 py-2 text-sm font-medium"
            >
              {certification.name} — {certification.issuer}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function LeadershipGrid() {
  const leaders = getPublishedPeople();
  if (leaders.length === 0) return null;
  return (
    <section aria-labelledby="leadership-heading" className="bg-paper py-16 md:py-24">
      <Container>
        <SectionIntro
          id="leadership-heading"
          eyebrow="Leadership"
          title="The people accountable for delivery"
        />
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {leaders.map((person) => (
            <li key={person.name} className="rounded-[12px] border border-stone bg-white/40 p-6">
              {person.headshotSrc ? (
                // eslint-disable-next-line @next/next/no-img-element -- static export uses pre-optimized assets
                <img
                  src={person.headshotSrc}
                  alt={person.headshotAlt ?? person.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover"
                  loading="lazy"
                />
              ) : null}
              <h3 className="mt-4 text-lg font-bold">{person.name}</h3>
              <p className="text-sm font-medium text-clay-dark">{person.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{person.bio}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
