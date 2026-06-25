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

// Fixtures for the optional `videoThumbnails` prop (KB-150). The poster image
// paths are illustrative — no real images exist on disk for the homepage yet.
const THUMB_IMG_A = '/images/video-thumb-1.jpeg';
const THUMB_IMG_B = '/images/video-thumb-2.jpeg';
const THUMB_URL_A = 'https://www.youtube.com/watch?v=AAAAAAAAAAA';
const THUMB_URL_B = 'https://youtu.be/BBBBBBBBBBB';
const videoThumbnails = [
  { image: THUMB_IMG_A, youtubeUrl: THUMB_URL_A },
  { image: THUMB_IMG_B, youtubeUrl: THUMB_URL_B },
];

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
    //
    // NOTE (KB-150): the component now ships a top-level inline `<script>`
    // (Astro only bundles root-level scripts), so the output is no longer
    // literally empty — it contains the harmless no-op `<script>` reference.
    // The meaningful invariant is that NO embed markup renders, asserted below.
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: 'https://example.com/no-video' },
    });
    expect(document.querySelector('iframe')).toBeNull();
    expect(document.querySelector('div.youtube-embed')).toBeNull();
    expect(document.querySelector('.youtube-embed-wrapper')).toBeNull();
    expect(document.querySelector('.youtube-thumbnail-btn')).toBeNull();
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

describe('YouTubeEmbed loop prop', () => {
  it('appends &loop=1&playlist=<videoId> when loop is true (exact equality)', async () => {
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: WATCH_URL, loop: true },
    });
    expect(document.querySelector('iframe')!.getAttribute('src')).toBe(
      `${EMBED_BASE}&loop=1&playlist=dQw4w9WgXcQ`,
    );
  });

  it('emits start before loop when both startTime and loop are set', async () => {
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: WATCH_URL, startTime: 45, loop: true },
    });
    expect(document.querySelector('iframe')!.getAttribute('src')).toBe(
      `${EMBED_BASE}&start=45&loop=1&playlist=dQw4w9WgXcQ`,
    );
  });

  it('does NOT append loop when loop is omitted', async () => {
    const { document } = await renderAstro(YouTubeEmbed, { props: { url: WATCH_URL } });
    const src = document.querySelector('iframe')!.getAttribute('src');
    expect(src).not.toMatch(/loop=/);
    expect(src).toBe(EMBED_BASE);
  });
});

describe('YouTubeEmbed autoplay prop', () => {
  it('appends &autoplay=1&mute=1 when autoplay is true (exact equality)', async () => {
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: WATCH_URL, autoplay: true },
    });
    expect(document.querySelector('iframe')!.getAttribute('src')).toBe(
      `${EMBED_BASE}&autoplay=1&mute=1`,
    );
  });

  it('emits start, loop, then autoplay in fixed order when all set', async () => {
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: WATCH_URL, startTime: 45, loop: true, autoplay: true },
    });
    expect(document.querySelector('iframe')!.getAttribute('src')).toBe(
      `${EMBED_BASE}&start=45&loop=1&playlist=dQw4w9WgXcQ&autoplay=1&mute=1`,
    );
  });

  it('does NOT append autoplay when autoplay is omitted', async () => {
    const { document } = await renderAstro(YouTubeEmbed, { props: { url: WATCH_URL } });
    const src = document.querySelector('iframe')!.getAttribute('src');
    expect(src).not.toMatch(/autoplay=|mute=/);
    expect(src).toBe(EMBED_BASE);
  });
});

describe('YouTubeEmbed videoThumbnails prop', () => {
  it('renders one thumbnail button per entry with its poster image when provided', async () => {
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: WATCH_URL, videoThumbnails },
    });
    const buttons = document.querySelectorAll('.youtube-thumbnail-btn');
    expect(buttons.length).toBe(2);

    const imgs = document.querySelectorAll('.youtube-thumbnail-btn img');
    expect(imgs[0].getAttribute('src')).toBe(THUMB_IMG_A);
    expect(imgs[1].getAttribute('src')).toBe(THUMB_IMG_B);
  });

  it('renders each thumbnail button inside a .youtube-thumbnails strip container', async () => {
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: WATCH_URL, videoThumbnails },
    });
    const strip = document.querySelector('.youtube-thumbnails');
    expect(strip).not.toBeNull();
    // All thumbnail buttons live inside the strip container.
    expect(strip!.querySelectorAll('.youtube-thumbnail-btn').length).toBe(2);
  });

  it('carries data-youtube-url with the fixture URL and aria-pressed="false" on initial render', async () => {
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: WATCH_URL, videoThumbnails },
    });
    const buttons = document.querySelectorAll('.youtube-thumbnail-btn');
    expect(buttons[0].getAttribute('data-youtube-url')).toBe(THUMB_URL_A);
    expect(buttons[1].getAttribute('data-youtube-url')).toBe(THUMB_URL_B);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('renders no thumbnail strip when videoThumbnails is omitted', async () => {
    const { document } = await renderAstro(YouTubeEmbed, { props: { url: WATCH_URL } });
    expect(document.querySelectorAll('.youtube-thumbnail-btn')).toHaveLength(0);
    expect(document.querySelector('.youtube-thumbnails')).toBeNull();
  });

  it('renders no thumbnail strip when videoThumbnails is an empty array', async () => {
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: WATCH_URL, videoThumbnails: [] },
    });
    expect(document.querySelectorAll('.youtube-thumbnail-btn')).toHaveLength(0);
    expect(document.querySelector('.youtube-thumbnails')).toBeNull();
  });

  it('derives the initial iframe src from the main url, not a thumbnail, when videoThumbnails is present', async () => {
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: WATCH_URL, videoThumbnails },
    });
    expect(document.querySelector('iframe')!.getAttribute('src')).toBe(EMBED_BASE);
  });

  it('wraps the embed in a .youtube-embed-wrapper and preserves the inner .youtube-embed classes/style (backward-compat)', async () => {
    const { document } = await renderAstro(YouTubeEmbed, { props: { url: WATCH_URL } });
    const wrapper = document.querySelector('.youtube-embed-wrapper');
    expect(wrapper).not.toBeNull();

    const inner = wrapper!.querySelector('.youtube-embed');
    expect(inner).not.toBeNull();
    expect(inner!.className).toContain('youtube-embed');
    expect(inner!.className).toContain('relative');
    expect(inner!.getAttribute('style')).toBe('padding-bottom: 56.25%');

    const iframe = inner!.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('loading')).toBe('lazy');
  });

  it('still applies startTime to the initial url when videoThumbnails is present', async () => {
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: WATCH_URL, startTime: 45, videoThumbnails },
    });
    expect(document.querySelector('iframe')!.getAttribute('src')).toBe(`${EMBED_BASE}&start=45`);
  });

  it('renders nothing for an unrecognised url even when videoThumbnails is provided', async () => {
    // The `{videoId && …}` guard wraps the entire wrapper + thumbnail strip,
    // so an unrecognised main url renders no embed markup — thumbnails or not.
    // (The top-level inline `<script>` reference remains, as for every render;
    // see the "missing video id" test note above.)
    const { document } = await renderAstro(YouTubeEmbed, {
      props: { url: 'https://example.com/no-video', videoThumbnails },
    });
    expect(document.querySelector('iframe')).toBeNull();
    expect(document.querySelector('.youtube-embed-wrapper')).toBeNull();
    expect(document.querySelector('.youtube-embed')).toBeNull();
    expect(document.querySelector('.youtube-thumbnail-btn')).toBeNull();
    expect(document.querySelector('.youtube-thumbnails')).toBeNull();
  });
});
