/**
 * YouTube IFrame API integration for audio-player coordination.
 *
 * Detects when any YouTube video on the page starts playing and
 * dispatches an `audio-player:fade-pause` event so the background
 * music player fades out smoothly.
 *
 * Watches for both dynamically added YouTube iframes (childList mutations)
 * and `src` attribute changes on existing YouTube iframes. When an iframe's
 * `src` is swapped to a *different* video (e.g. a thumbnail-strip swap, see
 * `youtube-thumbnails.ts`), the watcher re-attaches a fresh `YT.Player` proxy
 * so the new video's playback still triggers the background-audio fade-pause.
 *
 * Usage:
 *   import { init, destroy } from './youtube-audio-pause';
 *   init();   // start watching for YouTube iframes
 *   destroy(); // clean up on unmount
 */

import { extractYouTubeId } from './youtube';
import { fadeAndPausePlayer } from './audio-player-events';

/** Whether the YT IFrame API script has been loaded */
let apiLoaded = false;
/** Whether the YT IFrame API is ready (callback fired) */
let apiReady = false;
/**
 * Queued iframes discovered before the API was ready. A `Set` so each iframe
 * is enqueued at most once (a YouTube iframe whose `src` is swapped several
 * times before the API loads, or one matched by multiple observer paths, is
 * processed exactly once when `onYouTubeIframeAPIReady` fires). This is
 * defence-in-depth: `attachPlayer`'s `players.has(iframe)` guard already
 * suppresses duplicate `YT.Player` creation on drain, but the `Set` keeps the
 * queue free of redundant entries and bounds its size under rapid swaps.
 */
const pendingIframes: Set<HTMLIFrameElement> = new Set();
/** Active YT.Player instances keyed by iframe element */
const players: WeakMap<HTMLIFrameElement, YT.Player> = new WeakMap();
/** Video ID each player was attached for, so src swaps to a different video can be detected */
const playerVideoIds: WeakMap<HTMLIFrameElement, string> = new WeakMap();
/** MutationObserver for detecting dynamically added iframes */
let observer: MutationObserver | null = null;

/**
 * Check if an iframe's src points to a YouTube embed.
 */
function isYouTubeIframe(iframe: HTMLIFrameElement): boolean {
  const src = iframe.getAttribute('src') ?? '';
  return src.includes('youtube.com/embed/');
}

/**
 * Attach a YT.Player to an iframe and listen for PLAYING state.
 */
function attachPlayer(iframe: HTMLIFrameElement): void {
  if (players.has(iframe)) return;

  try {
    const player = new window.YT.Player(iframe, {
      events: {
        onStateChange: (event: YT.PlayerEvent) => {
          if (event.data === YT.PlayerState.PLAYING) {
            fadeAndPausePlayer();
          }
        },
      },
    });
    players.set(iframe, player);
    // Record the video ID this player was attached for so a later src swap to
    // a *different* video can be detected (vs. an API param-only tweak).
    playerVideoIds.set(iframe, extractYouTubeId(iframe.getAttribute('src') ?? ''));
  } catch {
    // Silently fail — non-critical enhancement
  }
}

/**
 * Re-attach a fresh `YT.Player` to an iframe whose `src` changed to a new video.
 *
 * Deletes the existing `players` / `playerVideoIds` entries (allowing the old
 * proxy to be garbage-collected) and creates a fresh `YT.Player` over the same,
 * still-live iframe element. We do NOT call `player.destroy()` — the YT IFrame
 * API's `destroy()` removes the iframe from the DOM, which we must avoid since
 * the iframe is reused across video swaps. Any stale state-change fired by the
 * old proxy is harmless because `fadeAndPausePlayer` is idempotent.
 *
 * Note: `extractYouTubeId` returns `''` for playlist (`videoseries`) embeds, so
 * playlist-to-playlist swaps are treated as "same video" and skipped. This is
 * acceptable because thumbnail strips always use plain video URLs.
 */
function reattachPlayer(iframe: HTMLIFrameElement): void {
  // Do NOT call player.destroy() — it removes the iframe from the DOM.
  players.delete(iframe);
  playerVideoIds.delete(iframe);
  attachPlayer(iframe);
}

/**
 * Process an iframe: if API is ready, attach player immediately;
 * otherwise queue it for later.
 */
function processIframe(iframe: HTMLIFrameElement): void {
  if (apiReady) {
    attachPlayer(iframe);
  } else {
    pendingIframes.add(iframe);
  }
}

/**
 * Scan the document for existing YouTube iframes and process them.
 */
function scanExistingIframes(): void {
  const iframes = document.querySelectorAll<HTMLIFrameElement>(
    'iframe[src*="youtube.com/embed/"]',
  );
  for (const iframe of iframes) {
    processIframe(iframe);
  }
}

/**
 * Lazy-load the YouTube IFrame API script.
 */
function loadAPI(): void {
  if (apiLoaded) return;
  apiLoaded = true;

  // Set up the global callback
  window.onYouTubeIframeAPIReady = () => {
    apiReady = true;
    // Process any queued iframes
    for (const iframe of pendingIframes) {
      attachPlayer(iframe);
    }
    pendingIframes.clear();
  };

  // Inject the script
  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(script);
}

/**
 * Set up a MutationObserver to detect YouTube iframes added dynamically
 * (e.g., when ProjectModal opens).
 */
function observeDynamicIframes(): void {
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // Attribute mutation: an existing iframe's `src` changed (e.g. a
      // thumbnail-strip swap). Detect a real video change and re-attach.
      if (mutation.type === 'attributes') {
        const target = mutation.target;
        if (!(target instanceof HTMLIFrameElement) || !isYouTubeIframe(target)) {
          continue;
        }
        if (players.has(target)) {
          // Player already exists — only re-attach if the video ID actually
          // changed. The YT IFrame API itself mutates `src` during
          // `new YT.Player(...)` init (adding `origin=`, `widget_referrer=`,
          // etc.), so comparing video IDs (not raw src) prevents an infinite
          // re-attach loop.
          const oldId = playerVideoIds.get(target);
          const newId = extractYouTubeId(target.getAttribute('src') ?? '');
          if (oldId !== newId) {
            reattachPlayer(target);
          }
        } else {
          // No player yet for this iframe (e.g. a non-YouTube iframe that just
          // gained a YouTube src) — process it normally.
          processIframe(target);
        }
        continue;
      }

      // childList mutation: detect iframes added to the DOM.
      for (const node of mutation.addedNodes) {
        // Check if the added node is itself an iframe
        if (
          node instanceof HTMLIFrameElement &&
          isYouTubeIframe(node)
        ) {
          processIframe(node);
        }
        // Check child elements for iframes
        if (node instanceof HTMLElement) {
          const iframes = node.querySelectorAll<HTMLIFrameElement>(
            'iframe[src*="youtube.com/embed/"]',
          );
          for (const iframe of iframes) {
            processIframe(iframe);
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src'],
  });
}

/**
 * Initialize the YouTube audio-pause watcher.
 * Scans for existing YouTube iframes, sets up a MutationObserver
 * for dynamically added ones, and lazy-loads the YT IFrame API.
 */
export function init(): void {
  loadAPI();
  scanExistingIframes();
  observeDynamicIframes();
}

/**
 * Destroy the watcher: disconnect the MutationObserver and
 * clean up YT.Player instances.
 */
export function destroy(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  pendingIframes.clear();
  // Note: WeakMap entries are garbage-collected with their iframe elements
}
