import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/content/PageHero";
import { CtaPanel } from "@/components/content/CtaPanel";
import { getPublishedRoles, speculativeApplicationCopy } from "@/content/careers";
import { workingCommitments } from "@/content/delivery-method";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description:
    "Working at Fast Digital Solutions: how we work, what we look for, and how to get in touch about joining the team.",
  path: "/careers/",
});

/**
 * Careers page. Advertised roles render when real, approved roles exist;
 * otherwise the page invites speculative applications.
 */
export default function CareersPage() {
  const roles = getPublishedRoles();

  return (
    <>
      <PageHero
        headingId="careers-hero"
        variant="split"
        image="hero-careers"
        eyebrow="Careers"
        title="Work that treats craft and straight talk as defaults."
        lead="We are a focused digital engineering team. When we hire, we look for people who care about maintainable work, direct communication, and leaving clients better off than they found them."
      />

      <Section surface="canvas" ariaLabelledby="openings-heading">
        <Container>
          <h2 id="openings-heading" className="text-h2 font-semibold">
            {roles.length === 0 ? "Working with us" : "Open roles"}
          </h2>
          {roles.length === 0 ? (
            <div className="mt-8 max-w-[44rem] rounded-[12px] border border-stone bg-surface-card p-8">
              <p className="text-[1.0625rem] leading-relaxed text-ink/85">
                {speculativeApplicationCopy}
              </p>
              <p className="mt-5 text-[1.0625rem] font-semibold">
                <a
                  href={`mailto:${siteConfig.email}?subject=Working%20with%20Fast%20Digital%20Solutions`}
                  className="text-accent-dark underline underline-offset-4"
                >
                  {siteConfig.email}
                </a>
              </p>
            </div>
          ) : (
            <div className="mt-10 space-y-6">
              {roles.map((role) => (
                <article
                  key={role.slug}
                  className="rounded-[12px] border border-stone bg-surface-card p-6 lg:p-8"
                >
                  <h3 className="text-h3 font-semibold">{role.title}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {role.employmentType} · {role.location} · {role.timeZoneExpectations}
                  </p>
                  <div className="mt-5 grid gap-8 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-muted">
                        Responsibilities
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {role.responsibilities.map((item) => (
                          <li key={item} className="flex gap-2.5 text-[0.9375rem] text-ink/85">
                            <span
                              aria-hidden="true"
                              className="mt-[0.55em] h-1 w-3 shrink-0 rounded-full bg-accent/70"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-muted">
                        Required skills
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {role.requiredSkills.map((item) => (
                          <li key={item} className="flex gap-2.5 text-[0.9375rem] text-ink/85">
                            <span
                              aria-hidden="true"
                              className="mt-[0.55em] h-1 w-3 shrink-0 rounded-full bg-olive/70"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="mt-6 border-t border-stone pt-5 text-[0.9375rem] text-muted">
                    How to apply: {role.applicationDestination}
                  </p>
                </article>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section surface="paper" ariaLabelledby="working-here-heading">
        <Container>
          <h2 id="working-here-heading" className="text-h2 font-semibold">
            How we work, with clients and with each other
          </h2>
          <ul className="mt-10 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {workingCommitments.map((commitment) => (
              <li key={commitment} className="flex gap-3 text-[0.9375rem] text-ink/85">
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] h-1 w-3 shrink-0 rounded-full bg-accent/70"
                />
                {commitment}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaPanel
        heading="Here about a project instead?"
        copy="If you are a prospective client and not a candidate, we would be glad to hear what you are working on."
      />
    </>
  );
}
