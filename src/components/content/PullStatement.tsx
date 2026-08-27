import type { ReactNode } from "react";

/**
 * Editorial pull statement (PRD §15.4): the only sanctioned use of the serif
 * accent face. For selected statements, never navigation or dense body text.
 */
export function PullStatement({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-2 border-accent pl-6 font-serif text-[1.5rem] leading-snug text-ink md:text-[1.75rem]">
      {children}
    </blockquote>
  );
}
