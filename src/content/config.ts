import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const releases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/releases' }),
  schema: z.object({
    title: z.string(),
    artist: z.string(),
    releaseDate: z.date(),
    type: z.enum(['album', 'ep', 'single']),
    artwork: z.string(),
    tracks: z.array(
      z.object({
        title: z.string(),
        duration: z.string(),
      }),
    ),
    streamingLinks: z.record(z.string()),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/about' }),
  schema: z.object({
    title: z.string(),
    photo: z.string(),
    photoAlt: z.string(),
    genreTags: z.array(z.string()),
    pressQuotes: z.array(
      z.object({
        text: z.string(),
        source: z.string(),
        url: z.string().url().optional(),
      }),
    ),
    contactEmail: z.string().optional(),
  }),
});

export const collections = { releases, about };
