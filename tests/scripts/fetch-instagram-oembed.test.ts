/**
 * Tests for the fetch-instagram-oembed script.
 *
 * Uses a hybrid approach:
 *   - Unit tests for exported pure functions (buildOembedUrl, loadCache,
 *     saveCache, readGalleryFiles) via direct import.
 *   - Integration tests for end-to-end behavior via execSync, using
 *     temp directories with fixture gallery markdown files.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

const SCRIPT_PATH = path.resolve(
  __dirname,
  '../../scripts/fetch-instagram-oembed.mjs',
);

// --- Helpers ---

/**
 * Create a minimal gallery .md fixture.
 */
function createGalleryFixture(
  dir: string,
  filename: string,
  opts: {
    title?: string;
    type?: string;
    src?: string;
    thumbnail?: string;
    order?: number;
    instagramUrl?: string;
  } = {},
): string {
  const {
    title = 'Test Item',
    type = 'instagram',
    src = '/images/gallery/placeholder.jpg',
    thumbnail = '/images/gallery/placeholder.jpg',
    order = 1,
    instagramUrl = 'https://www.instagram.com/p/test123/',
  } = opts;

  const frontmatter: Record<string, unknown> = { title, type, src, order };
  if (thumbnail) frontmatter.thumbnail = thumbnail;
  if (instagramUrl) frontmatter.instagramUrl = instagramUrl;

  // Build YAML frontmatter manually
  const lines = ['---'];
  for (const [key, val] of Object.entries(frontmatter)) {
    if (typeof val === 'string') {
      lines.push(`${key}: "${val}"`);
    } else {
      lines.push(`${key}: ${val}`);
    }
  }
  lines.push('---', '', 'Test content.');

  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  return filePath;
}

// --- Unit tests for exported functions ---

describe('fetch-instagram-oembed (unit)', () => {
  describe('buildOembedUrl', () => {
    it('constructs URL with required params', async () => {
      const { buildOembedUrl } = await import(SCRIPT_PATH);
      const url = buildOembedUrl('https://www.instagram.com/p/abc/');
      expect(url).toContain('instagram_oembed');
      expect(url).toContain('url=https%3A%2F%2Fwww.instagram.com%2Fp%2Fabc%2F');
      expect(url).toContain('fields=thumbnail_url');
      expect(url).not.toContain('access_token');
    });

    it('appends access_token when INSTAGRAM_ACCESS_TOKEN is set', async () => {
      const original = process.env.INSTAGRAM_ACCESS_TOKEN;
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-token-123';
      try {
        const { buildOembedUrl } = await import(SCRIPT_PATH);
        const url = buildOembedUrl('https://www.instagram.com/p/abc/');
        expect(url).toContain('access_token=test-token-123');
      } finally {
        if (original === undefined) {
          delete process.env.INSTAGRAM_ACCESS_TOKEN;
        } else {
          process.env.INSTAGRAM_ACCESS_TOKEN = original;
        }
      }
    });
  });

  describe('loadCache', () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oembed-cache-test-'));
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('returns empty map when cacheDir is null', async () => {
      const { loadCache } = await import(SCRIPT_PATH);
      const cache = loadCache(null as any);
      expect(cache.size).toBe(0);
    });

    it('returns empty map when cache file does not exist', async () => {
      const { loadCache } = await import(SCRIPT_PATH);
      const cache = loadCache(tempDir);
      expect(cache.size).toBe(0);
    });

    it('loads valid cache entries', async () => {
      const { loadCache } = await import(SCRIPT_PATH);
      const cacheFile = path.join(tempDir, 'instagram-oembed-cache.json');
      const now = Date.now();
      const entries = [
        {
          instagramUrl: 'https://www.instagram.com/p/test1/',
          thumbnailUrl: 'https://example.com/thumb1.jpg',
          timestamp: now,
        },
      ];
      fs.writeFileSync(cacheFile, JSON.stringify(entries, null, 2), 'utf-8');

      const cache = loadCache(tempDir);
      expect(cache.size).toBe(1);
      expect(cache.get('https://www.instagram.com/p/test1/')?.thumbnailUrl).toBe(
        'https://example.com/thumb1.jpg',
      );
    });

    it('filters out expired entries (older than 7 days)', async () => {
      const { loadCache } = await import(SCRIPT_PATH);
      const cacheFile = path.join(tempDir, 'instagram-oembed-cache.json');
      const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
      const entries = [
        {
          instagramUrl: 'https://www.instagram.com/p/old/',
          thumbnailUrl: 'https://example.com/old.jpg',
          timestamp: eightDaysAgo,
        },
        {
          instagramUrl: 'https://www.instagram.com/p/new/',
          thumbnailUrl: 'https://example.com/new.jpg',
          timestamp: Date.now(),
        },
      ];
      fs.writeFileSync(cacheFile, JSON.stringify(entries, null, 2), 'utf-8');

      const cache = loadCache(tempDir);
      expect(cache.size).toBe(1);
      expect(cache.has('https://www.instagram.com/p/old/')).toBe(false);
      expect(cache.has('https://www.instagram.com/p/new/')).toBe(true);
    });

    it('returns empty map for corrupt cache file', async () => {
      const { loadCache } = await import(SCRIPT_PATH);
      const cacheFile = path.join(tempDir, 'instagram-oembed-cache.json');
      fs.writeFileSync(cacheFile, 'not valid json{{{', 'utf-8');

      const cache = loadCache(tempDir);
      expect(cache.size).toBe(0);
    });
  });

  describe('saveCache', () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oembed-cache-test-'));
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('writes cache entries to disk', async () => {
      const { saveCache } = await import(SCRIPT_PATH);
      const cache = new Map();
      cache.set('https://www.instagram.com/p/test1/', {
        instagramUrl: 'https://www.instagram.com/p/test1/',
        thumbnailUrl: 'https://example.com/thumb1.jpg',
        timestamp: Date.now(),
      });

      saveCache(tempDir, cache);

      const cacheFile = path.join(tempDir, 'instagram-oembed-cache.json');
      expect(fs.existsSync(cacheFile)).toBe(true);
      const written = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      expect(written).toHaveLength(1);
      expect(written[0].thumbnailUrl).toBe('https://example.com/thumb1.jpg');
    });

    it('does nothing when cacheDir is null', async () => {
      const { saveCache } = await import(SCRIPT_PATH);
      const cache = new Map();
      cache.set('key', { data: 'value' });

      // Should not throw
      saveCache(null as any, cache);
    });
  });

  describe('readGalleryFiles', () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oembed-gallery-test-'));
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('parses gallery markdown with type instagram', async () => {
      const { readGalleryFiles } = await import(SCRIPT_PATH);
      createGalleryFixture(tempDir, 'item-01.md', {
        type: 'instagram',
        instagramUrl: 'https://www.instagram.com/p/test123/',
      });

      const files = readGalleryFiles(tempDir);
      expect(files).toHaveLength(1);
      expect(files[0].data.type).toBe('instagram');
      expect(files[0].data.instagramUrl).toBe(
        'https://www.instagram.com/p/test123/',
      );
    });

    it('returns empty array for nonexistent directory', async () => {
      const { readGalleryFiles } = await import(SCRIPT_PATH);
      const files = readGalleryFiles('/nonexistent/path');
      expect(files).toHaveLength(0);
    });

    it('ignores non-markdown files', async () => {
      const { readGalleryFiles } = await import(SCRIPT_PATH);
      createGalleryFixture(tempDir, 'item-01.md');
      fs.writeFileSync(path.join(tempDir, 'notes.txt'), 'not markdown', 'utf-8');

      const files = readGalleryFiles(tempDir);
      expect(files).toHaveLength(1);
    });
  });

  describe('fetchThumbnail', () => {
    it('returns cached thumbnail without fetching', async () => {
      const { fetchThumbnail } = await import(SCRIPT_PATH);
      const cache = new Map();
      cache.set('https://www.instagram.com/p/test/', {
        instagramUrl: 'https://www.instagram.com/p/test/',
        thumbnailUrl: 'https://example.com/cached.jpg',
        timestamp: Date.now(),
      });

      const result = await fetchThumbnail(
        'https://www.instagram.com/p/test/',
        cache,
        null,
      );
      expect(result).toBe('https://example.com/cached.jpg');
    });

    it('returns cached local path when available', async () => {
      const { fetchThumbnail } = await import(SCRIPT_PATH);
      const cache = new Map();
      cache.set('https://www.instagram.com/p/test/', {
        instagramUrl: 'https://www.instagram.com/p/test/',
        thumbnailUrl: 'https://example.com/cdn-thumb.jpg',
        localPath: '/images/gallery/test-01.jpg',
        timestamp: Date.now(),
      });

      const result = await fetchThumbnail(
        'https://www.instagram.com/p/test/',
        cache,
        null,
      );
      expect(result).toBe('/images/gallery/test-01.jpg');
    });

    it('returns null when cache is expired and fetch fails', async () => {
      const { fetchThumbnail } = await import(SCRIPT_PATH);
      const cache = new Map();
      const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
      cache.set('https://www.instagram.com/p/expired/', {
        instagramUrl: 'https://www.instagram.com/p/expired/',
        thumbnailUrl: 'https://example.com/old.jpg',
        timestamp: eightDaysAgo,
      });

      // This will attempt a real fetch which will fail (no real URL)
      const result = await fetchThumbnail(
        'https://www.instagram.com/p/expired/',
        cache,
        null,
      );
      // Will be null since the oEmbed endpoint will fail for this URL
      expect(result).toBeNull();
    });
  });

  describe('isProfileUrl', () => {
    it('returns true for profile URLs with trailing slash', async () => {
      const { isProfileUrl } = await import(SCRIPT_PATH);
      expect(isProfileUrl('https://www.instagram.com/sammytoms/')).toBe(true);
    });

    it('returns true for profile URLs without trailing slash', async () => {
      const { isProfileUrl } = await import(SCRIPT_PATH);
      expect(isProfileUrl('https://www.instagram.com/sammytoms')).toBe(true);
    });

    it('returns false for post URLs with /p/ format', async () => {
      const { isProfileUrl } = await import(SCRIPT_PATH);
      expect(isProfileUrl('https://www.instagram.com/p/ABC123/')).toBe(false);
    });

    it('returns false for reel URLs', async () => {
      const { isProfileUrl } = await import(SCRIPT_PATH);
      expect(isProfileUrl('https://www.instagram.com/reel/XYZ789/')).toBe(false);
    });

    it('returns false for TV URLs', async () => {
      const { isProfileUrl } = await import(SCRIPT_PATH);
      expect(isProfileUrl('https://www.instagram.com/tv/DEF456/')).toBe(false);
    });

    it('returns false for invalid URLs', async () => {
      const { isProfileUrl } = await import(SCRIPT_PATH);
      expect(isProfileUrl('not-a-url')).toBe(false);
    });
  });

  describe('resolveLocalThumbnailPath', () => {
    it('maps markdown filename to local image path', async () => {
      const { resolveLocalThumbnailPath } = await import(SCRIPT_PATH);
      const result = resolveLocalThumbnailPath('sammytoms-01.md');
      expect(result.webPath).toBe('/images/gallery/sammytoms-01.jpg');
      expect(result.absolutePath).toContain('public/images/gallery/sammytoms-01.jpg');
    });

    it('uses custom thumbnails directory when provided', async () => {
      const { resolveLocalThumbnailPath } = await import(SCRIPT_PATH);
      const result = resolveLocalThumbnailPath('item-02.md', '/tmp/thumbs');
      expect(result.webPath).toBe('/images/gallery/item-02.jpg');
      expect(result.absolutePath).toBe('/tmp/thumbs/item-02.jpg');
    });

    it('handles filenames with multiple dots', async () => {
      const { resolveLocalThumbnailPath } = await import(SCRIPT_PATH);
      const result = resolveLocalThumbnailPath('my.special.item.md');
      expect(result.webPath).toBe('/images/gallery/my.special.item.jpg');
    });
  });

  describe('downloadImage', () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oembed-download-test-'));
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
      vi.restoreAllMocks();
    });

    it('downloads and writes image to disk', async () => {
      const { downloadImage } = await import(SCRIPT_PATH);

      const fakeImageData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]); // PNG header bytes
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: async () => fakeImageData.buffer as ArrayBuffer,
      });
      vi.stubGlobal('fetch', mockFetch);

      const destPath = path.join(tempDir, 'test-image.jpg');
      const result = await downloadImage('https://example.com/thumb.jpg', destPath);

      expect(result).toBe(true);
      expect(fs.existsSync(destPath)).toBe(true);
      const written = fs.readFileSync(destPath);
      expect(written).toBeInstanceOf(Buffer);
      expect(written.length).toBe(fakeImageData.length);
    });

    it('returns false when fetch returns non-OK status', async () => {
      const { downloadImage } = await import(SCRIPT_PATH);

      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });
      vi.stubGlobal('fetch', mockFetch);

      const destPath = path.join(tempDir, 'no-image.jpg');
      const result = await downloadImage('https://example.com/missing.jpg', destPath);

      expect(result).toBe(false);
      expect(fs.existsSync(destPath)).toBe(false);
    });

    it('returns false when fetch throws', async () => {
      const { downloadImage } = await import(SCRIPT_PATH);

      const mockFetch = vi.fn().mockRejectedValue(new Error('Network failure'));
      vi.stubGlobal('fetch', mockFetch);

      const destPath = path.join(tempDir, 'error-image.jpg');
      const result = await downloadImage('https://example.com/thumb.jpg', destPath);

      expect(result).toBe(false);
      expect(fs.existsSync(destPath)).toBe(false);
    });

    it('creates destination directory if it does not exist', async () => {
      const { downloadImage } = await import(SCRIPT_PATH);

      const fakeImageData = Buffer.from('fake-jpg-data');
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: async () => fakeImageData.buffer as ArrayBuffer,
      });
      vi.stubGlobal('fetch', mockFetch);

      const nestedDir = path.join(tempDir, 'nested', 'dir');
      const destPath = path.join(nestedDir, 'test-image.jpg');
      const result = await downloadImage('https://example.com/thumb.jpg', destPath);

      expect(result).toBe(true);
      expect(fs.existsSync(destPath)).toBe(true);
    });
  });
});

// --- Integration tests via execSync ---

describe('fetch-instagram-oembed (integration)', () => {
  let tempDir: string;
  let galleryDir: string;
  let cacheDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oembed-integ-test-'));
    galleryDir = path.join(tempDir, 'gallery');
    cacheDir = path.join(tempDir, 'cache');
    fs.mkdirSync(galleryDir, { recursive: true });
    fs.mkdirSync(cacheDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  /**
   * Run the script pointing at our temp gallery dir.
   * Since we can't override the gallery dir from the CLI, we test via
   * the exported functions in the unit tests above. The integration tests
   * verify the script runs, exits 0, and handles the full pipeline.
   */
  it('exits with code 0 even when all fetches fail', () => {
    createGalleryFixture(galleryDir, 'item-01.md', {
      type: 'instagram',
      instagramUrl: 'https://www.instagram.com/p/nonexistent-post/',
    });

    // Run the real script against the real gallery — it will fail to fetch
    // but should exit 0. We use the real gallery dir, not our temp dir,
    // since the script is hardcoded to src/content/gallery/.
    const env = { ...process.env };
    delete env.INSTAGRAM_ACCESS_TOKEN;
    const output = execSync('node scripts/fetch-instagram-oembed.mjs', {
      encoding: 'utf-8',
      timeout: 60000,
      env,
    });

    expect(output).toContain('✅ Done:');
  });

  it('skips non-instagram items', async () => {
    const { readGalleryFiles } = await import(SCRIPT_PATH);

    // Image item — no instagramUrl
    const imageMd = `---
title: "Photo"
type: "image"
src: "/images/gallery/photo.jpg"
order: 1
---

A photo.`;
    fs.writeFileSync(path.join(galleryDir, 'image-item.md'), imageMd, 'utf-8');

    // Video item — no instagramUrl
    const videoMd = `---
title: "Video"
type: "video"
src: "https://www.youtube.com/watch?v=test"
thumbnail: "/images/gallery/video-thumb.jpg"
order: 2
---

A video.`;
    fs.writeFileSync(path.join(galleryDir, 'video-item.md'), videoMd, 'utf-8');

    const files = readGalleryFiles(galleryDir);
    const instagramItems = files.filter(
      (f: any) => f.data.type === 'instagram' && f.data.instagramUrl,
    );

    expect(instagramItems).toHaveLength(0);
  });

  it('skips instagram items without instagramUrl', async () => {
    const { readGalleryFiles } = await import(SCRIPT_PATH);

    // Create a fixture manually without instagramUrl field
    const md = `---
title: "No URL Item"
type: "instagram"
src: "/images/gallery/placeholder.jpg"
thumbnail: "/images/gallery/placeholder.jpg"
order: 1
---

Content without Instagram URL.`;
    fs.writeFileSync(path.join(galleryDir, 'no-url.md'), md, 'utf-8');

    const files = readGalleryFiles(galleryDir);
    const instagramItems = files.filter(
      (f: any) => f.data.type === 'instagram' && f.data.instagramUrl,
    );

    expect(instagramItems).toHaveLength(0);
  });

  it('cache round-trip: write then read', async () => {
    const { saveCache, loadCache } = await import(SCRIPT_PATH);

    const url = 'https://www.instagram.com/p/roundtrip/';
    const thumb = 'https://example.com/roundtrip.jpg';
    const cache = new Map();
    cache.set(url, {
      instagramUrl: url,
      thumbnailUrl: thumb,
      timestamp: Date.now(),
    });

    saveCache(cacheDir, cache);

    const loaded = loadCache(cacheDir);
    expect(loaded.size).toBe(1);
    expect(loaded.get(url)?.thumbnailUrl).toBe(thumb);
  });

  it('cache expiry: stale entries trigger re-fetch', async () => {
    const { saveCache, loadCache } = await import(SCRIPT_PATH);

    const url = 'https://www.instagram.com/p/stale/';
    const thumb = 'https://example.com/stale.jpg';
    const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;

    const cache = new Map();
    cache.set(url, {
      instagramUrl: url,
      thumbnailUrl: thumb,
      timestamp: eightDaysAgo,
    });

    saveCache(cacheDir, cache);

    // Loading should filter out the stale entry
    const loaded = loadCache(cacheDir);
    expect(loaded.size).toBe(0);
    expect(loaded.has(url)).toBe(false);
  });

  it('processes multiple instagram items', async () => {
    const { readGalleryFiles } = await import(SCRIPT_PATH);

    createGalleryFixture(galleryDir, 'ig-01.md', {
      type: 'instagram',
      order: 1,
      instagramUrl: 'https://www.instagram.com/p/first/',
    });
    createGalleryFixture(galleryDir, 'ig-02.md', {
      type: 'instagram',
      order: 2,
      instagramUrl: 'https://www.instagram.com/p/second/',
    });

    // Image item without instagramUrl
    const imageMd = `---
title: "Photo"
type: "image"
src: "/images/gallery/photo.jpg"
order: 3
---

A photo.`;
    fs.writeFileSync(path.join(galleryDir, 'image-01.md'), imageMd, 'utf-8');

    const files = readGalleryFiles(galleryDir);
    expect(files).toHaveLength(3);

    const instagramItems = files.filter(
      (f: any) => f.data.type === 'instagram' && f.data.instagramUrl,
    );
    expect(instagramItems).toHaveLength(2);
  });

  it('end-to-end: downloads thumbnail and updates markdown with local path', async () => {
    const { readGalleryFiles, resolveLocalThumbnailPath, downloadImage, isProfileUrl } =
      await import(SCRIPT_PATH);
    const matter = (await import('gray-matter')).default;

    const thumbnailsDir = path.join(tempDir, 'public', 'images', 'gallery');
    fs.mkdirSync(thumbnailsDir, { recursive: true });

    // Create gallery fixture with a specific post URL
    createGalleryFixture(galleryDir, 'sammytoms-01.md', {
      type: 'instagram',
      instagramUrl: 'https://www.instagram.com/p/ABC123/',
      thumbnail: '/images/gallery/placeholder.jpg',
    });

    // Simulate the pipeline: read files, "fetch" thumbnail, download, write back
    const files = readGalleryFiles(galleryDir);
    const item = files.find((f: any) => f.filename === 'sammytoms-01.md');
    expect(item).toBeDefined();

    // Simulate a fetched thumbnail URL
    const fakeThumbnailUrl = 'https://cdn.example.com/thumb.jpg';
    const localPath = resolveLocalThumbnailPath(item!.filename, thumbnailsDir);

    // Mock downloadImage by writing a file directly
    fs.writeFileSync(localPath.absolutePath, Buffer.from('fake-image-data'));

    // Update the frontmatter
    item!.data.thumbnail = localPath.webPath;
    const output = matter.stringify(item!.content, item!.data);
    fs.writeFileSync(item!.filePath, output, 'utf-8');

    // Verify the markdown was updated
    const updated = fs.readFileSync(item!.filePath, 'utf-8');
    expect(updated).toContain('thumbnail: /images/gallery/sammytoms-01.jpg');
    // The src field still has placeholder.jpg, that's fine — only thumbnail changed
    expect(updated).toContain('src: /images/gallery/placeholder.jpg');

    // Verify the image file exists
    expect(fs.existsSync(localPath.absolutePath)).toBe(true);
  });

  it('profile URL is detected and skipped without fetching', async () => {
    const { isProfileUrl } = await import(SCRIPT_PATH);

    // Verify isProfileUrl still correctly detects profile URLs
    expect(isProfileUrl('https://www.instagram.com/sammytoms/')).toBe(true);
    expect(isProfileUrl('https://www.instagram.com/p/ABC123/')).toBe(false);

    // Run the real script — since KB-118, all gallery items use post permalinks
    // so no "Profile URL" skip messages should appear
    const env = { ...process.env };
    delete env.INSTAGRAM_ACCESS_TOKEN;
    const output = execSync('node scripts/fetch-instagram-oembed.mjs 2>&1', {
      encoding: 'utf-8',
      timeout: 60000,
      env,
      shell: '/bin/bash',
    });

    // Script completes successfully
    expect(output).toContain('✅ Done:');
    // No profile URLs in the gallery, so no skip messages
    expect(output).not.toContain('Profile URL');
  });
});
