import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/content/PageHero";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/** Custom 404: clear, professional, with useful routes onward. */
export default function NotFound() {
  return (
    <PageHero
      headingId="not-found-heading"
      eyebrow="404"
      title="This page could not be found."
      lead="The address may have changed or the page may no longer exist. These routes should get you back on track."
      actions={
        <>
          <Button href="/">Go to the home page</Button>
          <Button href="/services/" variant="secondary">
            Explore our services
          </Button>
          <Button href="/contact/" variant="secondary">
            Contact us
          </Button>
        </>
      }
    />
  );
}
