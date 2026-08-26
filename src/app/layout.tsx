import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { manrope, sourceSerif } from "@/lib/fonts";
import { SkipLink } from "@/components/layout/SkipLink";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { OrganizationJsonLd } from "@/components/content/OrganizationJsonLd";
import { getPrimaryNavigation } from "@/content/navigation";
import { getSiteUrl, isPlaceholder, siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.brandName}`,
    default: `Cloud, AI and Digital Engineering | ${siteConfig.brandName}`,
  },
  description:
    "Fast Digital Solutions helps growing organizations modernize applications, move to the cloud, automate operations, and strengthen engineering delivery.",
  ...(isPlaceholder(getSiteUrl()) ? { robots: { index: false, follow: false } } : {}),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${sourceSerif.variable}`}>
      <body>
        <SkipLink />
        <SiteHeader items={getPrimaryNavigation()} />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
