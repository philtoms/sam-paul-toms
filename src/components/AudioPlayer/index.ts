/**
 * Audio Player module barrel export.
 *
 * Exports the main Player component as default and re-exports
 * types and custom event names for use by pages and other components.
 */

export { default } from './Player';
export type { Track, PlaybackState, PlaylistState } from './types';

/** Custom event names for page→player communication */
export const AUDIO_PLAYER_EVENTS = {
  PLAY: 'audio-player:play',
  PAUSE: 'audio-player:pause',
  ADD: 'audio-player:add',
  SEEK: 'audio-player:seek',
  FADE_PAUSE: 'audio-player:fade-pause',
} as const;
