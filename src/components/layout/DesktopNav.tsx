"use client";

import Link from "next/link";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import type { NavItem } from "@/content/navigation";
import { Container } from "@/components/ui/Container";
import { PictureFrame } from "@/components/ui/PictureFrame";
import { SIZES } from "@/lib/image-types";

type DesktopNavProps = {
  items: NavItem[];
  openKey: string | null;
  setOpenKey: Dispatch<SetStateAction<string | null>>;
  isCurrent: (href: string) => boolean;
};

const HOVER_OPEN_MS = 120;
const HOVER_CLOSE_MS = 200;

/**
 * Desktop primary navigation using the disclosure-navigation pattern: each
 * top-level item is a real link plus a chevron button that toggles a full-width
 * panel. Panels open on hover (mouse only, with intent delay), click, Enter,
 * Space, or ArrowDown; they close on Escape (focus returns to the button),
 * when focus leaves the item, on outside click, and on navigation. No
 * `role="menu"` — these are lists of links, not application menus.
 */
export function DesktopNav({ items, openKey, setOpenKey, isCurrent }: DesktopNavProps) {
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const panelRefs = useRef(new Map<string, HTMLDivElement>());
  const timer = useRef<number | null>(null);

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  /* Escape closes the open panel and returns focus to its button. */
  useEffect(() => {
    if (!openKey) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      const key = openKey;
      setOpenKey(null);
      buttonRefs.current.get(key)?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openKey, setOpenKey]);

  const scheduleOpen = (key: string) => {
    clearTimer();
    timer.current = window.setTimeout(() => setOpenKey(key), HOVER_OPEN_MS);
  };

  const scheduleClose = (key: string) => {
    clearTimer();
    timer.current = window.setTimeout(
      () => setOpenKey((current) => (current === key ? null : current)),
      HOVER_CLOSE_MS,
    );
  };

  const focusFirstLink = (key: string) => {
    requestAnimationFrame(() => {
      panelRefs.current.get(key)?.querySelector<HTMLAnchorElement>("a[href]")?.focus();
    });
  };

  return (
    <nav aria-label="Primary" className="hidden h-full md:block">
      <ul className="flex h-full items-center gap-5 lg:gap-7">
        {items.map((item) => {
          const hasMenu = Boolean(item.menu);
          const expanded = openKey === item.key;
          const linkClasses = `text-[0.9375rem] font-medium transition-colors hover:text-accent-dark ${
            isCurrent(item.href)
              ? "text-accent-dark underline decoration-accent decoration-2 underline-offset-8"
              : "text-ink"
          }`;

          if (!hasMenu) {
            return (
              <li key={item.key} className="flex h-full items-center">
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={linkClasses}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          const panelId = `nav-panel-${item.key}`;
          const buttonId = `nav-button-${item.key}`;

          return (
            <li
              key={item.key}
              className="flex h-full items-center gap-0.5"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") scheduleOpen(item.key);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") scheduleClose(item.key);
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setOpenKey((current) => (current === item.key ? null : current));
                }
              }}
            >
              <Link
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className={linkClasses}
              >
                {item.label}
              </Link>
              <button
                ref={(node) => {
                  if (node) buttonRefs.current.set(item.key, node);
                  else buttonRefs.current.delete(item.key);
                }}
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                aria-label={`${item.label} menu`}
                className={`inline-flex h-9 w-7 items-center justify-center rounded-md transition-colors hover:text-accent-dark ${
                  expanded ? "text-accent-dark" : "text-ink/70"
                }`}
                onClick={() => {
                  clearTimer();
                  setOpenKey(expanded ? null : item.key);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setOpenKey(item.key);
                    focusFirstLink(item.key);
                  }
                }}
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
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

              <div
                ref={(node) => {
                  if (node) panelRefs.current.set(item.key, node);
                  else panelRefs.current.delete(item.key);
                }}
                id={panelId}
                aria-labelledby={buttonId}
                hidden={!expanded}
                className="absolute inset-x-0 top-full border-b border-stone bg-paper shadow-[var(--shadow-panel)]"
              >
                <Container className="py-8 lg:py-10">
                  <div
                    className={`grid gap-8 ${
                      item.menu?.featured
                        ? item.menu.groups.length > 1
                          ? "lg:grid-cols-[1fr_1fr_18rem]"
                          : "lg:grid-cols-[1fr_18rem]"
                        : ""
                    }`}
                  >
                    {item.menu?.groups.map((group, index) => (
                      <div key={group.heading ?? index}>
                        {group.heading ? <p className="eyebrow mb-4">{group.heading}</p> : null}
                        <ul
                          className={
                            !item.menu?.featured && group.items.length > 3
                              ? "grid gap-x-8 gap-y-1 md:grid-cols-2"
                              : "space-y-1"
                          }
                        >
                          {group.items.map((link) => (
                            <li key={`${link.href}-${link.label}`}>
                              <Link
                                href={link.href}
                                className="group/link block rounded-[10px] px-3 py-2.5 transition-colors hover:bg-canvas focus-visible:bg-canvas"
                              >
                                <span className="block text-[0.9375rem] font-semibold text-ink group-hover/link:text-accent-dark">
                                  {link.label}
                                </span>
                                {link.description ? (
                                  <span className="mt-0.5 block text-sm leading-snug text-muted">
                                    {link.description}
                                  </span>
                                ) : null}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {index === 0 && item.menu?.all ? (
                          <Link
                            href={item.menu.all.href}
                            className="mt-4 inline-block px-3 text-sm font-semibold text-accent-dark hover:underline"
                          >
                            {item.menu.all.label} <span aria-hidden="true">→</span>
                          </Link>
                        ) : null}
                      </div>
                    ))}

                    {item.menu?.featured ? (
                      <Link
                        href={item.menu.featured.href}
                        className="card-lift group/featured flex flex-col overflow-hidden rounded-[12px] border border-stone bg-surface-card"
                      >
                        <PictureFrame
                          image={item.menu.featured.image}
                          decorative
                          sizes={SIZES.thumb}
                          pictureClassName="block aspect-[3/2] overflow-hidden bg-canvas"
                          className="h-full w-full object-cover"
                        />
                        <span className="flex flex-1 flex-col p-5">
                          <span className="text-base font-bold text-ink group-hover/featured:text-accent-dark">
                            {item.menu.featured.title}
                          </span>
                          <span className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                            {item.menu.featured.copy}
                          </span>
                          <span className="mt-4 text-sm font-semibold text-accent-dark">
                            {item.menu.featured.cta} <span aria-hidden="true">→</span>
                          </span>
                        </span>
                      </Link>
                    ) : null}
                  </div>
                </Container>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
