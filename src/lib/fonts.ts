import localFont from "next/font/local";

/**
 * Self-hosted, latin-subset variable fonts (PRD §15.4 / §20.7).
 * No third-party runtime font requests are permitted.
 */
export const manrope = localFont({
  src: "../fonts/manrope-latin-variable.woff2",
  display: "swap",
  weight: "200 800",
  variable: "--font-manrope",
});

export const sourceSerif = localFont({
  src: "../fonts/source-serif-4-latin-variable.woff2",
  display: "swap",
  weight: "200 900",
  variable: "--font-source-serif",
  // Editorial accent only (pull statements) — never above the fold, so no preload.
  preload: false,
});
