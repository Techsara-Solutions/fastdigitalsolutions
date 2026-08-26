"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NavItem } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/layout/Wordmark";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type SiteHeaderProps = {
  items: NavItem[];
};

/**
 * Sticky site header with desktop navigation and an accessible mobile
 * navigation dialog (PRD §13.1): focus trap while open, Escape closes,
 * body scrolling disabled, focus returned to the trigger on close.
 */
export function SiteHeader({ items }: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  /* Focus trap + Escape + scroll lock while the mobile menu is open. */
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusables[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-40 bg-paper transition-shadow ${
        scrolled ? "border-b border-stone" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[4.5rem] lg:px-12">
        <Wordmark />

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 lg:gap-8">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={`text-[0.9375rem] font-medium transition-colors hover:text-clay-dark ${
                    isCurrent(item.href)
                      ? "text-clay-dark underline decoration-clay decoration-2 underline-offset-8"
                      : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <Button href="/contact/">Discuss your project</Button>
        </div>

        {/* Mobile menu trigger */}
        <button
          ref={triggerRef}
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-ink/20 px-3 py-2 text-sm font-semibold md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(true)}
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M2 4.5h14M2 9h14M2 13.5h14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          Menu
        </button>
      </div>

      {/* Mobile navigation dialog */}
      {open ? (
        <div
          ref={dialogRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 flex flex-col bg-paper md:hidden"
        >
          <div className="flex h-16 items-center justify-between px-5 sm:px-8">
            <Wordmark />
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-ink/20 px-3 py-2 text-sm font-semibold"
              onClick={close}
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 3l10 10M13 3L3 13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              Close
            </button>
          </div>
          <nav aria-label="Primary" className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
            <ul className="flex flex-col gap-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`block rounded-md px-3 py-3 text-lg font-medium ${
                      isCurrent(item.href) ? "bg-canvas text-clay-dark" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-4 border-t border-stone pt-8">
              <Button href="/contact/" onClick={() => setOpen(false)}>
                Discuss your project
              </Button>
              <a
                href={siteConfig.phoneHref}
                className="px-3 text-base font-medium text-clay-dark underline underline-offset-4"
              >
                {siteConfig.phoneDisplay}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
