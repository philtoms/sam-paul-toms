// @vitest-environment node
/**
 * YouTubeEmbed component tests (behavioural).
 *
 * These tests render the `.astro` component via the Astro Container API
 * (`renderAstro`) and assert on the real, parsed DOM — mirroring the behavioural
 * style of `tests/components/project-modal/ProjectModal.test.tsx`. Unlike the
 * previous source-grep approach, this verifies runtime behaviour such as the
 * `{videoId && …}` conditional omitting the iframe for an unrecognised URL.
 *
 * No `readFileSync` / source-substring assertions remain in this file.
 */
import { describe, it, expect } from 'vitest';
import { renderAstro } from '../helpers/renderAstro';
import YouTubeEmbed from '../../src/components/YouTubeEmbed.astro';

const WATCH_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const EMBED_BASE = 'https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1';

describe('YouTubeEmbed rendering', () => {
  it('renders a youtube-embed wrapper div', async () => {
    const { document } = await renderAstro(YouTubeEmbed, { props: { url: WATCH_URL } });
    const wrapper = document.querySelector('div.youtube-embed');
    expect(wrapper).not.toBeNull();
    expect(wrapper!.className).toContain('youtube-embed');
  });

  it('renders an iframe element', async () => {
    const { document } = await renderAstro(YouTubeEmbed, { props: { url: WATCH_URL } });
    expect(document.querySelector('iframe')).not.toBeNull();
  });

  it('builds the embed src from the watch URL (exact equality)', async () => {
    const { document } = await renderAstro(YouTubeEmbed, { props: { url: WATCH_URL } });
    const iframe = document.querySelector('iframe');
    expect(iframe!.getAttribute('src')).toBe(EMBED_BASE);
  });

  it('uses the provided title attribute', async () => {
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: WATCH_URL, title: 'My video' },
    });
    expect(document.querySelector('iframe')!.getAttribute('title')).toBe('My video');
  });

  it('defaults the title to "YouTube video" when omitted', async () => {
    const { document } = await renderAstro(YouTubeEmbed, { props: { url: WATCH_URL } });
    expect(document.querySelector('iframe')!.getAttribute('title')).toBe('YouTube video');
  });

  it('renders the allowfullscreen attribute', async () => {
    const { document } = await renderAstro(YouTubeEmbed, { props: { url: WATCH_URL } });
    // Astro renders `allowfullscreen=""`; getAttribute returns "" for it.
    // Assert presence (not null) rather than a specific truthy value.
    expect(document.querySelector('iframe')!.getAttribute('allowfullscreen')).not.toBeNull();
  });

  it('uses browser-level lazy loading on the iframe', async () => {
    const { document } = await renderAstro(YouTubeEmbed, { props: { url: WATCH_URL } });
    expect(document.querySelector('iframe')!.getAttribute('loading')).toBe('lazy');
  });
});

describe('YouTubeEmbed URL format coverage', () => {
  // `extractYouTubeId` supports three URL patterns; each must yield the same
  // 11-char id in the rendered iframe src.
  const cases: Array<[string, string]> = [
    ['youtube.com/watch?v=', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    ['youtu.be/', 'https://youtu.be/dQw4w9WgXcQ'],
    ['youtube.com/embed/', 'https://www.youtube.com/embed/dQw4w9WgXcQ'],
  ];

  for (const [label, url] of cases) {
    it(`extracts the video id from ${label}`, async () => {
      const { document } = await renderAstro(YouTubeEmbed, { props: { url } });
      const src = document.querySelector('iframe')!.getAttribute('src');
      expect(src).toBe(EMBED_BASE);
    });
  }
});

describe('YouTubeEmbed missing video id', () => {
  it('renders nothing (no iframe) when the URL has no extractable video id', async () => {
    // This is the behavioural case source-grep could never test: the
    // `{videoId && …}` conditional omits the iframe entirely, not just a prop.
    const { document, html } = await renderAstro(YouTubeEmbed, {
      props: { url: 'https://example.com/no-video' },
    });
    expect(html).toBe('');
    expect(document.querySelector('iframe')).toBeNull();
    expect(document.querySelector('div.youtube-embed')).toBeNull();
  });
});

describe('YouTubeEmbed startTime prop', () => {
  it('appends &start=<seconds> to the embed src for a positive startTime (exact equality)', async () => {
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: WATCH_URL, startTime: 45 },
    });
    expect(document.querySelector('iframe')!.getAttribute('src')).toBe(`${EMBED_BASE}&start=45`);
  });

  it('does NOT append start when startTime is omitted', async () => {
    const { document } = await renderAstro(YouTubeEmbed, { props: { url: WATCH_URL } });
    const src = document.querySelector('iframe')!.getAttribute('src');
    expect(src).not.toMatch(/start=/);
    expect(src).toBe(EMBED_BASE);
  });

  it('does NOT append start when startTime is 0', async () => {
    // The component gates on a truthy `startTime`, so 0 falls through to the
    // no-`start` branch and renders the plain embed URL.
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: WATCH_URL, startTime: 0 },
    });
    const src = document.querySelector('iframe')!.getAttribute('src');
    expect(src).not.toMatch(/start=/);
    expect(src).toBe(EMBED_BASE);
  });
});
