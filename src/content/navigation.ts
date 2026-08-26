import { getPublishedInsights } from "@/lib/insights";

export type NavItem = {
  label: string;
  href: string;
};

/**
 * Primary navigation (PRD §12.1).
 *
 * Launch gates applied here:
 * - Insights appears only when at least three approved articles exist (PRD §14.8).
 * - Careers lives in the footer and About page, not primary navigation.
 */
const baseNavigation: NavItem[] = [
  { label: "Services", href: "/services/" },
  { label: "Industries", href: "/industries/" },
  { label: "Work", href: "/work/" },
  { label: "How we work", href: "/how-we-work/" },
  { label: "About", href: "/about/" },
];

export const INSIGHTS_NAV_MINIMUM = 3;

export function getPrimaryNavigation(): NavItem[] {
  const items = [...baseNavigation];
  if (getPublishedInsights().length >= INSIGHTS_NAV_MINIMUM) {
    items.splice(4, 0, { label: "Insights", href: "/insights/" });
  }
  return items;
}

export const footerServiceLinksHeading = "Services";

export const footerCompanyLinks: NavItem[] = [
  { label: "About", href: "/about/" },
  { label: "How we work", href: "/how-we-work/" },
  { label: "Work", href: "/work/" },
  { label: "Careers", href: "/careers/" },
  { label: "Contact", href: "/contact/" },
];

export const footerLegalLinks: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy/" },
  { label: "Terms of Use", href: "/terms/" },
  { label: "Accessibility", href: "/accessibility/" },
];
