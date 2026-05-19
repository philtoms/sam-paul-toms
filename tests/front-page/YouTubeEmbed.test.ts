/**
 * YouTubeEmbed component tests.
 *
 * Validates the YouTubeEmbed component renders a direct iframe embed
 * with proper attributes and responsive 16:9 wrapper.
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

  it('iframe src includes youtube.com/embed/', () => {
    expect(component).toContain('youtube.com/embed/');
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
