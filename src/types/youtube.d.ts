/**
 * Minimal type declarations for the YouTube IFrame Player API.
 * Only covers the parts used by the youtube-audio-pause module.
 */
declare namespace YT {
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  interface PlayerEvents {
    onReady?: (event: PlayerEvent) => void;
    onStateChange?: (event: PlayerEvent) => void;
  }

  interface PlayerOptions {
    events?: PlayerEvents;
  }

  interface PlayerEvent {
    target: Player;
    data: number;
  }

  class Player {
    constructor(element: HTMLElement, options?: PlayerOptions);
    destroy(): void;
  }
}

interface Window {
  YT: typeof YT;
  onYouTubeIframeAPIReady: (() => void) | undefined;
}
