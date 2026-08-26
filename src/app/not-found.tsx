import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/** Custom 404 (PRD §14.11): clear, professional, with useful routes onward. */
export default function NotFound() {
  return (
    <Section surface="paper" ariaLabelledby="not-found-heading">
      <Container>
        <div className="max-w-[40rem] py-12">
          <p className="eyebrow mb-4">404</p>
          <h1 id="not-found-heading" className="text-h1 font-semibold">
            This page could not be found.
          </h1>
          <p className="mt-6 text-lead text-muted">
            The address may have changed or the page may no longer exist. These routes should get
            you back on track.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/">Go to the home page</Button>
            <Button href="/services/" variant="secondary">
              Explore our services
            </Button>
            <Button href="/contact/" variant="secondary">
              Contact us
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
