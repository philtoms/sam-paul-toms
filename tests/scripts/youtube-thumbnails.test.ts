/**
 * Unit tests for the YouTube thumbnail-strip click-to-swap handler
 * (`src/scripts/youtube-thumbnails.ts`).
 *
 * These tests exercise `initYouTubeThumbnails` against manually constructed
 * DOM (jsdom) — they do NOT use `renderAstro`, because the Astro Container API
 * does not execute inline `<script>` tags. This is precisely why the click
 * behaviour was extracted into a pure, importable function.
 *
 * The DOM fixtures mirror the server-rendered structure of `YouTubeEmbed.astro`:
 * a `.youtube-embed-wrapper` containing an `<iframe>` and, when thumbnails
 * exist, a row of `.youtube-thumbnail-btn` buttons each carrying
 * `data-youtube-url`.
 */
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { initYouTubeThumbnails } from '../../src/scripts/youtube-thumbnails';

const MAIN_EMBED = 'https://www.youtube.com/embed/MAIN0000000?enablejsapi=1';

/** A full two-thumbnail wrapper, mirroring the rendered YouTubeEmbed output. */
const TWO_THUMBS_HTML = `
  <div class="youtube-embed-wrapper">
    <div class="youtube-embed">
      <iframe src="${MAIN_EMBED}"></iframe>
    </div>
    <div class="youtube-thumbnails">
      <button type="button" class="youtube-thumbnail-btn" data-youtube-url="https://www.youtube.com/watch?v=AAAAAAAAAAA" aria-pressed="false"></button>
      <button type="button" class="youtube-thumbnail-btn" data-youtube-url="https://youtu.be/BBBBBBBBBBB" aria-pressed="false"></button>
    </div>
  </div>
`;

describe('initYouTubeThumbnails — click-to-swap', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('swaps the iframe src to the resolved embed URL for the clicked thumbnail', () => {
    document.body.innerHTML = TWO_THUMBS_HTML;
    initYouTubeThumbnails();

    const iframe = document.querySelector('iframe')!;
    const [firstBtn] = document.querySelectorAll('.youtube-thumbnail-btn');

    firstBtn.click();

    expect(iframe.getAttribute('src')).toBe(
      'https://www.youtube.com/embed/AAAAAAAAAAA?enablejsapi=1',
    );
  });

  it('resolves a youtu.be short URL to its embed URL', () => {
    document.body.innerHTML = TWO_THUMBS_HTML;
    initYouTubeThumbnails();

    const iframe = document.querySelector('iframe')!;
    const [, secondBtn] = document.querySelectorAll('.youtube-thumbnail-btn');

    secondBtn.click();

    expect(iframe.getAttribute('src')).toBe(
      'https://www.youtube.com/embed/BBBBBBBBBBB?enablejsapi=1',
    );
  });

  it('sets aria-pressed true on the clicked button and false on all others', () => {
    document.body.innerHTML = TWO_THUMBS_HTML;
    initYouTubeThumbnails();

    const [firstBtn, secondBtn] = document.querySelectorAll('.youtube-thumbnail-btn');

    firstBtn.click();

    expect(firstBtn.getAttribute('aria-pressed')).toBe('true');
    expect(secondBtn.getAttribute('aria-pressed')).toBe('false');

    // Clicking the second should flip the state.
    secondBtn.click();

    expect(firstBtn.getAttribute('aria-pressed')).toBe('false');
    expect(secondBtn.getAttribute('aria-pressed')).toBe('true');
  });
});

describe('initYouTubeThumbnails — guard branches', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('does NOT change the iframe src when data-youtube-url is unrecognised', () => {
    document.body.innerHTML = `
      <div class="youtube-embed-wrapper">
        <iframe src="${MAIN_EMBED}"></iframe>
        <button type="button" class="youtube-thumbnail-btn" data-youtube-url="https://vimeo.com/12345" aria-pressed="false"></button>
      </div>
    `;
    initYouTubeThumbnails();

    const iframe = document.querySelector('iframe')!;
    const btn = document.querySelector('.youtube-thumbnail-btn')!;

    btn.click();

    // Guard: unrecognised URL → no swap, no aria-pressed change.
    expect(iframe.getAttribute('src')).toBe(MAIN_EMBED);
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });

  it('does NOT change the iframe src when data-youtube-url is missing', () => {
    document.body.innerHTML = `
      <div class="youtube-embed-wrapper">
        <iframe src="${MAIN_EMBED}"></iframe>
        <button type="button" class="youtube-thumbnail-btn" aria-pressed="false"></button>
      </div>
    `;
    initYouTubeThumbnails();

    const iframe = document.querySelector('iframe')!;
    const btn = document.querySelector('.youtube-thumbnail-btn')!;

    btn.click();

    expect(iframe.getAttribute('src')).toBe(MAIN_EMBED);
  });

  it('does NOT change the iframe src when data-youtube-url is empty', () => {
    document.body.innerHTML = `
      <div class="youtube-embed-wrapper">
        <iframe src="${MAIN_EMBED}"></iframe>
        <button type="button" class="youtube-thumbnail-btn" data-youtube-url="" aria-pressed="false"></button>
      </div>
    `;
    initYouTubeThumbnails();

    const iframe = document.querySelector('iframe')!;
    const btn = document.querySelector('.youtube-thumbnail-btn')!;

    btn.click();

    expect(iframe.getAttribute('src')).toBe(MAIN_EMBED);
  });

  it('is a no-op on a wrapper with no thumbnail buttons (iframe unchanged, no crash)', () => {
    document.body.innerHTML = `
      <div class="youtube-embed-wrapper">
        <iframe src="${MAIN_EMBED}"></iframe>
      </div>
    `;

    expect(() => initYouTubeThumbnails()).not.toThrow();

    const iframe = document.querySelector('iframe')!;
    expect(iframe.getAttribute('src')).toBe(MAIN_EMBED);
  });

  it('is a no-op when there are no youtube-embed-wrapper elements at all', () => {
    document.body.innerHTML = `<div><p>nothing here</p></div>`;

    expect(() => initYouTubeThumbnails()).not.toThrow();
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('skips a wrapper that has thumbnail buttons but no iframe', () => {
    document.body.innerHTML = `
      <div class="youtube-embed-wrapper">
        <button type="button" class="youtube-thumbnail-btn" data-youtube-url="https://www.youtube.com/watch?v=AAAAAAAAAAA" aria-pressed="false"></button>
      </div>
    `;

    // No iframe to swap into — must not throw, and the button stays un-pressed.
    expect(() => {
      initYouTubeThumbnails();
      document.querySelector('.youtube-thumbnail-btn')!.click();
    }).not.toThrow();

    expect(
      document.querySelector('.youtube-thumbnail-btn')!.getAttribute('aria-pressed'),
    ).toBe('false');
  });
});

describe('initYouTubeThumbnails — root scoping', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('only wires up thumbnail buttons within .youtube-embed-wrapper descendants of root', () => {
    // Two independent wrappers: one inside `scopedRoot`, one outside it.
    document.body.innerHTML = `
      <div id="scoped-root">
        <div class="youtube-embed-wrapper">
          <iframe id="inside-iframe" src="${MAIN_EMBED}"></iframe>
          <button type="button" class="youtube-thumbnail-btn" data-youtube-url="https://www.youtube.com/watch?v=AAAAAAAAAAA" aria-pressed="false"></button>
        </div>
      </div>
      <div class="youtube-embed-wrapper">
        <iframe id="outside-iframe" src="${MAIN_EMBED}"></iframe>
        <button type="button" class="youtube-thumbnail-btn" data-youtube-url="https://www.youtube.com/watch?v=CCCCCCCCCCC" aria-pressed="false"></button>
      </div>
    `;

    const scopedRoot = document.getElementById('scoped-root')!;
    initYouTubeThumbnails(scopedRoot);

    // The button INSIDE the scoped root should swap its wrapper's iframe.
    const insideBtn = scopedRoot.querySelector('.youtube-thumbnail-btn')!;
    insideBtn.click();
    expect(document.getElementById('inside-iframe')!.getAttribute('src')).toBe(
      'https://www.youtube.com/embed/AAAAAAAAAAA?enablejsapi=1',
    );

    // The button OUTSIDE the scoped root was never wired up — click is inert.
    const outsideBtn = document.body.querySelector(
      '.youtube-embed-wrapper:last-of-type .youtube-thumbnail-btn',
    )!;
    outsideBtn.click();
    expect(document.getElementById('outside-iframe')!.getAttribute('src')).toBe(
      MAIN_EMBED,
    );
  });

  it('processes multiple independent wrappers within root (each swaps its own iframe)', () => {
    document.body.innerHTML = `
      <div id="root">
        <div class="youtube-embed-wrapper">
          <iframe id="iframe-a" src="${MAIN_EMBED}"></iframe>
          <button type="button" class="youtube-thumbnail-btn" data-youtube-url="https://www.youtube.com/watch?v=AAAAAAAAAAA" aria-pressed="false"></button>
        </div>
        <div class="youtube-embed-wrapper">
          <iframe id="iframe-b" src="${MAIN_EMBED}"></iframe>
          <button type="button" class="youtube-thumbnail-btn" data-youtube-url="https://www.youtube.com/watch?v=BBBBBBBBBBB" aria-pressed="false"></button>
        </div>
      </div>
    `;

    initYouTubeThumbnails(document.getElementById('root')!);

    const [btnA, btnB] = document.querySelectorAll('.youtube-thumbnail-btn');
    btnA.click();
    btnB.click();

    // Each button swaps only its OWN wrapper's iframe (no cross-contamination).
    expect(document.getElementById('iframe-a')!.getAttribute('src')).toBe(
      'https://www.youtube.com/embed/AAAAAAAAAAA?enablejsapi=1',
    );
    expect(document.getElementById('iframe-b')!.getAttribute('src')).toBe(
      'https://www.youtube.com/embed/BBBBBBBBBBB?enablejsapi=1',
    );

    // aria-pressed is scoped per-wrapper: btnA is the only button in its
    // wrapper, so flipping btnB must not have reset btnA.
    expect(btnA.getAttribute('aria-pressed')).toBe('true');
    expect(btnB.getAttribute('aria-pressed')).toBe('true');
  });
});
