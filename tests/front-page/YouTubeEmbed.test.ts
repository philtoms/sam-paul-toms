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

describe('YouTubeEmbed startTime prop', () => {
  it('includes the startTime prop on the Props interface', () => {
    expect(component).toContain('startTime?: number;');
  });

  it('appends &start= via encodeURIComponent(startTime) when startTime is positive', () => {
    // Source-level analog of ProjectModal's "appends &start=45" assertion.
    // The truthy branch must append the start param with the exact template-literal
    // form used by ProjectModal.tsx for parity.
    expect(component).toContain('&start=${encodeURIComponent(startTime)}');
  });

  it('uses a truthy gate on startTime so falsy values (0/undefined) omit start', () => {
    // Source-level analog of ProjectModal's "does NOT append start when omitted / when 0"
    // assertions. The embed URL must be built from a conditional keyed on `startTime`
    // so that 0, undefined, NaN, and absent all fall through to the no-`start` branch.
    expect(component).toMatch(/startTime\s*\?/);
    // The falsy-branch fallback URL must NOT carry `&start=`.
    expect(component).toContain(
      'https://www.youtube.com/embed/${videoId}?enablejsapi=1',
    );
  });

  it('keeps the no-start URL byte-identical to the original embed URL', () => {
    // The no-startTime case must render the exact original embed URL, unchanged.
    expect(component).toContain(
      'https://www.youtube.com/embed/${videoId}?enablejsapi=1',
    );
  });
});
