/**
 * Bespoke line/grid composition for the hero (PRD §14.1A, §15.2):
 * architecture-inspired geometry in stone and clay. Purely decorative
 * (aria-hidden) and lightweight — inline SVG, no images, no animation.
 */
export function GeoMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 480 480"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Fine structural grid */}
      <g stroke="var(--color-stone)" strokeWidth="1">
        <path d="M60 0v480M180 0v480M300 0v480M420 0v480" />
        <path d="M0 60h480M0 180h480M0 300h480M0 420h480" />
      </g>
      {/* Emphasised structural lines */}
      <g stroke="var(--color-muted)" strokeWidth="1.25" opacity="0.55">
        <path d="M180 60h240M180 60v240" />
        <path d="M60 300h240v120" />
      </g>
      {/* Diagonal tension lines */}
      <g stroke="var(--color-olive)" strokeWidth="1" opacity="0.5">
        <path d="M180 300 300 180M300 420 420 300" />
      </g>
      {/* Clay accents — kept sparse */}
      <rect x="300" y="180" width="120" height="120" stroke="var(--color-clay)" strokeWidth="1.5" />
      <rect x="164" y="284" width="32" height="32" fill="var(--color-clay)" opacity="0.85" />
      <circle cx="180" cy="60" r="5" fill="var(--color-clay-dark)" />
      <circle cx="420" cy="300" r="5" fill="var(--color-olive)" opacity="0.8" />
    </svg>
  );
}
