import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  /**
   * Background surface. "navy" is the dark surface; "photo" is dark with a
   * positioned photograph behind the content (the child supplies the image
   * and scrim). Both set data-surface="dark" for eyebrow/focus/lead styles.
   */
  surface?: "paper" | "canvas" | "navy" | "photo";
  /** "normal" = standard rhythm; "tight" = reduced; "none" = child controls padding. */
  spacing?: "normal" | "tight" | "none";
  className?: string;
  id?: string;
  ariaLabelledby?: string;
};

const surfaceClasses: Record<NonNullable<SectionProps["surface"]>, string> = {
  paper: "bg-paper text-ink",
  canvas: "bg-canvas text-ink",
  navy: "bg-navy text-paper",
  photo: "relative isolate overflow-hidden bg-navy text-paper",
};

const spacingClasses: Record<NonNullable<SectionProps["spacing"]>, string> = {
  normal: "py-16 md:py-24 lg:py-28",
  tight: "py-16 md:py-20",
  none: "",
};

export function Section({
  children,
  surface = "paper",
  spacing = "normal",
  className = "",
  id,
  ariaLabelledby,
}: SectionProps) {
  const dark = surface === "navy" || surface === "photo";
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      data-surface={dark ? "dark" : "light"}
      className={`${surfaceClasses[surface]} ${spacingClasses[spacing]} ${className}`}
    >
      {children}
    </section>
  );
}
