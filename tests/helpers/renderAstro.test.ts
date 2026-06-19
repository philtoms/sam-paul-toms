// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { renderAstro } from './renderAstro';
import YouTubeEmbed from '../../src/components/YouTubeEmbed.astro';

describe('renderAstro helper (smoke test)', () => {
  it('renders an Astro component to a real DOM with props applied', async () => {
    const { document } = await renderAstro(YouTubeEmbed, {
      props: {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Smoke video',
      },
    });

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('src')).toContain('youtube.com/embed/');
    expect(iframe!.getAttribute('title')).toBe('Smoke video');
  });

  it('returns the raw html string alongside the parsed document', async () => {
    const { html, document } = await renderAstro(YouTubeEmbed, {
      props: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    });

    expect(html).toContain('<iframe');
    expect(document.querySelector('iframe')).not.toBeNull();
  });
});
