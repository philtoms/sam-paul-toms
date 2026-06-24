import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import matter from 'gray-matter';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Mirror the schema from config.ts for direct validation
const projectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  publishDate: z.coerce.date(),
  image: z.string(),
  video: z.string().url().optional(),
  videoStartTime: z.number().int().min(0).optional(),
  videoThumbnails: z
    .array(
      z.object({
        image: z.string(),
        youtubeUrl: z.string().url(),
        startTime: z.number().int().min(0).optional(),
      }),
    )
    .optional(),
  dir: z.string().optional(),
});

const projectsDir = join(process.cwd(), 'src/content/projects');

function loadProject(filename: string) {
  const raw = readFileSync(join(projectsDir, filename), 'utf-8');
  const { data } = matter(raw);
  return { filename, data, parsed: projectSchema.safeParse(data) };
}

const projectFiles = readdirSync(projectsDir).filter((f) => f.endsWith('.md'));

describe('Project content files', () => {
  it('has exactly 6 project files', () => {
    expect(projectFiles).toHaveLength(6);
  });

  it.each(projectFiles)('validates schema for %s', (filename) => {
    const { parsed } = loadProject(filename);
    expect(parsed.success).toBe(true);
    if (!parsed.success) {
      console.error(JSON.stringify(parsed.error.issues, null, 2));
    }
  });

  it.each(projectFiles)('has required fields for %s', (filename) => {
    const { data } = loadProject(filename);
    expect(data).toHaveProperty('title');
    expect(typeof data.title).toBe('string');
    expect(data).toHaveProperty('slug');
    expect(typeof data.slug).toBe('string');
    expect(data).toHaveProperty('summary');
    expect(typeof data.summary).toBe('string');
    expect(data).toHaveProperty('publishDate');
    expect(data).toHaveProperty('image');
    expect(typeof data.image).toBe('string');
  });

  it.each(projectFiles)('image path exists on disk for %s', (filename) => {
    const { data } = loadProject(filename);
    const imagePath = join(process.cwd(), 'public', data.image);
    expect(existsSync(imagePath)).toBe(true);
  });

  it.each(projectFiles)('video is either a valid URL or undefined for %s', (filename) => {
    const { data } = loadProject(filename);
    if (data.video !== undefined) {
      expect(() => new URL(data.video)).not.toThrow();
    }
  });

  it.each(projectFiles)('dir, when present, is a string for %s', (filename) => {
    const { data } = loadProject(filename);
    if (data.dir !== undefined) {
      expect(typeof data.dir).toBe('string');
    }
  });

  it.each(projectFiles)('videoStartTime is a non-negative integer when present for %s', (filename) => {
    const { data } = loadProject(filename);
    if (data.videoStartTime !== undefined) {
      expect(Number.isInteger(data.videoStartTime)).toBe(true);
      expect(data.videoStartTime).toBeGreaterThanOrEqual(0);
    }
  });

  it.each(projectFiles)('videoThumbnails entries have a string image and a valid-URL youtubeUrl when present for %s', (filename) => {
    const { data } = loadProject(filename);
    if (data.videoThumbnails !== undefined) {
      expect(Array.isArray(data.videoThumbnails)).toBe(true);
      for (const thumb of data.videoThumbnails as Array<{ image: unknown; youtubeUrl: unknown }>) {
        expect(typeof thumb.image).toBe('string');
        expect(() => new URL(thumb.youtubeUrl as string)).not.toThrow();
      }
    }
  });

  it.each(projectFiles)('videoThumbnails startTime is a non-negative integer when present for %s', (filename) => {
    const { data } = loadProject(filename);
    if (data.videoThumbnails !== undefined) {
      for (const thumb of data.videoThumbnails as Array<{ startTime?: unknown }>) {
        if (thumb.startTime !== undefined) {
          expect(Number.isInteger(thumb.startTime)).toBe(true);
          expect(thumb.startTime as number).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it('solace.md has videoStartTime: 30', () => {
    const { data } = loadProject('solace.md');
    expect(data.videoStartTime).toBe(30);
  });
});
