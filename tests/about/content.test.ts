import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const bioPath = join(process.cwd(), 'src/content/about/bio.md');

function loadBio() {
  const raw = readFileSync(bioPath, 'utf-8');
  const { data } = matter(raw);
  return data as {
    title: string;
    photo: string;
    photoAlt: string;
    genreTags: string[];
    pressQuotes: Array<{ text: string; source: string; url?: string }>;
    contactEmail?: string;
  };
}

describe('About bio content', () => {
  it('parses bio.md frontmatter without errors', () => {
    const data = loadBio();
    expect(data).toBeDefined();
    expect(data.title).toBe('About Sam');
    expect(data.photo).toBeDefined();
    expect(data.photoAlt).toBeDefined();
  });

  it('genreTags contains only strings', () => {
    const data = loadBio();
    const tags = data.genreTags;
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
    for (const tag of tags) {
      expect(typeof tag).toBe('string');
      expect(tag.length).toBeGreaterThan(0);
    }
  });

  it('pressQuotes entries have text and source', () => {
    const data = loadBio();
    const quotes = data.pressQuotes;
    expect(Array.isArray(quotes)).toBe(true);
    expect(quotes.length).toBeGreaterThanOrEqual(3);

    for (const quote of quotes) {
      expect(quote.text).toBeDefined();
      expect(typeof quote.text).toBe('string');
      expect(quote.text.length).toBeGreaterThan(0);
      expect(quote.source).toBeDefined();
      expect(typeof quote.source).toBe('string');
      expect(quote.source.length).toBeGreaterThan(0);
    }
  });

  it('pressQuotes URLs (if present) are valid URL strings', () => {
    const data = loadBio();
    const quotes = data.pressQuotes;

    for (const quote of quotes) {
      if (quote.url) {
        expect(() => new URL(quote.url!)).not.toThrow();
        expect(quote.url).toMatch(/^https?:\/\//);
      }
    }
  });
});
