/**
 * YouTubeEmbed component tests.
 *
 * Validates the YouTubeEmbed component's structure, click handler behavior,
 * and the fix for the autoplay bug (no loading="lazy" on dynamically created iframe).
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

  it('renders data-video-id attribute with the extracted YouTube ID', () => {
    expect(component).toContain('data-video-id={videoId}');
  });

  it('renders data-title attribute', () => {
    expect(component).toContain('data-title={title}');
  });

  it('contains the thumbnail img with object-cover class', () => {
    expect(component).toContain('object-cover');
  });

  it('contains a play button SVG overlay', () => {
    expect(component).toContain('<svg');
    expect(component).toContain('viewBox="0 0 24 24"');
  });
});

describe('YouTubeEmbed click handler', () => {
  it('does NOT set loading="lazy" on the iframe (fixes autoplay bug)', () => {
    expect(component).not.toContain('"loading"');
    expect(component).not.toContain("'loading'");
    expect(component).not.toMatch(/setAttribute\(['"]loading['"],\s*['"]lazy['"]\)/);
  });

  it('sets ?autoplay=1 on the iframe src', () => {
    expect(component).toContain('?autoplay=1');
  });

  it('uses replaceChildren instead of innerHTML', () => {
    expect(component).toContain('replaceChildren');
    expect(component).not.toContain('innerHTML');
  });
});
