"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/layout/Wordmark";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type MobileNavProps = {
  items: NavItem[];
  isCurrent: (href: string) => boolean;
  onClose: () => void;
};

/**
 * Full-screen mobile navigation dialog: focus trap while open, Escape closes,
 * body scrolling disabled. Menu groups are accordions; a collapsed group is
 * not rendered at all (rather than `hidden`) so the focus trap never lands on
 * an invisible link.
 */
export function MobileNav({ items, isCurrent, onClose }: MobileNavProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
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
  }, [onClose]);

  return (
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
          onClick={onClose}
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
          {items.map((item) => {
            const expanded = openGroup === item.key;
            const groupId = `mobile-group-${item.key}`;
            return (
              <li key={item.key}>
                <div className="flex items-center gap-1">
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    onClick={onClose}
                    className={`block flex-1 rounded-md px-3 py-3 text-lg font-medium ${
                      isCurrent(item.href) ? "bg-canvas text-accent-dark" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.menu ? (
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={groupId}
                      aria-label={`${item.label} submenu`}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-ink/70"
                      onClick={() => setOpenGroup(expanded ? null : item.key)}
                    >
                      <svg
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 14 14"
                        fill="none"
                        className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                      >
                        <path
                          d="M3 5l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ) : null}
                </div>
                {item.menu && expanded ? (
                  <ul id={groupId} className="mb-2 ml-3 border-l border-stone pl-3">
                    {item.menu.groups
                      .flatMap((group) => group.items)
                      .map((link) => (
                        <li key={`${link.href}-${link.label}`}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className="block rounded-md px-3 py-2.5 text-base text-ink/85 hover:text-accent-dark"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    {item.menu.all ? (
                      <li>
                        <Link
                          href={item.menu.all.href}
                          onClick={onClose}
                          className="block px-3 py-2.5 text-sm font-semibold text-accent-dark"
                        >
                          {item.menu.all.label} <span aria-hidden="true">→</span>
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
        <div className="mt-8 flex flex-col gap-4 border-t border-stone pt-8">
          <Button href="/contact/" onClick={onClose}>
            Discuss your project
          </Button>
          <a
            href={siteConfig.phoneHref}
            className="px-3 text-base font-medium text-accent-dark underline underline-offset-4"
          >
            {siteConfig.phoneDisplay}
          </a>
        </div>
      </nav>
    </div>
  );
}
