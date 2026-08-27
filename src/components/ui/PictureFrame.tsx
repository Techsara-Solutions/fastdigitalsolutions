import type { GeneratedImage } from "@/lib/image-types";

export type PictureFrameProps = {
  image: GeneratedImage;
  /** `sizes` attribute — use a SIZES preset so the browser picks the right candidate. */
  sizes: string;
  /** Only the LCP image on a page: eager, high fetch priority. */
  priority?: boolean;
  /** Force alt="" (atmospheric backgrounds under a scrim). */
  decorative?: boolean;
  /** Override the manifest alt text for this placement. */
  alt?: string;
  /** Classes for the `<img>`. */
  className?: string;
  /** Classes for the `<picture>` wrapper. */
  pictureClassName?: string;
};

/**
 * Format-negotiated, CLS-free image markup for pre-built derivatives.
 *
 * Plain markup with no directive so both server components and the client
 * header can render it. `next/image` is deliberately not used: the static
 * export runs with `images.unoptimized`, which would emit a single `<img>`
 * with no srcset and no AVIF/WebP negotiation.
 */
export function PictureFrame({
  image,
  sizes,
  priority = false,
  decorative = false,
  alt,
  className = "",
  pictureClassName = "",
}: PictureFrameProps) {
  const isDecorative = decorative || image.decorative;
  return (
    <picture className={pictureClassName}>
      <source type="image/avif" srcSet={image.sources.avif} sizes={sizes} />
      <source type="image/webp" srcSet={image.sources.webp} sizes={sizes} />
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={isDecorative ? "" : (alt ?? image.alt)}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={`h-auto w-full ${className}`}
      />
    </picture>
  );
}
