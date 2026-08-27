"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NavItem } from "@/content/navigation";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/layout/Wordmark";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileNav } from "@/components/layout/MobileNav";

type SiteHeaderProps = {
  items: NavItem[];
};

/**
 * Sticky site header: desktop navigation with disclosure mega-menus and an
 * accessible mobile navigation dialog (focus trap, Escape, scroll lock,
 * focus returned to the trigger on close).
 */
export function SiteHeader({ items }: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [lastPathname, setLastPathname] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* Any navigation closes whatever is open (state adjusted during render). */
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpenKey(null);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Outside click closes the desktop panel. */
  useEffect(() => {
    if (!openKey) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenKey(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openKey]);

  const closeMobile = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);

  return (
    <header
      ref={headerRef}
      // No backdrop-filter here: it would become the containing block for the
      // fixed-position mobile dialog and clip it to the header bar.
      className={`sticky top-0 z-40 bg-paper transition-shadow ${
        scrolled || openKey ? "border-b border-stone" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[4.5rem] lg:px-12">
        <Wordmark />

        <DesktopNav items={items} openKey={openKey} setOpenKey={setOpenKey} isCurrent={isCurrent} />

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

      {open ? <MobileNav items={items} isCurrent={isCurrent} onClose={closeMobile} /> : null}
    </header>
  );
}
