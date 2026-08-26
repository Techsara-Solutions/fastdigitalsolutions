import type { ReactNode } from "react";

type SectionIntroProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Heading id, so sections can reference it via aria-labelledby. */
  id?: string;
  align?: "left" | "center";
  className?: string;
};

/** Consistent section opener: eyebrow, heading, optional lead (PRD §16.3). */
export function SectionIntro({
  eyebrow,
  title,
  lead,
  id,
  align = "left",
  className = "",
}: SectionIntroProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-[46rem] ${alignment} ${className}`}>
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h2 id={id} className="text-h2 font-semibold">
        {title}
      </h2>
      {lead ? (
        <p className="mt-5 text-lead text-muted [[data-surface=dark]_&]:text-stone">{lead}</p>
      ) : null}
    </div>
  );
}
