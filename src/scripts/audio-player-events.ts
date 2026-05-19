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

/** Event detail interfaces */
export interface PlayEventDetail {
  tracks: Track[];
  startIndex?: number;
}

export interface AddEventDetail {
  track: Track;
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
