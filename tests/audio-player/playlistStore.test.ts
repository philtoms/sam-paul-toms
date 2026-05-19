import { describe, it, expect, beforeEach } from 'vitest';
import {
  tracks,
  currentIndex,
  isPlaying,
  volume,
  currentTime,
  duration,
  playbackState,
  currentTrack,
  setPlaylist,
  playTrack,
  nextTrack,
  prevTrack,
  clearPlaylist,
} from '../../src/components/AudioPlayer/playlistStore';
import type { Track } from '../../src/components/AudioPlayer/types';

const mockTracks: Track[] = [
  { id: '1', title: 'Song A', artist: 'Artist A', audioUrl: 'https://example.com/a.mp3' },
  { id: '2', title: 'Song B', artist: 'Artist B', audioUrl: 'https://example.com/b.mp3' },
  { id: '3', title: 'Song C', artist: 'Artist C', audioUrl: 'https://example.com/c.mp3' },
];

describe('playlistStore', () => {
  beforeEach(() => {
    clearPlaylist();
  });

  describe('initial state', () => {
    it('starts with idle playback state', () => {
      expect(playbackState.value).toBe('idle');
    });

    it('starts with empty tracks', () => {
      expect(tracks.value).toEqual([]);
    });

    it('starts with currentIndex of -1', () => {
      expect(currentIndex.value).toBe(-1);
    });

    it('starts not playing', () => {
      expect(isPlaying.value).toBe(false);
    });

    it('starts with default volume of 0.8', () => {
      expect(volume.value).toBe(0.8);
    });

    it('starts with currentTime 0', () => {
      expect(currentTime.value).toBe(0);
    });

    it('starts with duration 0', () => {
      expect(duration.value).toBe(0);
    });

    it('currentTrack is null initially', () => {
      expect(currentTrack.value).toBeNull();
    });
  });

  describe('setPlaylist', () => {
    it('sets the tracks array', () => {
      setPlaylist(mockTracks);
      expect(tracks.value).toEqual(mockTracks);
    });

    it('sets currentIndex to 0 by default', () => {
      setPlaylist(mockTracks);
      expect(currentIndex.value).toBe(0);
    });

    it('sets currentIndex to the specified startIndex', () => {
      setPlaylist(mockTracks, 2);
      expect(currentIndex.value).toBe(2);
    });

    it('sets currentIndex to -1 when given empty array', () => {
      setPlaylist([]);
      expect(currentIndex.value).toBe(-1);
    });

    it('resets currentTime to 0', () => {
      currentTime.value = 42;
      setPlaylist(mockTracks);
      expect(currentTime.value).toBe(0);
    });

    it('resets duration to 0', () => {
      duration.value = 200;
      setPlaylist(mockTracks);
      expect(duration.value).toBe(0);
    });
  });

  describe('currentTrack computed', () => {
    it('returns the correct track at currentIndex', () => {
      setPlaylist(mockTracks, 1);
      expect(currentTrack.value).toEqual(mockTracks[1]);
    });

    it('returns null when no tracks are loaded', () => {
      expect(currentTrack.value).toBeNull();
    });

    it('returns null when currentIndex is -1', () => {
      tracks.value = mockTracks;
      currentIndex.value = -1;
      expect(currentTrack.value).toBeNull();
    });

    it('updates reactively when currentIndex changes', () => {
      setPlaylist(mockTracks, 0);
      expect(currentTrack.value).toEqual(mockTracks[0]);
      currentIndex.value = 2;
      expect(currentTrack.value).toEqual(mockTracks[2]);
    });
  });

  describe('playTrack', () => {
    beforeEach(() => {
      setPlaylist(mockTracks);
    });

    it('sets currentIndex to the given index', () => {
      playTrack(2);
      expect(currentIndex.value).toBe(2);
    });

    it('sets isPlaying to true', () => {
      playTrack(1);
      expect(isPlaying.value).toBe(true);
    });

    it('resets currentTime to 0', () => {
      currentTime.value = 30;
      playTrack(0);
      expect(currentTime.value).toBe(0);
    });

    it('ignores invalid negative index', () => {
      playTrack(-1);
      expect(currentIndex.value).toBe(0); // unchanged from setPlaylist
    });

    it('ignores index beyond track count', () => {
      playTrack(99);
      expect(currentIndex.value).toBe(0); // unchanged from setPlaylist
    });
  });

  describe('nextTrack', () => {
    beforeEach(() => {
      setPlaylist(mockTracks);
    });

    it('advances to the next track', () => {
      currentIndex.value = 0;
      nextTrack();
      expect(currentIndex.value).toBe(1);
    });

    it('wraps around to the first track at the end', () => {
      currentIndex.value = 2;
      nextTrack();
      expect(currentIndex.value).toBe(0);
    });

    it('resets currentTime to 0', () => {
      currentTime.value = 100;
      nextTrack();
      expect(currentTime.value).toBe(0);
    });

    it('does nothing when playlist is empty', () => {
      clearPlaylist();
      nextTrack();
      expect(currentIndex.value).toBe(-1);
    });
  });

  describe('prevTrack', () => {
    beforeEach(() => {
      setPlaylist(mockTracks);
    });

    it('goes back to the previous track', () => {
      currentIndex.value = 2;
      prevTrack();
      expect(currentIndex.value).toBe(1);
    });

    it('wraps around to the last track at the beginning', () => {
      currentIndex.value = 0;
      prevTrack();
      expect(currentIndex.value).toBe(2);
    });

    it('resets currentTime to 0', () => {
      currentTime.value = 50;
      prevTrack();
      expect(currentTime.value).toBe(0);
    });

    it('does nothing when playlist is empty', () => {
      clearPlaylist();
      prevTrack();
      expect(currentIndex.value).toBe(-1);
    });
  });

  describe('clearPlaylist', () => {
    it('resets all state to initial values', () => {
      setPlaylist(mockTracks, 1);
      isPlaying.value = true;
      playbackState.value = 'playing';
      currentTime.value = 45;
      duration.value = 200;
      volume.value = 0.5;

      clearPlaylist();

      expect(tracks.value).toEqual([]);
      expect(currentIndex.value).toBe(-1);
      expect(isPlaying.value).toBe(false);
      expect(currentTime.value).toBe(0);
      expect(duration.value).toBe(0);
      expect(playbackState.value).toBe('idle');
    });
  });
});
