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

  // Store the YT.Player mock callback so tests can trigger it
  let onStateChangeCallback: ((event: PlayerEvent) => void) | null = null;

  // Mock YT.Player constructor — must use 'function' keyword so `new` works
  const mockYTPlayer = vi.fn(function (this: any, _element: HTMLElement, options?: { events?: { onStateChange?: (event: PlayerEvent) => void } }) {
    onStateChangeCallback = options?.events?.onStateChange ?? null;
    this.destroy = vi.fn();
    return this;
  });

  /** Helper: set up window.YT mock */
  function setupYTAPI(): void {
    (window as any).YT = {
      Player: mockYTPlayer,
      PlayerState: {
        UNSTARTED: -1,
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3,
        CUED: 5,
      },
    };
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

    youtubeAudioPause = await import('../../src/scripts/youtube-audio-pause');
  });

  afterEach(() => {
    youtubeAudioPause.destroy();
    delete (window as any).YT;
    delete (window as any).onYouTubeIframeAPIReady;
    document.head.querySelectorAll('script[src*="youtube"]').forEach((s) => s.remove());
    document.body.innerHTML = '';
  });

  describe('init()', () => {
    it('sets up a MutationObserver on document.body', () => {
      const observeSpy = vi.spyOn(MutationObserver.prototype, 'observe');

      youtubeAudioPause.init();

      expect(observeSpy).toHaveBeenCalledWith(document.body, {
        childList: true,
        subtree: true,
      });
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

  describe('destroy()', () => {
    it('disconnects the MutationObserver', () => {
      const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');

      youtubeAudioPause.init();
      youtubeAudioPause.destroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});
