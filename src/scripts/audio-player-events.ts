/**
 * Custom event system for page→player communication.
 *
 * This module provides helper functions that any page or component can import
 * to control the audio player without coupling to the player's internal state.
 * It uses native CustomEvent and document.dispatchEvent — zero framework dependencies.
 */

import type { Track } from '../components/AudioPlayer/types';

/** Event type constants */
export const AUDIO_PLAYER_PLAY = 'audio-player:play';
export const AUDIO_PLAYER_PAUSE = 'audio-player:pause';
export const AUDIO_PLAYER_ADD = 'audio-player:add';
export const AUDIO_PLAYER_SEEK = 'audio-player:seek';
export const AUDIO_PLAYER_TOGGLE = 'audio-player:toggle';

/** Event detail interfaces */
export interface PlayEventDetail {
  tracks: Track[];
  startIndex?: number;
}

export interface AddEventDetail {
  track: Track;
}

/**
 * Detail for the seek event. Instructs the player to seek to a fractional
 * position within a specific track.
 */
export interface SeekEventDetail {
  /** The id of the track to seek within */
  trackId: string;
  /** Seek position as a fraction of total duration (0–1) */
  fraction: number;
}

/**
 * Dispatch an event to start playing a playlist.
 * The player will load the tracks and begin playback at startIndex.
 *
 * @param tracks - Array of tracks to add to the playlist
 * @param startIndex - Index of the track to start playing (default: 0)
 */
export function playTracks(tracks: Track[], startIndex: number = 0): void {
  document.dispatchEvent(
    new CustomEvent<PlayEventDetail>(AUDIO_PLAYER_PLAY, {
      detail: { tracks, startIndex },
    }),
  );
}

/**
 * Dispatch an event to pause the audio player.
 */
export function pausePlayer(): void {
  document.dispatchEvent(new CustomEvent(AUDIO_PLAYER_PAUSE));
}

/**
 * Dispatch an event to add a single track to the queue.
 * If the player is idle, this starts a new playlist with the given track.
 *
 * @param track - The track to add to the queue
 */
export function addToQueue(track: Track): void {
  document.dispatchEvent(
    new CustomEvent<AddEventDetail>(AUDIO_PLAYER_ADD, {
      detail: { track },
    }),
  );
}

/**
 * Dispatch a seek event to move playback to a specific position in a track.
 * The Player component handles this by calling audioEngine.seek(fraction)
 * only if the trackId matches the currently loaded track.
 *
 * @param trackId - The id of the track to seek within
 * @param fraction - Seek position as a fraction of total duration (0–1)
 */
export function seekPlayer(trackId: string, fraction: number): void {
  document.dispatchEvent(
    new CustomEvent<SeekEventDetail>(AUDIO_PLAYER_SEEK, {
      detail: { trackId, fraction },
    }),
  );
}

/**
 * Dispatch an event to toggle play/pause on the audio player.
 * The Player component handles this by calling audioEngine.togglePlay().
 */
export function togglePlayer(): void {
  document.dispatchEvent(new CustomEvent(AUDIO_PLAYER_TOGGLE));
}
