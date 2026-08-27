import { getPublishedInsights } from "@/lib/insights";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { images, type GeneratedImage } from "@/lib/images";

export type NavLink = {
  label: string;
  href: string;
  /** One-line description shown under the label inside a menu panel. */
  description?: string;
};

export type NavGroup = {
  heading?: string;
  items: NavLink[];
};

export type NavFeatured = {
  image: GeneratedImage;
  title: string;
  copy: string;
  href: string;
  cta: string;
};

export type NavMenu = {
  groups: NavGroup[];
  /** "View all" link shown at the foot of the panel. */
  all?: NavLink;
  featured?: NavFeatured;
};

export type NavItem = NavLink & {
  /** Stable key for DOM ids and open-state tracking. */
  key: string;
  menu?: NavMenu;
};

/**
 * Primary navigation. Menus are built from the content collections so labels
 * never drift from the pages they point at; the header is a client component,
 * so everything here must be serialisable (featured images are resolved to
 * their generated records at build time).
 *
 * Launch gates:
 * - Insights appears only when at least three approved articles exist.
 * - Careers lives under Company and in the footer, not at the top level.
 */
export const INSIGHTS_NAV_MINIMUM = 3;

function serviceLinks(): NavLink[] {
  return services.map((service) => ({
    label: service.name,
    href: `/services/${service.slug}/`,
    description: service.clientNeed,
  }));
}

function industryLinks(): NavLink[] {
  return industries.map((industry) => ({
    label: industry.name,
    href: "/industries/",
    description: industry.challenge,
  }));
}

export function getPrimaryNavigation(): NavItem[] {
  const serviceItems = serviceLinks();
  const items: NavItem[] = [
    {
      key: "services",
      label: "Services",
      href: "/services/",
      menu: {
        groups: [
          { heading: "Build and modernise", items: serviceItems.slice(0, 3) },
          { heading: "Assure and sustain", items: serviceItems.slice(3) },
        ],
        all: { label: "All services", href: "/services/" },
        featured: {
          image: images["nav-services"],
          title: "How we work",
          copy: "Five stages, visible outputs, and documented decisions. The method behind every engagement.",
          href: "/how-we-work/",
          cta: "See the method",
        },
      },
    },
    {
      key: "industries",
      label: "Industries",
      href: "/industries/",
      menu: {
        groups: [{ heading: "Operating contexts we understand", items: industryLinks() }],
        all: { label: "All industries", href: "/industries/" },
      },
    },
    { key: "work", label: "Work", href: "/work/" },
    { key: "how-we-work", label: "How we work", href: "/how-we-work/" },
    {
      key: "company",
      label: "Company",
      href: "/about/",
      menu: {
        groups: [
          {
            items: [
              {
                label: "About",
                href: "/about/",
                description: "Who we are and the principles behind our delivery.",
              },
              {
                label: "Careers",
                href: "/careers/",
                description: "How we work and how to get in touch about joining.",
              },
              {
                label: "Contact",
                href: "/contact/",
                description: "Tell us what needs to move forward.",
              },
            ],
          },
        ],
        featured: {
          image: images["nav-company"],
          title: "Discuss your project",
          copy: "A reply from a person within two business days, whether that is an introduction, a next step, or a clear answer that we are not the right fit.",
          href: "/contact/",
          cta: "Get in touch",
        },
      },
    },
  ];

  if (getPublishedInsights().length >= INSIGHTS_NAV_MINIMUM) {
    items.splice(4, 0, { key: "insights", label: "Insights", href: "/insights/" });
  }
  return items;
}

export const footerCompanyLinks: NavLink[] = [
  { label: "About", href: "/about/" },
  { label: "How we work", href: "/how-we-work/" },
  { label: "Work", href: "/work/" },
  { label: "Insights", href: "/insights/" },
  { label: "Careers", href: "/careers/" },
  { label: "Contact", href: "/contact/" },
];
