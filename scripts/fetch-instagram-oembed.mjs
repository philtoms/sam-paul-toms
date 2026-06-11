#!/usr/bin/env node
/**
 * Build-time Instagram oEmbed thumbnail fetcher.
 *
 * Reads gallery markdown files from `src/content/gallery/`, identifies items
 * with `type: instagram` and an `instagramUrl`, fetches the thumbnail URL
 * from the Instagram oEmbed endpoint, and writes the result back into the
 * frontmatter's `thumbnail` field.
 *
 * Usage: node scripts/fetch-instagram-oembed.mjs
 *        npm run fetch:oembed
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

// --- Configuration ---

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GALLERY_DIR = path.resolve(__dirname, '..', 'src', 'content', 'gallery');
const OEMBED_ENDPOINT = 'https://graph.facebook.com/v18.0/instagram_oembed';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

// --- Helpers ---

/**
 * Sleep for the specified number of milliseconds.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch with retry and exponential backoff.
 * Returns the parsed JSON response or null on failure.
 */
async function fetchWithRetry(url, attempt = 1) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429 || response.status >= 500) {
        // Retryable errors
        if (attempt < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
          console.warn(
            `  ⚠️  HTTP ${response.status} on attempt ${attempt}/${MAX_RETRIES}, retrying in ${delay}ms...`,
          );
          await sleep(delay);
          return fetchWithRetry(url, attempt + 1);
        }
      }
      console.warn(
        `  ❌ HTTP ${response.status} after ${attempt} attempt(s) for ${url}`,
      );
      return null;
    }

    return await response.json();
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.warn(
        `  ⚠️  Network error on attempt ${attempt}/${MAX_RETRIES}, retrying in ${delay}ms...`,
      );
      await sleep(delay);
      return fetchWithRetry(url, attempt + 1);
    }
    console.warn(`  ❌ Network error after ${attempt} attempt(s): ${err.message}`);
    return null;
  }
}

/**
 * Build the oEmbed request URL.
 */
export function buildOembedUrl(instagramUrl) {
  const params = new URLSearchParams({
    url: instagramUrl,
    fields: 'thumbnail_url,thumbnail_width,thumbnail_height',
  });

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (accessToken) {
    params.set('access_token', accessToken);
  }

  return `${OEMBED_ENDPOINT}?${params.toString()}`;
}

/**
 * Load the cache from disk. Returns an empty map if cache is not configured
 * or the file doesn't exist.
 */
export function loadCache(cacheDir) {
  if (!cacheDir) return new Map();

  const cacheFile = path.join(cacheDir, 'instagram-oembed-cache.json');
  if (!fs.existsSync(cacheFile)) return new Map();

  try {
    const raw = fs.readFileSync(cacheFile, 'utf-8');
    const entries = JSON.parse(raw);

    if (!Array.isArray(entries)) return new Map();

    // Filter out expired entries on load
    const now = Date.now();
    const valid = entries.filter(
      (e) => e.timestamp && now - e.timestamp < CACHE_TTL_MS,
    );
    return new Map(valid.map((e) => [e.instagramUrl, e]));
  } catch {
    return new Map();
  }
}

/**
 * Save the cache to disk.
 */
export function saveCache(cacheDir, cache) {
  if (!cacheDir) return;

  fs.mkdirSync(cacheDir, { recursive: true });
  const cacheFile = path.join(cacheDir, 'instagram-oembed-cache.json');
  const entries = Array.from(cache.values());
  fs.writeFileSync(cacheFile, JSON.stringify(entries, null, 2), 'utf-8');
}

/**
 * Read all gallery markdown files and return parsed entries.
 */
export function readGalleryFiles(galleryDir) {
  const dir = galleryDir || GALLERY_DIR;
  if (!fs.existsSync(dir)) {
    console.warn(`Gallery directory not found: ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  return files.map((filename) => {
    const filePath = path.join(dir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return { filename, filePath, data, content };
  });
}

/**
 * Fetch the oEmbed thumbnail for a single Instagram URL.
 * Returns the thumbnail URL string or null on failure.
 */
export async function fetchThumbnail(instagramUrl, cache, cacheDir) {
  // Check cache first
  const cached = cache.get(instagramUrl);
  if (cached) {
    const now = Date.now();
    if (now - cached.timestamp < CACHE_TTL_MS) {
      console.log(`  📦 Cache hit for ${instagramUrl}`);
      return cached.thumbnailUrl;
    }
    // Expired — remove from cache
    cache.delete(instagramUrl);
  }

  const url = buildOembedUrl(instagramUrl);
  const result = await fetchWithRetry(url);

  if (result && result.thumbnail_url) {
    // Write to cache
    cache.set(instagramUrl, {
      instagramUrl,
      thumbnailUrl: result.thumbnail_url,
      timestamp: Date.now(),
    });

    return result.thumbnail_url;
  }

  return null;
}

/**
 * Get the gallery directory path (for testing).
 */
export function getGalleryDir() {
  return GALLERY_DIR;
}

// --- Main ---

async function main() {
  console.log('🖼️  Fetching Instagram oEmbed thumbnails...\n');

  const cacheDir = process.env.INSTAGRAM_OEMBED_CACHE_DIR || null;
  const cache = loadCache(cacheDir);

  const galleryFiles = readGalleryFiles();

  // Filter to instagram items with an instagramUrl
  const instagramItems = galleryFiles.filter(
    (f) => f.data.type === 'instagram' && f.data.instagramUrl,
  );

  if (instagramItems.length === 0) {
    console.log('No Instagram gallery items found.');
    process.exit(0);
  }

  console.log(
    `Found ${instagramItems.length} Instagram item(s) to process.\n`,
  );

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of instagramItems) {
    console.log(`  📸 ${item.filename} (${item.data.instagramUrl})`);

    try {
      const thumbnailUrl = await fetchThumbnail(
        item.data.instagramUrl,
        cache,
        cacheDir,
      );

      if (thumbnailUrl) {
        // Update the frontmatter and write back
        item.data.thumbnail = thumbnailUrl;
        const output = matter.stringify(item.content, item.data);
        fs.writeFileSync(item.filePath, output, 'utf-8');
        console.log(`     → Updated thumbnail: ${thumbnailUrl}`);
        updated++;
      } else {
        console.warn(
          `     ⏭  No thumbnail returned, keeping existing value: ${item.data.thumbnail || '(none)'}`,
        );
        skipped++;
      }
    } catch (err) {
      console.warn(
        `     ❌ Failed: ${err.message}. Keeping existing thumbnail: ${item.data.thumbnail || '(none)'}`,
      );
      failed++;
    }
  }

  // Save cache
  saveCache(cacheDir, cache);

  console.log(
    `\n✅ Done: ${updated} updated, ${skipped} skipped, ${failed} failed.`,
  );

  // Always exit 0 — never block the build
  process.exit(0);
}

// Only run main when executed directly (not when imported for testing)
const scriptPath = path.resolve(process.argv[1] || '');
const thisFile = fileURLToPath(import.meta.url);
if (scriptPath === thisFile) {
  main();
}
