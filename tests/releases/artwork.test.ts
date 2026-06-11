import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const RELEASES_DIR = join(import.meta.dirname, '../../src/content/releases');
const ARTWORK_DIR = join(import.meta.dirname, '../../public/images/releases');

const EXPECTED_ARTWORK = [
  'echoes-ep.svg',
  'gravity.svg',
  'midnight-sessions.svg',
  'neon-lights.svg',
] as const;

/** Design-element SVG tag names (beyond basic rect + text) */
const DESIGN_TAGS = [
  'defs',
  'linearGradient',
  'radialGradient',
  'circle',
  'path',
  'polygon',
  'filter',
  'g',
  'ellipse',
  'line',
] as const;

function parseSvg(filepath: string) {
  const raw = readFileSync(filepath, 'utf-8');
  return raw;
}

describe('Release artwork SVGs', () => {
  describe('file existence', () => {
    it.each(EXPECTED_ARTWORK)('should exist: %s', (filename) => {
      const filepath = join(ARTWORK_DIR, filename);
      expect(existsSync(filepath)).toBe(true);
    });
  });

  describe('SVG validity', () => {
    it.each(EXPECTED_ARTWORK)('should be valid XML: %s', (filename) => {
      const content = parseSvg(join(ARTWORK_DIR, filename));

      // Must have opening and closing svg tags
      expect(content).toMatch(/^<svg[\s>]/);
      expect(content.trimEnd()).toMatch(/<\/svg>$/);

      // Must have xmlns
      expect(content).toContain('xmlns="http://www.w3.org/2000/svg"');
    });
  });

  describe('viewBox dimensions', () => {
    it.each(EXPECTED_ARTWORK)('should have 600×600 viewBox: %s', (filename) => {
      const content = parseSvg(join(ARTWORK_DIR, filename));

      // Accept viewBox="0 0 600 600" in any format
      expect(content).toMatch(/viewBox="0\s+0\s+600\s+600"/);

      // Also verify width and height attributes
      expect(content).toMatch(/width="600"/);
      expect(content).toMatch(/height="600"/);
    });
  });

  describe('file size', () => {
    it.each(EXPECTED_ARTWORK)('should be under 50KB: %s', (filename) => {
      const filepath = join(ARTWORK_DIR, filename);
      const stats = statSync(filepath);
      expect(stats.size).toBeLessThan(50 * 1024);
    });
  });

  describe('design complexity', () => {
    it.each(EXPECTED_ARTWORK)('should contain design elements beyond basic rect+text: %s', (filename) => {
      const content = parseSvg(join(ARTWORK_DIR, filename));

      const hasDesignElements = DESIGN_TAGS.some((tag) =>
        content.includes(`<${tag}`)
      );

      expect(hasDesignElements).toBe(true);
    });

    it.each(EXPECTED_ARTWORK)('should have more than 2 SVG element types: %s', (filename) => {
      const content = parseSvg(join(ARTWORK_DIR, filename));

      const foundTags = DESIGN_TAGS.filter((tag) =>
        content.includes(`<${tag}`)
      );

      // At least 3 different design element types
      expect(foundTags.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('artwork frontmatter alignment', () => {
    it('every release artwork frontmatter should match an existing SVG file', () => {
      const mdFiles = readdirSync(RELEASES_DIR).filter((f) => f.endsWith('.md'));

      for (const mdFile of mdFiles) {
        const raw = readFileSync(join(RELEASES_DIR, mdFile), 'utf-8');
        const { data } = matter(raw);
        const artworkPath = data.artwork as string;

        // artwork is like /images/releases/echoes-ep.svg
        expect(artworkPath).toBeTruthy();
        expect(artworkPath).toMatch(/^\/images\/releases\/.+\.svg$/);

        // Extract filename and check file exists
        const filename = artworkPath.split('/').pop()!;
        const filepath = join(ARTWORK_DIR, filename);
        expect(existsSync(filepath)).toBe(true);
      }
    });
  });
});
