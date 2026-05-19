import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import matter from 'gray-matter';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Mirror the schema from config.ts for direct validation
const trackSchema = z.object({
  title: z.string(),
  duration: z.string(),
  spotifyUrl: z.string().url().optional(),
  appleMusicUrl: z.string().url().optional(),
  youtubeMusicUrl: z.string().url().optional(),
  bandcampUrl: z.string().url().optional(),
  audioFile: z.string().optional(),
});

const releaseSchema = z.object({
  title: z.string(),
  artist: z.string(),
  releaseDate: z.coerce.date(),
  type: z.enum(['album', 'ep', 'single']),
  artwork: z.string(),
  description: z.string().optional(),
  tracks: z.array(trackSchema).min(1),
  streamingLinks: z
    .object({
      spotify: z.string().url().optional(),
      appleMusic: z.string().url().optional(),
      youtubeMusic: z.string().url().optional(),
      bandcamp: z.string().url().optional(),
    })
    .optional(),
});

const releasesDir = join(process.cwd(), 'src/content/releases');

function loadRelease(filename: string) {
  const raw = readFileSync(join(releasesDir, filename), 'utf-8');
  const { data } = matter(raw);
  return { filename, data, parsed: releaseSchema.safeParse(data) };
}

const releaseFiles = readdirSync(releasesDir).filter((f) => f.endsWith('.md'));
const expectedReleases = ['midnight-sessions.md', 'echoes-ep.md', 'neon-lights.md', 'gravity.md'];

describe('Release content files', () => {
  it('has exactly 4 release files', () => {
    expect(releaseFiles).toHaveLength(4);
    expect(releaseFiles.sort()).toEqual(expectedReleases.sort());
  });

  it.each(expectedReleases)('validates schema for %s', (filename) => {
    const { parsed } = loadRelease(filename);
    expect(parsed.success).toBe(true);
    if (!parsed.success) {
      console.error(JSON.stringify(parsed.error.issues, null, 2));
    }
  });

  it.each(expectedReleases)('has required fields for %s', (filename) => {
    const { data } = loadRelease(filename);
    expect(data).toHaveProperty('title');
    expect(typeof data.title).toBe('string');
    expect(data).toHaveProperty('artist');
    expect(typeof data.artist).toBe('string');
    expect(data).toHaveProperty('releaseDate');
    expect(data).toHaveProperty('type');
    expect(['album', 'ep', 'single']).toContain(data.type);
    expect(data).toHaveProperty('artwork');
    expect(typeof data.artwork).toBe('string');
    expect(data).toHaveProperty('tracks');
    expect(Array.isArray(data.tracks)).toBe(true);
    expect(data.tracks.length).toBeGreaterThanOrEqual(1);
  });

  it('slug is URL-safe for all releases', () => {
    const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    for (const filename of releaseFiles) {
      const slug = filename.replace(/\.md$/, '');
      expect(slug).toMatch(slugPattern);
    }
  });

  it('midnight-sessions is an album with 6 tracks', () => {
    const { data } = loadRelease('midnight-sessions.md');
    expect(data.type).toBe('album');
    expect(data.tracks).toHaveLength(6);
    expect(data.streamingLinks).toBeDefined();
  });

  it('echoes-ep is an EP with 4 tracks', () => {
    const { data } = loadRelease('echoes-ep.md');
    expect(data.type).toBe('ep');
    expect(data.tracks).toHaveLength(4);
  });

  it('neon-lights is a single with 1 track', () => {
    const { data } = loadRelease('neon-lights.md');
    expect(data.type).toBe('single');
    expect(data.tracks).toHaveLength(1);
  });

  it('gravity is a single with 1 track', () => {
    const { data } = loadRelease('gravity.md');
    expect(data.type).toBe('single');
    expect(data.tracks).toHaveLength(1);
  });
});
