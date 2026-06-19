import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import matter from 'gray-matter';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Mirror the schema from config.ts for direct validation
const worksTrackSchema = z.object({
  title: z.string(),
  duration: z.string(),
  audioFile: z.string().optional(),
  icon: z.string().default('music'),
  subtitle: z.string().optional(),
  credit: z.string().optional(),
});

const worksSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  credit: z.string().optional(),
  tracks: z.array(worksTrackSchema),
});

const worksDir = join(process.cwd(), 'src/content/works');

function loadWork(filename: string) {
  const raw = readFileSync(join(worksDir, filename), 'utf-8');
  const { data } = matter(raw);
  return { filename, data, parsed: worksSchema.safeParse(data) };
}

const worksFiles = readdirSync(worksDir).filter((f) => f.endsWith('.md'));
const expectedWorks = [
  'documentary.md',
  'film.md',
  'library.md',
  'trailers-themes-idents.md',
];

describe('Works content files', () => {
  it('has exactly 4 works files', () => {
    expect(worksFiles).toHaveLength(4);
    expect(worksFiles.sort()).toEqual(expectedWorks.sort());
  });

  it.each(expectedWorks)('validates schema for %s', (filename) => {
    const { parsed } = loadWork(filename);
    expect(parsed.success).toBe(true);
    if (!parsed.success) {
      console.error(JSON.stringify(parsed.error.issues, null, 2));
    }
  });

  it.each(worksFiles)('has required fields for %s', (filename) => {
    const { data } = loadWork(filename);
    expect(data).toHaveProperty('title');
    expect(typeof data.title).toBe('string');
    expect(data).toHaveProperty('slug');
    expect(typeof data.slug).toBe('string');
    expect(data).toHaveProperty('tracks');
    expect(Array.isArray(data.tracks)).toBe(true);
    expect(data.tracks.length).toBeGreaterThanOrEqual(1);
  });

  it.each(worksFiles)('slug is URL-safe for %s', (filename) => {
    const { data } = loadWork(filename);
    const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    expect(data.slug).toMatch(slugPattern);
  });

  it.each(worksFiles)('credit, when present, is a string for %s', (filename) => {
    const { data } = loadWork(filename);
    if (data.credit !== undefined) {
      expect(typeof data.credit).toBe('string');
    }
  });

  it.each(worksFiles)('each track credit, when present, is a string for %s', (filename) => {
    const { data } = loadWork(filename);
    for (const track of data.tracks) {
      if (track.credit !== undefined) {
        expect(typeof track.credit).toBe('string');
      }
    }
  });
});
