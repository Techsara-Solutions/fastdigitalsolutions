import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  /** Background surface. "espresso" is the dark surface (sets data-surface for focus/eyebrow styles). */
  surface?: "paper" | "canvas" | "espresso";
  /** "normal" = standard section rhythm; "tight" = reduced (PRD §15.5 spacing). */
  spacing?: "normal" | "tight";
  className?: string;
  id?: string;
  ariaLabelledby?: string;
};

const surfaceClasses: Record<NonNullable<SectionProps["surface"]>, string> = {
  paper: "bg-paper text-ink",
  canvas: "bg-canvas text-ink",
  espresso: "bg-espresso text-paper",
};

export function Section({
  children,
  surface = "paper",
  spacing = "normal",
  className = "",
  id,
  ariaLabelledby,
}: SectionProps) {
  const pad = spacing === "tight" ? "py-16 md:py-20" : "py-16 md:py-24 lg:py-28";
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      data-surface={surface === "espresso" ? "dark" : "light"}
      className={`${surfaceClasses[surface]} ${pad} ${className}`}
    >
      {children}
    </section>
  );
}
