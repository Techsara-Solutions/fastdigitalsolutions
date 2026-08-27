import { preload } from "react-dom";
import { images, type ImageId } from "@/lib/images";
import { PictureFrame, type PictureFrameProps } from "@/components/ui/PictureFrame";

type PictureProps = Omit<PictureFrameProps, "image"> & { id: ImageId };

/**
 * Server-side convenience over PictureFrame: resolves a manifest id and, for
 * the page's LCP image, hoists a `<link rel="preload">` for the AVIF srcset
 * into `<head>` so the browser starts fetching before layout.
 */
export function Picture({ id, priority, sizes, ...rest }: PictureProps) {
  const image = images[id];
  if (priority) {
    preload(image.src, {
      as: "image",
      type: "image/avif",
      imageSrcSet: image.sources.avif,
      imageSizes: sizes,
      fetchPriority: "high",
    });
  }
  return <PictureFrame image={image} priority={priority} sizes={sizes} {...rest} />;
}
