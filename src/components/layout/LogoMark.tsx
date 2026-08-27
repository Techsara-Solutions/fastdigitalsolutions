import { LOGO_MARK_D, LOGO_SQUARE_D, LOGO_VIEWBOX } from "@/components/layout/logo-paths";

type LogoMarkProps = {
  className?: string;
  /** Fill for the small accent square; defaults to the palette accent. */
  accent?: string;
};

/**
 * The FDS mark. The letterforms are one compound path filled with
 * `currentColor` (even-odd, so the counters are real holes), which makes the
 * same component work on the light header and the dark footer. Decorative:
 * the surrounding link carries the accessible name.
 */
export function LogoMark({ className = "", accent = "var(--color-accent)" }: LogoMarkProps) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <path fill="currentColor" fillRule="evenodd" d={LOGO_MARK_D} />
      <path fill={accent} d={LOGO_SQUARE_D} />
    </svg>
  );
}
