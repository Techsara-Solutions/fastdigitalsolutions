/** Skip-to-content link, first focusable element on every page (PRD §19.2). */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-paper"
    >
      Skip to main content
    </a>
  );
}
