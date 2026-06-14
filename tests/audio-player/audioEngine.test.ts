import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Track } from '../../src/components/AudioPlayer/types';

// Create mock that can be both a constructor and have tracked calls
let mockVolumeValue = 0.8;

const mockHowlInstance = {
  play: vi.fn(),
  pause: vi.fn(),
  stop: vi.fn(),
  seek: vi.fn(() => 0),
  volume: vi.fn((v?: number) => {
    if (v !== undefined) {
      mockVolumeValue = v;
    }
    return mockVolumeValue;
  }),
  unload: vi.fn(),
  playing: vi.fn(() => false),
  duration: vi.fn(() => 180),
};

let MockHowl: ReturnType<typeof vi.fn>;

vi.mock('howler', () => {
  MockHowl = vi.fn(function (this: unknown) {
    return mockHowlInstance;
  });
  return { Howl: MockHowl };
});

let audioEngine: typeof import('../../src/components/AudioPlayer/audioEngine');
let playlistStore: typeof import('../../src/components/AudioPlayer/playlistStore');

const mockTrack: Track = {
  id: '1',
  title: 'Test Song',
  artist: 'Test Artist',
  audioUrl: 'https://example.com/audio/test-song.mp3',
};

const mockTrack2: Track = {
  id: '2',
  title: 'Test Song 2',
  artist: 'Test Artist 2',
  audioUrl: 'https://example.com/audio/test-song-2.mp3',
};

describe('audioEngine', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    // Mock requestAnimationFrame / cancelAnimationFrame (not available in Node)
    // Return immediately without invoking callback to avoid infinite recursion
    globalThis.requestAnimationFrame = vi.fn(() => 1);
    globalThis.cancelAnimationFrame = vi.fn();

    vi.doMock('howler', () => {
      MockHowl = vi.fn(function (this: unknown) {
        return mockHowlInstance;
      });
      return { Howl: MockHowl };
    });

    audioEngine = await import('../../src/components/AudioPlayer/audioEngine');
    playlistStore = await import('../../src/components/AudioPlayer/playlistStore');

    playlistStore.clearPlaylist();
  });

  afterEach(() => {
    audioEngine.destroy();
  });

  describe('load', () => {
    it('creates Howl with single MP3 source from audioUrl', () => {
      audioEngine.load(mockTrack);

      expect(MockHowl).toHaveBeenCalledWith(
        expect.objectContaining({
          src: ['https://example.com/audio/test-song.mp3'],
        }),
      );
    });

    it('creates Howl with html5: true for streaming', () => {
      audioEngine.load(mockTrack);

      expect(MockHowl).toHaveBeenCalledWith(
        expect.objectContaining({
          html5: true,
        }),
      );
    });

    it('creates Howl with current volume from store', () => {
      playlistStore.volume.value = 0.5;
      audioEngine.load(mockTrack);

      expect(MockHowl).toHaveBeenCalledWith(
        expect.objectContaining({
          volume: 0.5,
        }),
      );
    });

    it('creates Howl with MP3 format', () => {
      audioEngine.load(mockTrack);

      expect(MockHowl).toHaveBeenCalledWith(
        expect.objectContaining({
          format: ['mp3'],
        }),
      );
    });

    it('sets playbackState to loading', () => {
      audioEngine.load(mockTrack);
      expect(playlistStore.playbackState.value).toBe('loading');
    });

    it('destroys previous Howl instance when loading a new track', () => {
      audioEngine.load(mockTrack);
      expect(mockHowlInstance.unload).not.toHaveBeenCalled();

      audioEngine.load(mockTrack2);
      expect(mockHowlInstance.unload).toHaveBeenCalled();
    });

    it('handles onload event to set duration and playbackState', () => {
      audioEngine.load(mockTrack);

      const callArgs = MockHowl.mock.calls[0][0];

      mockHowlInstance.duration.mockReturnValue(240);
      callArgs.onload(0);

      expect(playlistStore.duration.value).toBe(240);
      expect(playlistStore.playbackState.value).toBe('paused');
    });

    it('handles onload with zero duration', () => {
      audioEngine.load(mockTrack);

      const callArgs = MockHowl.mock.calls[0][0];

      mockHowlInstance.duration.mockReturnValue(0);
      callArgs.onload(0);

      expect(playlistStore.duration.value).toBe(0);
      expect(playlistStore.playbackState.value).toBe('paused');
    });

    it('handles onloaderror event to set error state', () => {
      audioEngine.load(mockTrack);

      const callArgs = MockHowl.mock.calls[0][0];
      callArgs.onloaderror(0, 'Load failed');

      expect(playlistStore.playbackState.value).toBe('error');
    });
  });

  describe('playback event handlers', () => {
    beforeEach(() => {
      audioEngine.load(mockTrack);
    });

    it('onplay sets isPlaying=true, playbackState=playing', () => {
      const callArgs = MockHowl.mock.calls[0][0];

      callArgs.onplay(0);

      expect(playlistStore.isPlaying.value).toBe(true);
      expect(playlistStore.playbackState.value).toBe('playing');
    });

    it('onpause sets isPlaying=false, playbackState=paused', () => {
      playlistStore.isPlaying.value = true;
      const callArgs = MockHowl.mock.calls[0][0];

      callArgs.onpause(0);

      expect(playlistStore.isPlaying.value).toBe(false);
      expect(playlistStore.playbackState.value).toBe('paused');
    });

    it('onstop sets isPlaying=false, playbackState=paused', () => {
      playlistStore.isPlaying.value = true;
      const callArgs = MockHowl.mock.calls[0][0];

      callArgs.onstop(0);

      expect(playlistStore.isPlaying.value).toBe(false);
      expect(playlistStore.playbackState.value).toBe('paused');
    });
  });

  describe('play / pause / togglePlay', () => {
    beforeEach(() => {
      audioEngine.load(mockTrack);
    });

    it('play() delegates to howl.play()', () => {
      audioEngine.play();
      expect(mockHowlInstance.play).toHaveBeenCalled();
    });

    it('pause() delegates to howl.pause()', () => {
      audioEngine.pause();
      expect(mockHowlInstance.pause).toHaveBeenCalled();
    });

    it('togglePlay() calls play when not playing', () => {
      mockHowlInstance.playing.mockReturnValue(false);
      audioEngine.togglePlay();
      expect(mockHowlInstance.play).toHaveBeenCalled();
    });

    it('togglePlay() calls pause when playing', () => {
      mockHowlInstance.playing.mockReturnValue(true);
      audioEngine.togglePlay();
      expect(mockHowlInstance.pause).toHaveBeenCalled();
    });

    it('play/pause/togglePlay do nothing if no track loaded', () => {
      audioEngine.destroy();

      vi.clearAllMocks();
      expect(() => audioEngine.play()).not.toThrow();
      expect(() => audioEngine.pause()).not.toThrow();
      expect(() => audioEngine.togglePlay()).not.toThrow();
    });
  });

  describe('seek', () => {
    beforeEach(() => {
      audioEngine.load(mockTrack);
      playlistStore.duration.value = 200;
    });

    it('seeks to correct position for a given fraction', () => {
      audioEngine.seek(0.5);
      expect(mockHowlInstance.seek).toHaveBeenCalledWith(100);
      expect(playlistStore.currentTime.value).toBe(100);
    });

    it('clamps fraction to 0–1 range', () => {
      audioEngine.seek(-0.5);
      expect(mockHowlInstance.seek).toHaveBeenCalledWith(0);

      audioEngine.seek(1.5);
      expect(mockHowlInstance.seek).toHaveBeenCalledWith(200);
    });

    it('does nothing if no track loaded', () => {
      audioEngine.destroy();
      expect(() => audioEngine.seek(0.5)).not.toThrow();
    });
  });

  describe('setVolume', () => {
    it('updates the store volume signal', () => {
      audioEngine.setVolume(0.3);
      expect(playlistStore.volume.value).toBe(0.3);
    });

    it('updates the howl volume', () => {
      audioEngine.load(mockTrack);
      audioEngine.setVolume(0.7);
      expect(mockHowlInstance.volume).toHaveBeenCalledWith(0.7);
    });

    it('clamps volume to 0–1', () => {
      audioEngine.setVolume(-0.5);
      expect(playlistStore.volume.value).toBe(0);

      audioEngine.setVolume(1.5);
      expect(playlistStore.volume.value).toBe(1);
    });
  });

  describe('onend event', () => {
    it('triggers nextTrack when audio ends', () => {
      playlistStore.setPlaylist([mockTrack, mockTrack2], 0);

      audioEngine.load(mockTrack);
      const callArgs = MockHowl.mock.calls[0][0];

      callArgs.onend(0);

      expect(playlistStore.currentIndex.value).toBe(1);
    });

    it('stops time tracking and sets isPlaying=false on end', () => {
      audioEngine.load(mockTrack);
      const callArgs = MockHowl.mock.calls[0][0];

      callArgs.onend(0);
      expect(playlistStore.isPlaying.value).toBe(false);
    });
  });

  describe('initReactiveSubscription', () => {
    it('loads and plays track reactively when currentTrack changes', async () => {
      audioEngine.initReactiveSubscription();

      // Set a playlist — the effect should fire and load the first track
      playlistStore.setPlaylist([mockTrack, mockTrack2], 0);

      // Allow the effect to run (synchronous in Preact signals)
      await vi.waitFor(() => {
        expect(MockHowl).toHaveBeenCalled();
      });

      expect(mockHowlInstance.play).toHaveBeenCalled();
    });

    it('does not reload track when volume changes', async () => {
      audioEngine.initReactiveSubscription();

      // Set a playlist to trigger the initial effect (load + play)
      playlistStore.setPlaylist([mockTrack, mockTrack2], 0);

      await vi.waitFor(() => {
        expect(MockHowl).toHaveBeenCalled();
      });

      const howlCallCount = MockHowl.mock.calls.length;
      const playCallCount = mockHowlInstance.play.mock.calls.length;

      // Change volume — this should NOT cause a track reload
      playlistStore.volume.value = 0.3;

      // Assert Howl was NOT constructed again
      expect(MockHowl.mock.calls.length).toBe(howlCallCount);
      // Assert play was NOT called again
      expect(mockHowlInstance.play.mock.calls.length).toBe(playCallCount);
    });
  });

  describe('destroy', () => {
    it('unloads the Howl instance', () => {
      audioEngine.load(mockTrack);
      audioEngine.destroy();
      expect(mockHowlInstance.unload).toHaveBeenCalled();
    });

    it('resets state signals including playbackState', () => {
      audioEngine.load(mockTrack);
      playlistStore.currentTime.value = 100;
      playlistStore.duration.value = 200;
      playlistStore.playbackState.value = 'playing';

      audioEngine.destroy();

      expect(playlistStore.currentTime.value).toBe(0);
      expect(playlistStore.duration.value).toBe(0);
      expect(playlistStore.isPlaying.value).toBe(false);
      expect(playlistStore.playbackState.value).toBe('idle');
    });

    it('is safe to call when no Howl exists', () => {
      expect(() => audioEngine.destroy()).not.toThrow();
    });

    it('disposes the reactive subscription', () => {
      audioEngine.initReactiveSubscription();
      audioEngine.destroy();

      // After destroy, changing the playlist should NOT trigger a new Howl load
      const callCountBefore = MockHowl.mock.calls.length;
      playlistStore.setPlaylist([mockTrack], 0);

      // No additional Howl constructor calls
      expect(MockHowl.mock.calls.length).toBe(callCountBefore);
    });
  });

  describe('source URL handling (tested via load)', () => {
    it('passes audioUrl through unchanged', () => {
      const trackWithParams: Track = {
        id: '3',
        title: 'Test',
        artist: 'Test',
        audioUrl: 'https://example.com/audio/song.mp3?v=1',
      };

      audioEngine.load(trackWithParams);

      expect(MockHowl).toHaveBeenCalledWith(
        expect.objectContaining({
          src: ['https://example.com/audio/song.mp3?v=1'],
        }),
      );
    });
  });

  describe('fadeAndPause', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      audioEngine.load(mockTrack);
      mockHowlInstance.playing.mockReturnValue(true);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('calls howl.pause() after fade completes', () => {
      mockVolumeValue = 0.8;
      audioEngine.fadeAndPause(500);

      // Advance through all 20 steps (25ms each × 20 = 500ms)
      vi.advanceTimersByTime(500);

      expect(mockHowlInstance.pause).toHaveBeenCalled();
    });

    it('is a no-op when no track is loaded (after destroy)', () => {
      audioEngine.destroy();
      mockHowlInstance.playing.mockReturnValue(true);

      expect(() => audioEngine.fadeAndPause()).not.toThrow();
      expect(mockHowlInstance.pause).not.toHaveBeenCalled();
    });

    it('is a no-op when howl is not playing', () => {
      mockHowlInstance.playing.mockReturnValue(false);

      audioEngine.fadeAndPause();

      expect(mockHowlInstance.pause).not.toHaveBeenCalled();
    });

    it('does NOT modify the volume signal', () => {
      playlistStore.volume.value = 0.6;
      const volumeBefore = playlistStore.volume.value;

      mockVolumeValue = 0.6;
      audioEngine.fadeAndPause(500);
      vi.advanceTimersByTime(500);

      expect(playlistStore.volume.value).toBe(volumeBefore);
    });

    it('restores howler volume after pause', () => {
      playlistStore.volume.value = 0.7;
      mockVolumeValue = 0.7;

      audioEngine.fadeAndPause(500);
      vi.advanceTimersByTime(500);

      // After fade completes, howl.volume should be called with the stored preference
      expect(mockHowlInstance.volume).toHaveBeenLastCalledWith(0.7);
    });

    it('cancels previous fade on consecutive calls', () => {
      mockVolumeValue = 0.8;

      audioEngine.fadeAndPause(500);
      vi.advanceTimersByTime(250); // halfway through first fade

      const pauseCountBefore = mockHowlInstance.pause.mock.calls.length;

      audioEngine.fadeAndPause(500);
      vi.advanceTimersByTime(500);

      // Only the second fade should complete (one pause call from second fade)
      // The first fade was cancelled so it should not have paused yet
      expect(mockHowlInstance.pause).toHaveBeenCalledTimes(pauseCountBefore + 1);
    });

    it('destroy() cancels an active fade', () => {
      mockVolumeValue = 0.8;
      audioEngine.fadeAndPause(500);
      vi.advanceTimersByTime(250); // halfway through

      audioEngine.destroy();

      // Advance past the original fade duration — no pause should happen
      vi.advanceTimersByTime(500);
      // destroy() already called unload(), so no additional pause from fade
      // The key assertion is that the fade interval was cleared
      expect(mockHowlInstance.pause).not.toHaveBeenCalled();
    });
  });
});
