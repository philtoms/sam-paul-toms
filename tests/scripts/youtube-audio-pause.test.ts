/**
 * Tests for the YouTube IFrame API watcher module.
 *
 * Verifies that the module correctly detects YouTube iframes (both existing
 * and dynamically added), integrates with the YT IFrame API, and dispatches
 * the audio-player:fade-pause event when a video starts playing.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { PlayerEvent } from '../../src/types/youtube';

// Mock the audio-player-events module
const mockFadeAndPausePlayer = vi.fn();
vi.mock('../../src/scripts/audio-player-events', () => ({
  fadeAndPausePlayer: mockFadeAndPausePlayer,
}));

describe('youtube-audio-pause', () => {
  let youtubeAudioPause: typeof import('../../src/scripts/youtube-audio-pause');

  // Store the YT.Player mock callbacks so tests can trigger them.
  // `onStateChangeCallbacks` keeps every callback (one per player created),
  // so re-attachment tests can distinguish the old player's callback from the
  // re-attached player's callback. `onStateChangeCallback` is the latest, kept
  // for backward compatibility with the existing single-callback tests.
  let onStateChangeCallbacks: Array<(event: PlayerEvent) => void> = [];
  let onStateChangeCallback: ((event: PlayerEvent) => void) | null = null;

  // Mock YT.Player constructor — must use 'function' keyword so `new` works.
  // NOTE: unlike the real YT IFrame API, this mock does NOT mutate `iframe.src`
  // during construction. The loop-prevention path (same-video param-only change)
  // is therefore exercised only by the explicit test below, not via natural
  // re-entrant observer firing. See "Known testing limitations" comments.
  const mockYTPlayer = vi.fn(function (_element: HTMLElement, options?: { events?: { onStateChange?: (event: PlayerEvent) => void } }) {
    const cb = options?.events?.onStateChange ?? null;
    onStateChangeCallback = cb;
    if (cb) onStateChangeCallbacks.push(cb);
    return { destroy: vi.fn() };
  });

  /** Helper: set up window.YT mock */
  function setupYTAPI(): void {
    window.YT = {
      Player: mockYTPlayer,
      PlayerState: {
        UNSTARTED: -1,
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3,
        CUED: 5,
      },
    } as unknown as typeof YT;
  }

  /** Helper: trigger the onYouTubeIframeAPIReady callback to process queued iframes */
  function triggerAPIReady(): void {
    if (typeof window.onYouTubeIframeAPIReady === 'function') {
      window.onYouTubeIframeAPIReady();
    }
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    onStateChangeCallback = null;
    onStateChangeCallbacks = [];

    youtubeAudioPause = await import('../../src/scripts/youtube-audio-pause');
  });

  afterEach(() => {
    youtubeAudioPause.destroy();
    const w = window as unknown as { YT?: unknown; onYouTubeIframeAPIReady?: () => void };
    delete w.YT;
    delete w.onYouTubeIframeAPIReady;
    document.head.querySelectorAll('script[src*="youtube"]').forEach((s) => s.remove());
    document.body.innerHTML = '';
  });

  describe('init()', () => {
    it('sets up a MutationObserver on document.body', () => {
      const observeSpy = vi.spyOn(MutationObserver.prototype, 'observe');

      youtubeAudioPause.init();

      // Widened from exact `toHaveBeenCalledWith` to `objectContaining` so the
      // new `attributes` + `attributeFilter: ['src']` config (added for
      // src-swap re-attachment) is verified without brittleness.
      expect(observeSpy).toHaveBeenCalledWith(
        document.body,
        expect.objectContaining({
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['src'],
        }),
      );
    });

    it('scans existing YouTube iframes', () => {
      // Set up YT API mock
      setupYTAPI();

      // Add an existing YouTube iframe before init
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/abc123?enablejsapi=1';
      document.body.appendChild(iframe);

      youtubeAudioPause.init();

      // Trigger the API ready callback to process queued iframes
      triggerAPIReady();

      expect(mockYTPlayer).toHaveBeenCalledWith(
        iframe,
        expect.objectContaining({
          events: expect.objectContaining({
            onStateChange: expect.any(Function),
          }),
        }),
      );
    });

    it('queues iframes if YT API not yet loaded', () => {
      // Do NOT set up window.YT — simulate API not loaded yet

      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/abc123?enablejsapi=1';
      document.body.appendChild(iframe);

      youtubeAudioPause.init();

      // No YT.Player should have been created yet
      expect(mockYTPlayer).not.toHaveBeenCalled();

      // Now simulate the API becoming ready
      setupYTAPI();
      triggerAPIReady();

      // Now the queued iframe should have a player
      expect(mockYTPlayer).toHaveBeenCalledTimes(1);
    });

    it('lazy-loads the YouTube IFrame API script', () => {
      youtubeAudioPause.init();

      const script = document.head.querySelector('script[src*="youtube.com/iframe_api"]');
      expect(script).not.toBeNull();
    });
  });

  describe('video playback detection', () => {
    it('dispatches fade-pause event when YT.Player fires PLAYING state', () => {
      setupYTAPI();

      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/abc123?enablejsapi=1';
      document.body.appendChild(iframe);

      youtubeAudioPause.init();
      triggerAPIReady();

      // Simulate YT.Player firing PLAYING state
      if (onStateChangeCallback) {
        onStateChangeCallback({ data: 1 } as PlayerEvent);
      }

      expect(mockFadeAndPausePlayer).toHaveBeenCalledTimes(1);
    });

    it('does NOT dispatch fade-pause for non-PLAYING states', () => {
      setupYTAPI();

      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/abc123?enablejsapi=1';
      document.body.appendChild(iframe);

      youtubeAudioPause.init();
      triggerAPIReady();

      // Simulate PAUSED state
      if (onStateChangeCallback) {
        onStateChangeCallback({ data: 2 } as PlayerEvent);
      }

      expect(mockFadeAndPausePlayer).not.toHaveBeenCalled();
    });

    it('detects dynamically added YouTube iframes via MutationObserver', async () => {
      setupYTAPI();

      youtubeAudioPause.init();
      triggerAPIReady();

      // The API is ready, so dynamically added iframes should get players immediately
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/xyz789?enablejsapi=1';
      document.body.appendChild(iframe);

      // MutationObserver callbacks in jsdom fire asynchronously
      await vi.waitFor(() => {
        expect(mockYTPlayer).toHaveBeenCalledWith(
          iframe,
          expect.objectContaining({
            events: expect.objectContaining({
              onStateChange: expect.any(Function),
            }),
          }),
        );
      });
    });
  });

  describe('src-swap re-attachment', () => {
    // KNOWN TESTING LIMITATION: The jsdom `mockYTPlayer` does NOT mutate
    // `iframe.src` during construction (unlike the real YT IFrame API). The
    // loop-prevention path is therefore exercised only by the explicit
    // "same video, param-only" test below, not via natural re-entrant
    // observer firing.
    //
    // NOTE: `pendingIframes` is a `Set` (KB-163), so a src change while the
    // API is NOT yet ready enqueues an iframe at most once — no duplicate
    // `attachPlayer` calls on drain. The deduplication invariant is covered
    // by the `pending-iframe deduplication` tests below.

    it('re-attaches a player when an iframe src is swapped to a different video', async () => {
      setupYTAPI();

      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/abc12345678?enablejsapi=1';
      document.body.appendChild(iframe);

      youtubeAudioPause.init();
      triggerAPIReady();

      // Player attached once for the original video.
      expect(mockYTPlayer).toHaveBeenCalledTimes(1);

      // Swap to a different video (different 11-char ID).
      iframe.src = 'https://www.youtube.com/embed/xyz78901234?enablejsapi=1';

      // The MutationObserver fires asynchronously.
      await vi.waitFor(() => {
        expect(mockYTPlayer).toHaveBeenCalledTimes(2);
      });
      // Both calls targeted the SAME iframe element (re-attached, not a new iframe).
      expect(mockYTPlayer).toHaveBeenNthCalledWith(
        2,
        iframe,
        expect.objectContaining({
          events: expect.objectContaining({
            onStateChange: expect.any(Function),
          }),
        }),
      );
    });

    it('the re-attached player fires fade-pause on PLAYING', async () => {
      setupYTAPI();

      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/abc12345678?enablejsapi=1';
      document.body.appendChild(iframe);

      youtubeAudioPause.init();
      triggerAPIReady();

      // Swap to a different video and wait for re-attachment.
      iframe.src = 'https://www.youtube.com/embed/xyz78901234?enablejsapi=1';
      await vi.waitFor(() => {
        expect(mockYTPlayer).toHaveBeenCalledTimes(2);
      });

      // Fire PLAYING via the NEW (re-attached) player's callback, not the old one.
      const reattachedCallback = onStateChangeCallbacks[1];
      reattachedCallback({ data: 1 } as PlayerEvent);

      expect(mockFadeAndPausePlayer).toHaveBeenCalledTimes(1);
    });

    it('does NOT re-attach when src changes only in query params (same video ID)', async () => {
      setupYTAPI();

      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/abc12345678?enablejsapi=1';
      document.body.appendChild(iframe);

      youtubeAudioPause.init();
      triggerAPIReady();
      expect(mockYTPlayer).toHaveBeenCalledTimes(1);

      // Change only the query params — same 11-char video ID. This mirrors the
      // YT IFrame API adding `origin=`/`widget_referrer=` during init.
      iframe.src =
        'https://www.youtube.com/embed/abc12345678?enablejsapi=1&origin=test';

      // Let the async observer flush; it must NOT re-attach (prevents infinite loop).
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(mockYTPlayer).toHaveBeenCalledTimes(1);
    });

    it('attaches a player when a non-YouTube iframe gains a YouTube src', async () => {
      setupYTAPI();

      const iframe = document.createElement('iframe');
      iframe.src = 'https://example.com/embed/something';
      document.body.appendChild(iframe);

      youtubeAudioPause.init();
      triggerAPIReady();
      // No YouTube iframe yet — no player attached.
      expect(mockYTPlayer).not.toHaveBeenCalled();

      // Swap the non-YouTube iframe to a YouTube embed URL.
      iframe.src = 'https://www.youtube.com/embed/abc12345678?enablejsapi=1';

      await vi.waitFor(() => {
        expect(mockYTPlayer).toHaveBeenCalledWith(
          iframe,
          expect.objectContaining({
            events: expect.objectContaining({
              onStateChange: expect.any(Function),
            }),
          }),
        );
      });
    });

    it('still detects dynamically added YouTube iframes (childList regression)', async () => {
      setupYTAPI();

      youtubeAudioPause.init();
      triggerAPIReady();

      // The API is ready, so a dynamically added iframe should get a player
      // immediately via the childList branch (unaffected by the new attribute branch).
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/abc12345678?enablejsapi=1';
      document.body.appendChild(iframe);

      await vi.waitFor(() => {
        expect(mockYTPlayer).toHaveBeenCalledWith(
          iframe,
          expect.objectContaining({
            events: expect.objectContaining({
              onStateChange: expect.any(Function),
            }),
          }),
        );
      });
    });
  });

  describe('pending-iframe deduplication', () => {
    // Regression guards for the at-most-one-player-per-iframe invariant.
    // These assert that an iframe enqueued multiple times before the API is
    // ready produces exactly one YT.Player on drain. They pass BOTH before and
    // after the Set change (KB-163): `attachPlayer`'s `players.has(iframe)`
    // guard already suppresses duplicate player creation at attach time. They
    // are GUARDS, not differentiators — they lock in the invariant so that
    // removing BOTH the Set AND the guard would be caught. Removing either one
    // alone still leaves the other enforcing the invariant.

    /** Flush pending MutationObserver callbacks (jsdom fires them async). */
    const flushObserver = () => new Promise((resolve) => setTimeout(resolve, 50));

    it('repeated pre-API-ready src swaps produce exactly one player on drain', async () => {
      // API NOT ready yet: do not call setupYTAPI()/triggerAPIReady() first.
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/aaa11111111?enablejsapi=1';
      document.body.appendChild(iframe);

      youtubeAudioPause.init();
      // The existing iframe is queued (apiReady is false). Now simulate rapid
      // thumbnail-strip swaps: each src change re-enqueues via the attribute
      // branch — players.has(target) is false because no players exist yet.
      const urls = [
        'https://www.youtube.com/embed/bbb22222222?enablejsapi=1',
        'https://www.youtube.com/embed/ccc33333333?enablejsapi=1',
        'https://www.youtube.com/embed/ddd44444444?enablejsapi=1',
      ];
      for (const url of urls) {
        iframe.src = url;
        // Flush the async observer between swaps so each is processed.
        await flushObserver();
      }

      // The queue now contains the iframe at most once (Set dedup). Drain it.
      setupYTAPI();
      triggerAPIReady();

      // Exactly one player for the iframe, despite multiple enqueues.
      expect(mockYTPlayer).toHaveBeenCalledTimes(1);
      expect(mockYTPlayer).toHaveBeenCalledWith(
        iframe,
        expect.objectContaining({
          events: expect.objectContaining({
            onStateChange: expect.any(Function),
          }),
        }),
      );
    });

    it('two distinct iframes enqueued before API ready each get exactly one player', async () => {
      // API NOT ready yet.
      const iframe1 = document.createElement('iframe');
      iframe1.src = 'https://www.youtube.com/embed/aaa11111111?enablejsapi=1';
      document.body.appendChild(iframe1);

      const iframe2 = document.createElement('iframe');
      iframe2.src = 'https://www.youtube.com/embed/bbb22222222?enablejsapi=1';
      document.body.appendChild(iframe2);

      youtubeAudioPause.init();
      // Both distinct elements are scanned and queued (apiReady is false).
      await flushObserver();

      setupYTAPI();
      triggerAPIReady();

      // Guards against an accidental over-dedup: one player per distinct iframe.
      expect(mockYTPlayer).toHaveBeenCalledTimes(2);
      expect(mockYTPlayer).toHaveBeenCalledWith(
        iframe1,
        expect.objectContaining({
          events: expect.objectContaining({
            onStateChange: expect.any(Function),
          }),
        }),
      );
      expect(mockYTPlayer).toHaveBeenCalledWith(
        iframe2,
        expect.objectContaining({
          events: expect.objectContaining({
            onStateChange: expect.any(Function),
          }),
        }),
      );
    });

    it('childList re-add of the same iframe before API ready does not double-attach', async () => {
      // API NOT ready yet.
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/aaa11111111?enablejsapi=1';
      document.body.appendChild(iframe);

      youtubeAudioPause.init();
      // Scanned and queued once via scanExistingIframes.
      await flushObserver();

      // Remove and re-append the SAME element before the API is ready. The
      // re-add fires the childList branch, which calls processIframe again.
      document.body.removeChild(iframe);
      await flushObserver();
      document.body.appendChild(iframe);
      await flushObserver();

      setupYTAPI();
      triggerAPIReady();

      // Exactly one player for the re-added element.
      expect(mockYTPlayer).toHaveBeenCalledTimes(1);
      expect(mockYTPlayer).toHaveBeenCalledWith(
        iframe,
        expect.objectContaining({
          events: expect.objectContaining({
            onStateChange: expect.any(Function),
          }),
        }),
      );
    });
  });

  describe('destroy()', () => {
    it('disconnects the MutationObserver', () => {
      const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');

      youtubeAudioPause.init();
      youtubeAudioPause.destroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});
