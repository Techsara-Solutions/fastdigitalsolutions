import Link from "next/link";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { footerCompanyLinks, footerLegalLinks } from "@/content/navigation";
import { siteConfig, isPlaceholder } from "@/content/site";

const linkClasses = "text-[0.9375rem] text-paper/85 hover:text-white hover:underline";
const headingClasses = "text-sm font-bold uppercase tracking-[0.14em] text-paper/70";

/**
 * Site footer. No social icons until real, maintained profiles exist. The
 * copyright line carries the registered legal name; the brand lockup stays
 * the short brand name. The copyright year is generated at build time.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const address = siteConfig.mailingAddress;

  return (
    <footer data-surface="dark" className="bg-navy text-paper">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:gap-10">
          <div className="max-w-sm md:col-span-2 lg:col-span-1">
            <p className="flex items-baseline gap-1.5 text-lg font-semibold tracking-tight">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-[2px] bg-accent"
              />
              Fast<span className="font-normal">&nbsp;Digital Solutions</span>
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-paper/80">
              Technology delivery built around your business — cloud, AI, software engineering,
              quality, and flexible delivery capacity for growing organizations.
            </p>
            <p className="mt-6 text-[0.9375rem]">
              <a href={siteConfig.phoneHref} className="font-semibold hover:underline">
                {siteConfig.phoneDisplay}
              </a>
              <span className="text-paper/70"> · {siteConfig.timeZoneLabel}</span>
            </p>
            {!isPlaceholder(siteConfig.email) ? (
              <p className="mt-1 text-[0.9375rem]">
                <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                  {siteConfig.email}
                </a>
              </p>
            ) : null}
          </div>

          <nav aria-label="Footer services">
            <h2 className={headingClasses}>Services</h2>
            <ul className="mt-4 space-y-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}/`} className={linkClasses}>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer industries">
            <h2 className={headingClasses}>Industries</h2>
            <ul className="mt-4 space-y-2.5">
              {industries.map((industry) => (
                <li key={industry.slug}>
                  <Link href="/industries/" className={linkClasses}>
                    {industry.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer company">
            <h2 className={headingClasses}>Company</h2>
            <ul className="mt-4 space-y-2.5">
              {footerCompanyLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClasses}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={headingClasses}>Contact</h2>
            <p className="mt-4 text-sm leading-relaxed text-paper/80">
              <span className="block font-semibold text-paper/90">{address.label}</span>
              {address.line1}
              <br />
              {address.city}, {address.region} {address.postalCode}
              <br />
              {address.country}
            </p>
            <p className="mt-4 text-sm text-paper/80">
              Enquiries answered {siteConfig.responseCommitment}.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-paper/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLegalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
