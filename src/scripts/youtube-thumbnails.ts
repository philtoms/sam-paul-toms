/**
 * YouTube thumbnail-strip — click-to-swap handler for `YouTubeEmbed.astro`.
 *
 * Extracted into a pure `.ts` module so the click behaviour can be unit-tested
 * with jsdom. The Astro Container API (`renderAstro`) does NOT execute inline
 * `<script>` tags, so the swap logic must live outside the component markup to
 * be testable. The component's inline `<script>` simply imports and calls this
 * function on load.
 *
 * ## Selector contract
 *
 * Each `YouTubeEmbed` instance is wrapped in a `<div class="youtube-embed-wrapper">`
 * that contains exactly one `<iframe>` (the player) and, when `videoThumbnails`
 * is provided, a row of `<button class="youtube-thumbnail-btn">` elements — one
 * per thumbnail video.
 *
 * - **Wrapper:** `.youtube-embed-wrapper`
 * - **Player:** the descendant `<iframe>` inside the wrapper
 * - **Thumbnail buttons:** descendant `.youtube-thumbnail-btn` elements, each
 *   carrying a `data-youtube-url` attribute with the thumbnail's YouTube URL
 *
 * Clicking a thumbnail button resolves the thumbnail's URL to a YouTube embed
 * URL (via the shared `youtube.ts` helpers) and swaps the iframe `src`, loading
 * the new video without a page reload.
 *
 * ## `data-youtube-url` convention
 *
 * Each `.youtube-thumbnail-btn` carries `data-youtube-url` — a valid YouTube
 * watch / short / embed URL. The handler reads this attribute to resolve the
 * target video. If the attribute is missing, empty, or does not resolve to a
 * valid video ID, the click is a no-op (the iframe is left unchanged).
 *
 * ## Safety
 *
 * This function is safe to call unconditionally — including when no thumbnail
 * strips exist. A wrapper with no `.youtube-thumbnail-btn` buttons (the common
 * case, since `videoThumbnails` is optional) is skipped without error. Likewise,
 * a wrapper with no `<iframe>` is skipped.
 */

import { extractYouTubeId, buildYouTubeEmbedUrl } from './youtube';

/**
 * Wire up click-to-swap behaviour for every YouTube thumbnail strip within the
 * given root.
 *
 * For each `.youtube-embed-wrapper` descendant of `root`, finds the player
 * `<iframe>` and all `.youtube-thumbnail-btn` buttons. Attaches a `click`
 * listener to each button that:
 *
 * 1. Reads `data-youtube-url` from the clicked button (early-return if absent).
 * 2. Resolves the URL to a video ID via `extractYouTubeId` and builds the
 *    embed URL via `buildYouTubeEmbedUrl` — **no `startTime`**, so thumbnails
 *    always play from the beginning (the start offset belongs to the main
 *    video only). Early-returns if the URL is unrecognised (no video ID).
 * 3. Swaps `iframe.src` to the resolved embed URL.
 * 4. Updates `aria-pressed`: `true` on the clicked button, `false` on all
 *    other `.youtube-thumbnail-btn` buttons within the same wrapper.
 *
 * Idempotent in intent: it attaches one listener per button each time it is
 * called. In practice it is invoked once per page load from the component's
 * inline `<script>`.
 *
 * @param root - The root node to search within. Defaults to `document` so the
 *   component's inline script can call `initYouTubeThumbnails()` with no args.
 */
export function initYouTubeThumbnails(root: ParentNode = document): void {
  const wrappers = root.querySelectorAll<HTMLElement>('.youtube-embed-wrapper');

  for (const wrapper of wrappers) {
    const iframe = wrapper.querySelector<HTMLIFrameElement>('iframe');
    if (!iframe) continue;

    const buttons =
      wrapper.querySelectorAll<HTMLButtonElement>('.youtube-thumbnail-btn');
    if (buttons.length === 0) continue;

    for (const button of buttons) {
      button.addEventListener('click', () => {
        const url = button.dataset.youtubeUrl;
        if (!url) return;

        // Reuse the shared helpers — do NOT re-implement URL parsing.
        const videoId = extractYouTubeId(url);
        if (!videoId) return; // guard: unrecognised URL, leave iframe unchanged

        // Thumbnails never carry a start offset — that belongs to the main
        // video only (resolved at server-render time via buildYouTubeEmbedUrl).
        iframe.src = buildYouTubeEmbedUrl(videoId);

        // Reflect the active thumbnail in the accessibility tree.
        button.setAttribute('aria-pressed', 'true');
        for (const other of buttons) {
          if (other !== button) {
            other.setAttribute('aria-pressed', 'false');
          }
        }
      });
    }
  }
}
