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
});
