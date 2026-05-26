/**
 * Tests for the audio-player-events helper module.
 *
 * Verifies that each event dispatch helper produces the correct
 * CustomEvent type and detail on document.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  playTracks,
  pausePlayer,
  addToQueue,
  seekPlayer,
  AUDIO_PLAYER_PLAY,
  AUDIO_PLAYER_PAUSE,
  AUDIO_PLAYER_ADD,
  AUDIO_PLAYER_SEEK,
} from '../../src/scripts/audio-player-events';
import type { Track } from '../../src/components/AudioPlayer/types';

const mockTrack: Track = {
  id: 'track-1',
  title: 'Test Track',
  artist: 'Test Artist',
  audioUrl: 'https://example.com/test.mp3',
};

describe('audio-player-events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('seekPlayer', () => {
    it('dispatches audio-player:seek event with trackId and fraction on document', () => {
      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

      seekPlayer('track-1', 0.5);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe(AUDIO_PLAYER_SEEK);
      expect(event.detail).toEqual({ trackId: 'track-1', fraction: 0.5 });
    });

    it('dispatches raw fraction without clamping', () => {
      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

      // Engine is responsible for clamping; event dispatches raw values
      seekPlayer('track-2', 1.5);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toEqual({ trackId: 'track-2', fraction: 1.5 });
    });

    it('dispatches with fraction 0', () => {
      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

      seekPlayer('track-3', 0);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toEqual({ trackId: 'track-3', fraction: 0 });
    });
  });

  describe('playTracks', () => {
    it('dispatches audio-player:play event with tracks and startIndex', () => {
      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

      playTracks([mockTrack], 0);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe(AUDIO_PLAYER_PLAY);
      expect(event.detail).toEqual({ tracks: [mockTrack], startIndex: 0 });
    });
  });

  describe('pausePlayer', () => {
    it('dispatches audio-player:pause event', () => {
      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

      pausePlayer();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe(AUDIO_PLAYER_PAUSE);
    });
  });

  describe('addToQueue', () => {
    it('dispatches audio-player:add event with track detail', () => {
      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

      addToQueue(mockTrack);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe(AUDIO_PLAYER_ADD);
      expect(event.detail).toEqual({ track: mockTrack });
    });
  });

  describe('event constants', () => {
    it('exports correct event name strings', () => {
      expect(AUDIO_PLAYER_PLAY).toBe('audio-player:play');
      expect(AUDIO_PLAYER_PAUSE).toBe('audio-player:pause');
      expect(AUDIO_PLAYER_ADD).toBe('audio-player:add');
      expect(AUDIO_PLAYER_SEEK).toBe('audio-player:seek');
    });
  });
});
