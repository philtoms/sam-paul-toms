/**
 * YouTubeEmbed component tests.
 *
 * Validates the YouTubeEmbed component renders a direct iframe embed
 * with proper attributes and a responsive 16:9 wrapper, and that it
 * delegates YouTube ID extraction and embed-URL construction to the
 * shared `src/scripts/youtube.ts` helpers (`extractYouTubeId`,
 * `buildYouTubeEmbedUrl`).
 *
 * The byte-identical embed-URL contract (no-`start` fallback, `&start=`
 * appended for a truthy `startTime`, never `&start=0`) is now covered by
 * exact-equality assertions in `tests/scripts/youtube.test.ts`.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const componentPath = resolve(process.cwd(), 'src/components/YouTubeEmbed.astro');
const component = readFileSync(componentPath, 'utf-8');

describe('YouTubeEmbed component structure', () => {
  it('contains the youtube-embed CSS class on the wrapper div', () => {
    expect(component).toContain('class="youtube-embed');
  });

  it('renders an iframe element', () => {
    expect(component).toContain('<iframe');
  });

  it('iframe has a title attribute', () => {
    expect(component).toContain('title={title}');
  });

  it('iframe has allowfullscreen attribute', () => {
    expect(component).toContain('allowfullscreen');
  });

  it('uses browser-level lazy loading on the iframe', () => {
    expect(component).toContain('loading="lazy"');
  });
});

describe('YouTubeEmbed delegates YouTube logic to src/scripts/youtube', () => {
  it('includes the startTime prop on the Props interface', () => {
    expect(component).toContain('startTime?: number;');
  });

  it('imports both extractYouTubeId and buildYouTubeEmbedUrl from ../scripts/youtube', () => {
    expect(component).toMatch(
      /import\s*\{[^}]*extractYouTubeId[^}]*buildYouTubeEmbedUrl[^}]*\}\s*from\s*['"]\.\.\/scripts\/youtube['"]/,
    );
  });

  it('builds the embed URL via buildYouTubeEmbedUrl(videoId, startTime)', () => {
    expect(component).toMatch(/buildYouTubeEmbedUrl\(\s*videoId,\s*startTime\s*\)/);
  });

  it('does NOT keep a local duplicate of extractYouTubeId', () => {
    expect(component).not.toMatch(/function\s+extractYouTubeId\s*\(/);
  });

  it('binds the computed embed URL to the iframe src', () => {
    expect(component).toContain('src={embedUrl}');
  });
});
