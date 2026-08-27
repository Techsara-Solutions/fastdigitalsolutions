import { images, type ImageId } from "@/generated/images";
import type { GeneratedImage } from "@/lib/image-types";

export { images, type ImageId };
export { SIZES } from "@/lib/image-types";
export type { GeneratedImage } from "@/lib/image-types";

/** Narrow a content-supplied string to a generated image id. */
export function isImageId(value: string | undefined | null): value is ImageId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(images, value);
}

export function getImage(id: ImageId): GeneratedImage {
  return images[id];
}
