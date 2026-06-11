/**
 * YouTube IFrame API integration for audio-player coordination.
 *
 * Detects when any YouTube video on the page starts playing and
 * dispatches an `audio-player:fade-pause` event so the background
 * music player fades out smoothly.
 *
 * Usage:
 *   import { init, destroy } from './youtube-audio-pause';
 *   init();   // start watching for YouTube iframes
 *   destroy(); // clean up on unmount
 */

import { fadeAndPausePlayer } from './audio-player-events';

/** Whether the YT IFrame API script has been loaded */
let apiLoaded = false;
/** Whether the YT IFrame API is ready (callback fired) */
let apiReady = false;
/** Queued iframes discovered before the API was ready */
const pendingIframes: HTMLIFrameElement[] = [];
/** Active YT.Player instances keyed by iframe element */
const players: WeakMap<HTMLIFrameElement, YT.Player> = new WeakMap();
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
  } catch {
    // Silently fail — non-critical enhancement
  }
}

/**
 * Process an iframe: if API is ready, attach player immediately;
 * otherwise queue it for later.
 */
function processIframe(iframe: HTMLIFrameElement): void {
  if (apiReady) {
    attachPlayer(iframe);
  } else {
    pendingIframes.push(iframe);
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
    pendingIframes.length = 0;
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

  observer.observe(document.body, { childList: true, subtree: true });
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
  pendingIframes.length = 0;
  // Note: WeakMap entries are garbage-collected with their iframe elements
}
