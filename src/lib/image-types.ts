/**
 * Image pipeline contract shared by the manifest (src/content/image-manifest.ts),
 * the build script (scripts/build-images.ts), the validator, and the runtime.
 *
 * Coordinate rule: `focus` and `blurRegions` are measured on the ORIGINAL file
 * as it opens in a viewer (after EXIF orientation). Blur is applied before the
 * horizontal flip; the script mirrors `focus.x` itself when `flip` is set.
 *
 * This module must stay free of runtime imports — the build script loads it
 * before the generated image record exists.
 */

export type ImageClass = "hero" | "band" | "feature" | "card" | "tile" | "cover" | "thumb";

export type Aspect = "16:9" | "3:2" | "4:3" | "1:1" | "2.4:1";

export type BlurRegion = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Gaussian sigma in source pixels; defaults to 16. */
  sigma?: number;
};

export type ImageOps = {
  /** Mirror horizontally (used to move copy space to the left). */
  flip?: boolean;
  /** Regions to blur out (logos, readable third-party text). */
  blurRegions?: BlurRegion[];
  /** 1 = unchanged; 0.85 = slight desaturation. */
  saturation?: number;
  /** 1 = unchanged. */
  brightness?: number;
  /** Hue rotation in degrees. */
  hue?: number;
  /** ≥ 1; 1.25 crops to 80% of the largest crop that fits the aspect. */
  zoom?: number;
};

export type ImageSlot = {
  /** Kebab-case id; becomes the public filename prefix and the runtime key. */
  id: string;
  /** Path under the raw `images/` folder (gitignored). */
  source: string;
  class: ImageClass;
  aspect: Aspect;
  /** Focal point (0–1) in original orientation; defaults to the centre. */
  focus?: { x: number; y: number };
  ops?: ImageOps;
  /** Override the class default widths. */
  widths?: number[];
  /** Required unless `decorative`; informative images describe what is shown. */
  alt: string;
  /** Rendered with alt="" — purely atmospheric backgrounds under a scrim. */
  decorative?: boolean;
};

export type GeneratedImage = {
  id: string;
  class: ImageClass;
  alt: string;
  decorative: boolean;
  aspect: readonly [number, number];
  /** Intrinsic size of the largest derivative (used for `<img width/height>`). */
  width: number;
  height: number;
  /** Fallback `src`: the mid-width WebP. */
  src: string;
  /** Complete `srcset` strings per format. */
  sources: { avif: string; webp: string };
  widths: readonly number[];
  /** Hash of the manifest slot + pipeline version; the validator compares it. */
  manifestHash: string;
};

/** Widths emitted per class — sized to the largest CSS width each slot renders at. */
export const CLASS_WIDTHS: Record<ImageClass, readonly number[]> = {
  hero: [768, 1280, 1920],
  band: [768, 1280, 1920],
  feature: [480, 720, 1080],
  card: [400, 640, 960, 1200],
  tile: [400, 640, 960],
  cover: [480, 760, 1140, 1520],
  thumb: [320, 640],
};

export const CLASS_QUALITY: Record<ImageClass, { avif: number; webp: number }> = {
  hero: { avif: 52, webp: 74 },
  band: { avif: 42, webp: 68 },
  feature: { avif: 55, webp: 76 },
  card: { avif: 55, webp: 76 },
  tile: { avif: 52, webp: 74 },
  cover: { avif: 55, webp: 76 },
  thumb: { avif: 55, webp: 76 },
};

/** Per-file byte budgets (docs/CONTENT-GUIDE.md: below-the-fold images < ~200 KB). */
export const CLASS_MAX_BYTES: Record<ImageClass, number> = {
  hero: 260_000,
  band: 260_000,
  feature: 200_000,
  card: 200_000,
  tile: 200_000,
  cover: 200_000,
  thumb: 200_000,
};

export function parseAspect(aspect: Aspect): readonly [number, number] {
  switch (aspect) {
    case "16:9":
      return [16, 9];
    case "3:2":
      return [3, 2];
    case "4:3":
      return [4, 3];
    case "1:1":
      return [1, 1];
    case "2.4:1":
      return [12, 5];
  }
}

/**
 * `sizes` presets matching the layout widths each slot renders at, so browsers
 * pick the right srcset candidate (Lighthouse "properly sized images").
 */
export const SIZES = {
  full: "100vw",
  feature: "(min-width: 75rem) 520px, (min-width: 56.25rem) 42vw, 100vw",
  card3: "(min-width: 80rem) 400px, (min-width: 56.25rem) 45vw, 100vw",
  card2: "(min-width: 75rem) 600px, (min-width: 56.25rem) 48vw, 100vw",
  reading: "(min-width: 48rem) 760px, 100vw",
  thumb: "18rem",
} as const;
