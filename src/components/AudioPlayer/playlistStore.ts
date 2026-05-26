import { signal, computed } from '@preact/signals';
import type { Track, PlaybackState, PlaylistState } from './types';

/**
 * Module-level singleton playlist store using Preact signals.
 * Signals persist as long as the JS module stays loaded, which is guaranteed
 * across Astro View Transitions since the persisted DOM retains the Preact
 * component and its imports.
 */

/** Ordered list of tracks in the current playlist */
export const tracks = signal<Track[]>([]);

/** Index of the currently active track; -1 means no track selected */
export const currentIndex = signal<number>(-1);

/** Whether audio is currently playing */
export const isPlaying = signal<boolean>(false);

/** Volume level from 0 (muted) to 1 (max); default 0.8 */
export const volume = signal<number>(0.8);

/** Current playback position in seconds */
export const currentTime = signal<number>(0);

/** Total duration of the current track in seconds */
export const duration = signal<number>(0);

/** Current playback state */
export const playbackState = signal<PlaybackState>('idle');

/** The currently active track, derived from tracks and currentIndex */
export const currentTrack = computed<Track | null>(() => {
  const idx = currentIndex.value;
  const list = tracks.value;
  if (idx >= 0 && idx < list.length) {
    return list[idx];
  }
  return null;
});

/**
 * Replace the entire playlist and optionally start at a specific track.
 * @param newTracks - Array of tracks to set as the new playlist
 * @param startIndex - Index of the track to select (default: 0)
 */
export function setPlaylist(newTracks: Track[], startIndex: number = 0): void {
  tracks.value = newTracks;
  currentIndex.value = newTracks.length > 0 ? startIndex : -1;
  currentTime.value = 0;
  duration.value = 0;
}

/**
 * Select and play a specific track by index.
 * @param index - Index of the track to play
 */
export function playTrack(index: number): void {
  if (index >= 0 && index < tracks.value.length) {
    currentIndex.value = index;
    currentTime.value = 0;
    isPlaying.value = true;
  }
}

/**
 * Advance to the next track in the playlist.
 * Wraps around to the first track when at the end.
 */
export function nextTrack(): void {
  const list = tracks.value;
  if (list.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % list.length;
  currentTime.value = 0;
}

/**
 * Go back to the previous track in the playlist.
 * Wraps around to the last track when at the beginning.
 */
export function prevTrack(): void {
  const list = tracks.value;
  if (list.length === 0) return;
  currentIndex.value = (currentIndex.value - 1 + list.length) % list.length;
  currentTime.value = 0;
}

/**
 * Clear the entire playlist and reset all state to idle.
 */
export function clearPlaylist(): void {
  tracks.value = [];
  currentIndex.value = -1;
  isPlaying.value = false;
  currentTime.value = 0;
  duration.value = 0;
  playbackState.value = 'idle';
}

/**
 * Check whether a given track is the currently active, playing track.
 * Used as a guard to avoid restarting a track that is already playing.
 *
 * @param trackId - The id of the track to check
 * @returns true if the track is loaded in currentTrack AND isPlaying is true
 */
export function isTrackCurrentlyPlaying(trackId: string): boolean {
  const track = currentTrack.value;
  return track !== null && track.id === trackId && isPlaying.value === true;
}

/**
 * Get a snapshot of the full playlist state for debugging or serialization.
 */
export function getState(): PlaylistState {
  return {
    tracks: tracks.value,
    currentIndex: currentIndex.value,
    isPlaying: isPlaying.value,
    volume: volume.value,
    currentTime: currentTime.value,
    duration: duration.value,
    playbackState: playbackState.value,
  };
}
