#!/usr/bin/env node
/**
 * Remove public/audio-samples from the Astro build output.
 *
 * Files in public/ are copied verbatim into dist/ by Astro — there is no
 * built-in exclude mechanism. Audio samples are served from R2 instead, so
 * we strip them from dist/ to avoid uploading ~1 GB to Cloudflare on every
 * deploy.
 */
import { rmSync } from "node:fs";
import { resolve } from "node:path";

const dir = resolve("dist/audio-samples");

try {
  rmSync(dir, { recursive: true, force: true });
  console.log("✔ Removed dist/audio-samples");
} catch (err) {
  console.error("✘ Failed to remove dist/audio-samples:", err.message);
  process.exit(1);
}
