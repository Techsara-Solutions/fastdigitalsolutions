import Link from "next/link";
import { services } from "@/content/services";
import { footerCompanyLinks, footerLegalLinks } from "@/content/navigation";
import { siteConfig, isPlaceholder } from "@/content/site";

/**
 * Site footer (PRD §13.2). No social icons until real, maintained profiles
 * exist. No legal suffix until the entity is verified. The copyright year is
 * generated at build time.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const address = siteConfig.mailingAddress;

  return (
    <footer data-surface="dark" className="bg-espresso text-paper">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div className="max-w-sm">
            <p className="flex items-baseline gap-1.5 text-lg font-semibold tracking-tight">
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-[2px] bg-clay" />
              Fast<span className="font-normal">&nbsp;Digital Solutions</span>
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone">
              Technology delivery built around your business — cloud, AI, software engineering,
              quality, and flexible delivery capacity for growing organizations.
            </p>
            <p className="mt-6 text-sm text-stone/80">{siteConfig.sinceStatement}</p>
          </div>

          <nav aria-label="Footer services">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-stone">Services</h2>
            <ul className="mt-4 space-y-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}/`}
                    className="text-[0.9375rem] text-paper/90 hover:text-white hover:underline"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-10">
            <nav aria-label="Footer company">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-stone">Company</h2>
              <ul className="mt-4 space-y-2.5">
                {footerCompanyLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[0.9375rem] text-paper/90 hover:text-white hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-stone">Contact</h2>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-paper/90">
                <li>
                  <a href={siteConfig.phoneHref} className="hover:text-white hover:underline">
                    {siteConfig.phoneDisplay}
                  </a>
                </li>
                {!isPlaceholder(siteConfig.email) ? (
                  <li>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="hover:text-white hover:underline"
                    >
                      {siteConfig.email}
                    </a>
                  </li>
                ) : null}
                <li className="pt-2 text-sm leading-relaxed text-stone/90">
                  <span className="block font-semibold text-stone">{address.label}</span>
                  {address.line1}
                  <br />
                  {address.city}, {address.region} {address.postalCode}
                  <br />
                  {address.country}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-stone/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.brandName}. All rights reserved.
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
