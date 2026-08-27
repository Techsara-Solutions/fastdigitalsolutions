import { createHash } from "node:crypto";
import type { ImageSlot } from "@/lib/image-types";

/**
 * Fingerprint of a manifest slot. Stored in the generated record so the
 * validator can tell when the manifest changed without `npm run images`
 * being re-run (Node-only — used by scripts, never in the browser bundle).
 */
export function manifestHash(slot: ImageSlot, pipelineVersion: number): string {
  return createHash("sha1")
    .update(JSON.stringify({ slot, pipelineVersion }))
    .digest("hex")
    .slice(0, 12);
}
