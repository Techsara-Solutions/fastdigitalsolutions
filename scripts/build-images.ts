/**
 * Build-time image pipeline.
 *
 * Reads the raw originals in `images/` (gitignored), applies the retouch ops
 * declared in src/content/image-manifest.ts, and writes AVIF + WebP
 * derivatives to `public/images/` plus a typed record to
 * `src/generated/images.ts`. Both outputs are committed — CI and the deploy
 * never need the originals or sharp.
 *
 *   npm run images              # everything
 *   npm run images -- --only hero-home
 *   npm run images -- --dry     # report crops and sizes, write nothing
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp, { type Sharp } from "sharp";

import { imageManifest, PIPELINE_VERSION } from "../src/content/image-manifest";
import {
  CLASS_MAX_BYTES,
  CLASS_QUALITY,
  CLASS_WIDTHS,
  parseAspect,
  type GeneratedImage,
  type ImageSlot,
} from "../src/lib/image-types";
import { manifestHash } from "../src/lib/image-hash";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "images");
const OUTPUT_DIR = path.join(ROOT, "public", "images");
const GENERATED_FILE = path.join(ROOT, "src", "generated", "images.ts");
const DERIVATIVE_PATTERN = /^[a-z0-9-]+-\d+\.[0-9a-f]{8}\.(avif|webp)$/;
const WARM_GRADE: [[number, number, number], [number, number, number], [number, number, number]] = [
  [1.04, 0, 0],
  [0, 1, 0],
  [0, 0, 0.94],
];

const args = process.argv.slice(2);
const dryRun = args.includes("--dry");
const onlyIndex = args.indexOf("--only");
const only = onlyIndex >= 0 ? args[onlyIndex + 1] : undefined;

type RawImage = { data: Buffer; width: number; height: number; channels: 3 | 4 };

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

async function materialise(pipeline: Sharp): Promise<RawImage> {
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels as 3 | 4 };
}

function open(image: RawImage): Sharp {
  return sharp(image.data, {
    raw: { width: image.width, height: image.height, channels: image.channels },
    // Two blur regions plus a full-frame flip on a 40-megapixel source exceed
    // sharp's default input pixel guard.
    limitInputPixels: false,
  });
}

/** Optional dimension record from the curation pass, if the JSON is present. */
function loadSourceRecord(): Map<string, { width: number; height: number }> {
  const record = new Map<string, { width: number; height: number }>();
  const candidates = [
    path.join(SOURCE_DIR, "images.json"),
    path.join(ROOT, "src", "content", "image-sources.json"),
  ];
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as {
      kept?: { file: string; width: number; height: number }[];
    };
    for (const entry of parsed.kept ?? []) {
      record.set(entry.file.replace(/\\/g, "/"), { width: entry.width, height: entry.height });
    }
    break;
  }
  return record;
}

function cropRect(slot: ImageSlot, width: number, height: number) {
  const [aw, ah] = parseAspect(slot.aspect);
  const target = aw / ah;
  const zoom = Math.max(1, slot.ops?.zoom ?? 1);
  let cw = width;
  let ch = Math.round(width / target);
  if (width / height > target) {
    ch = height;
    cw = Math.round(height * target);
  }
  cw = Math.round(cw / zoom);
  ch = Math.round(ch / zoom);

  let fx = slot.focus?.x ?? 0.5;
  const fy = slot.focus?.y ?? 0.5;
  if (slot.ops?.flip) fx = 1 - fx;

  const left = Math.min(Math.max(Math.round(fx * width - cw / 2), 0), width - cw);
  const top = Math.min(Math.max(Math.round(fy * height - ch / 2), 0), height - ch);
  return { left, top, width: cw, height: ch };
}

function sha1(buffer: Buffer): string {
  return createHash("sha1").update(buffer).digest("hex").slice(0, 8);
}

async function processSlot(
  slot: ImageSlot,
  sourceRecord: Map<string, { width: number; height: number }>,
): Promise<{ generated: GeneratedImage; files: string[]; report: string[] }> {
  const sourcePath = path.join(SOURCE_DIR, slot.source);
  if (!fs.existsSync(sourcePath)) fail(`${slot.id}: source not found — ${slot.source}`);

  let master = await materialise(sharp(sourcePath, { limitInputPixels: false }).rotate());

  const expected = sourceRecord.get(slot.source);
  if (
    expected &&
    !(
      (expected.width === master.width && expected.height === master.height) ||
      (expected.width === master.height && expected.height === master.width)
    )
  ) {
    fail(
      `${slot.id}: source is ${master.width}×${master.height} but the source record says ` +
        `${expected.width}×${expected.height} — blur/focus coordinates may be stale`,
    );
  }

  for (const region of slot.ops?.blurRegions ?? []) {
    if (region.x + region.w > master.width || region.y + region.h > master.height) {
      fail(`${slot.id}: blur region ${JSON.stringify(region)} exceeds the source bounds`);
    }
    const patch = await open(master)
      .extract({ left: region.x, top: region.y, width: region.w, height: region.h })
      .blur(region.sigma ?? 16)
      .png()
      .toBuffer();
    master = await materialise(
      open(master).composite([{ input: patch, left: region.x, top: region.y }]),
    );
  }

  if (slot.ops?.flip) master = await materialise(open(master).flop());

  const { saturation, brightness, hue } = slot.ops ?? {};
  if (saturation !== undefined || brightness !== undefined || hue !== undefined) {
    master = await materialise(
      open(master).modulate({
        ...(saturation !== undefined ? { saturation } : {}),
        ...(brightness !== undefined ? { brightness } : {}),
        ...(hue !== undefined ? { hue } : {}),
      }),
    );
  }

  // Site-wide warm grade: the licensed set is cool daylight, the palette is warm
  // graphite and terracotta. A gentle red-up/blue-down recomb reconciles them.
  master = await materialise(open(master).recomb(WARM_GRADE));

  const rect = cropRect(slot, master.width, master.height);
  const widths = slot.widths ?? CLASS_WIDTHS[slot.class];
  const maxWidth = Math.max(...widths);
  if (rect.width < maxWidth * 0.75) {
    fail(`${slot.id}: crop is only ${rect.width}px wide; ${maxWidth}px derivatives would upscale`);
  }
  if (rect.width < maxWidth) {
    console.warn(`  ⚠ ${slot.id}: crop ${rect.width}px is narrower than the ${maxWidth}px output`);
  }

  const [aw, ah] = parseAspect(slot.aspect);
  const quality = CLASS_QUALITY[slot.class];
  const maxBytes = CLASS_MAX_BYTES[slot.class];
  const files: string[] = [];
  const report: string[] = [];
  const avifCandidates: string[] = [];
  const webpCandidates: string[] = [];
  let fallbackSrc = "";
  let largest = { width: 0, height: 0 };

  for (const width of widths) {
    const height = Math.round((width * ah) / aw);
    const base = open(master)
      .extract(rect)
      .resize(width, height, { fit: "fill", kernel: "lanczos3" });
    const sharpened = width <= 960 ? base.sharpen({ sigma: 0.6, m1: 0.4, m2: 0.8 }) : base;

    const avif = await sharpened
      .clone()
      .avif({ quality: quality.avif, effort: 6, chromaSubsampling: "4:2:0" })
      .toBuffer();
    const webp = await sharpened
      .clone()
      .webp({ quality: quality.webp, effort: 5, smartSubsample: true })
      .toBuffer();

    for (const [buffer, ext] of [
      [avif, "avif"],
      [webp, "webp"],
    ] as const) {
      if (buffer.byteLength > maxBytes) {
        fail(
          `${slot.id}-${width}.${ext} is ${Math.round(buffer.byteLength / 1024)} KB, over the ` +
            `${Math.round(maxBytes / 1024)} KB budget for class "${slot.class}"`,
        );
      }
      const name = `${slot.id}-${width}.${sha1(buffer)}.${ext}`;
      files.push(name);
      if (!dryRun) fs.writeFileSync(path.join(OUTPUT_DIR, name), buffer);
      const url = `/images/${name}`;
      if (ext === "avif") avifCandidates.push(`${url} ${width}w`);
      else webpCandidates.push(`${url} ${width}w`);
    }
    report.push(
      `${slot.id.padEnd(48)} ${String(width).padStart(5)}w  avif ${String(
        Math.round(avif.byteLength / 1024),
      ).padStart(4)} KB  webp ${String(Math.round(webp.byteLength / 1024)).padStart(4)} KB`,
    );
    if (width >= largest.width) largest = { width, height };
  }

  const midWidth = widths[Math.floor((widths.length - 1) / 2)] ?? widths[0]!;
  fallbackSrc =
    webpCandidates.find((candidate) => candidate.endsWith(` ${midWidth}w`))?.split(" ")[0] ?? "";

  const generated: GeneratedImage = {
    id: slot.id,
    class: slot.class,
    alt: slot.decorative ? "" : slot.alt,
    decorative: Boolean(slot.decorative),
    aspect: [aw, ah],
    width: largest.width,
    height: largest.height,
    src: fallbackSrc,
    sources: { avif: avifCandidates.join(", "), webp: webpCandidates.join(", ") },
    widths,
    manifestHash: manifestHash(slot, PIPELINE_VERSION),
  };
  return { generated, files, report };
}

function readExistingGenerated(): Record<string, GeneratedImage> {
  if (!fs.existsSync(GENERATED_FILE)) return {};
  const source = fs.readFileSync(GENERATED_FILE, "utf8");
  const start = source.indexOf("/*__JSON__*/");
  const end = source.indexOf("/*__END__*/");
  if (start < 0 || end < 0) return {};
  return JSON.parse(source.slice(start + "/*__JSON__*/".length, end).trim()) as Record<
    string,
    GeneratedImage
  >;
}

function writeGenerated(record: Record<string, GeneratedImage>): void {
  const ordered = Object.fromEntries(
    Object.keys(record)
      .sort()
      .map((key) => [key, record[key]]),
  );
  const json = JSON.stringify(ordered, null, 2);
  const contents = `/* eslint-disable */
// AUTO-GENERATED by scripts/build-images.ts — run \`npm run images\`. Do not edit.
import type { GeneratedImage } from "@/lib/image-types";

export const images = /*__JSON__*/ ${json} /*__END__*/ as const satisfies Record<
  string,
  GeneratedImage
>;

export type ImageId = keyof typeof images;
`;
  fs.mkdirSync(path.dirname(GENERATED_FILE), { recursive: true });
  fs.writeFileSync(GENERATED_FILE, contents);
}

async function main(): Promise<void> {
  if (!fs.existsSync(SOURCE_DIR)) {
    fail("images/ (raw originals) is not present — this script only runs where the sources exist");
  }
  if (!dryRun) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const sourceRecord = loadSourceRecord();
  const slots = only ? imageManifest.filter((slot) => slot.id === only) : [...imageManifest];
  if (only && slots.length === 0) fail(`no manifest entry with id "${only}"`);

  const record = only ? readExistingGenerated() : {};
  const keep = new Set<string>();
  if (only) {
    for (const entry of Object.values(record)) {
      for (const candidate of [
        ...entry.sources.avif.split(", "),
        ...entry.sources.webp.split(", "),
      ]) {
        keep.add(candidate.split(" ")[0]!.replace("/images/", ""));
      }
    }
  }

  console.log(`Processing ${slots.length} slot(s)${dryRun ? " (dry run)" : ""}…\n`);
  const started = Date.now();

  // sharp is CPU-bound at AVIF effort 6; two slots at a time keeps memory sane.
  const queue = [...slots];
  const workers = Array.from({ length: 2 }, async () => {
    while (queue.length > 0) {
      const slot = queue.shift()!;
      const result = await processSlot(slot, sourceRecord);
      record[slot.id] = result.generated;
      for (const file of result.files) keep.add(file);
      for (const line of result.report) console.log(`  ${line}`);
    }
  });
  await Promise.all(workers);

  if (!dryRun) {
    for (const file of fs.readdirSync(OUTPUT_DIR)) {
      if (DERIVATIVE_PATTERN.test(file) && !keep.has(file)) {
        fs.unlinkSync(path.join(OUTPUT_DIR, file));
        console.log(`  – removed stale ${file}`);
      }
    }
    writeGenerated(record);
  }

  const total = [...keep].reduce((sum, file) => {
    const full = path.join(OUTPUT_DIR, file);
    return sum + (fs.existsSync(full) ? fs.statSync(full).size : 0);
  }, 0);
  console.log(
    `\nDone: ${keep.size} files, ${(total / 1024 / 1024).toFixed(1)} MB in public/images ` +
      `(${((Date.now() - started) / 1000).toFixed(0)}s).`,
  );
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
