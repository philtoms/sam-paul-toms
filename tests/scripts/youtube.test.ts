/**
 * Unit tests for the shared YouTube helpers (`src/scripts/youtube.ts`).
 *
 * These exact-equality assertions lock the byte-identical URL contract that
 * `ProjectModal.tsx` and `YouTubeEmbed.astro` previously built inline (and
 * which KB-136 could only check via fragile source-grep strings). The
 * component-level behavioural suites (ProjectModal, YouTubeEmbed) remain the
 * integration net; this file is the precise contract source of truth.
 */
import { describe, it, expect } from 'vitest';
import {
  extractYouTubeId,
  buildYouTubeEmbedUrl,
} from '../../src/scripts/youtube';

const NO_START = 'https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1';

describe('extractYouTubeId', () => {
  it('extracts the ID from a youtube.com/watch?v= URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('extracts the ID from a youtu.be/ short URL', () => {
    expect(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('extracts the ID from a youtube.com/embed/ URL', () => {
    expect(
      extractYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ'),
    ).toBe('dQw4w9WgXcQ');
  });

  it('still captures the ID when the URL has trailing params (e.g. &t=42s&feature=share)', () => {
    expect(
      extractYouTubeId(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s&feature=share',
      ),
    ).toBe('dQw4w9WgXcQ');
  });

  it('captures an ID containing underscores and hyphens verbatim', () => {
    expect(extractYouTubeId('https://youtu.be/_-AbCdEfGh1')).toBe(
      '_-AbCdEfGh1',
    );
  });

  it('returns empty string for a non-YouTube URL', () => {
    expect(extractYouTubeId('https://vimeo.com/12345')).toBe('');
  });

  it('returns empty string for an empty input', () => {
    expect(extractYouTubeId('')).toBe('');
  });

  it('returns empty string for garbage input', () => {
    expect(extractYouTubeId('not a url')).toBe('');
  });
});

describe('buildYouTubeEmbedUrl', () => {
  it('builds the base URL with no start when startTime is omitted', () => {
    expect(buildYouTubeEmbedUrl('dQw4w9WgXcQ')).toBe(NO_START);
  });

  it('appends &start=<startTime> when startTime is positive', () => {
    expect(buildYouTubeEmbedUrl('dQw4w9WgXcQ', 45)).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1&start=45',
    );
  });

  it('does NOT append start when startTime is 0 (falsy)', () => {
    expect(buildYouTubeEmbedUrl('dQw4w9WgXcQ', 0)).toBe(NO_START);
  });

  it('does NOT append start when startTime is undefined (falsy)', () => {
    expect(buildYouTubeEmbedUrl('dQw4w9WgXcQ', undefined)).toBe(NO_START);
  });

  it('does NOT append start when startTime is NaN (falsy)', () => {
    expect(buildYouTubeEmbedUrl('dQw4w9WgXcQ', NaN)).toBe(NO_START);
  });

  it('appends &start=3600 for a large timestamp', () => {
    expect(buildYouTubeEmbedUrl('dQw4w9WgXcQ', 3600)).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1&start=3600',
    );
  });
});
