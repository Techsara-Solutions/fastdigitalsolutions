import { getPublishedPeople } from "@/content/people";
import { Container } from "@/components/ui/Container";
import { SectionIntro } from "@/components/ui/SectionIntro";

/**
 * Data-gated leadership section. Renders NOTHING until approved AND verified
 * profiles exist in the content layer. Never populate it with invented people.
 */
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
            <li
              key={person.name}
              className="rounded-[12px] border border-stone bg-surface-card p-6"
            >
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
              <p className="text-sm font-medium text-accent-dark">{person.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{person.bio}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
