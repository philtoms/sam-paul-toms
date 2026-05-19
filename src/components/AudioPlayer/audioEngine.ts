import { Howl } from 'howler';
import type { Howl as HowlType } from 'howler';
import { effect } from '@preact/signals';
import {
  currentTime,
  currentTrack,
  duration,
  isPlaying,
  playbackState,
  volume,
} from './playlistStore';
import { nextTrack } from './playlistStore';
import type { Track } from './types';

/**
 * Audio engine wrapping howler.js for cross-browser audio playback.
 * Provides MP3/OGG format fallback and RAF-based time tracking.
 *
 * Uses a Preact `effect()` to reactively subscribe to `currentTrack`
 * changes — when the playlist advances (via nextTrack/prevTrack/playTrack),
 * the engine automatically loads and plays the new track.
 */

let howl: HowlType | null = null;
let rafId: number | null = null;
let trackEffectDispose: (() => void) | null = null;

/**
 * Construct audio source URLs with format fallback.
 * OGG is preferred for better compression; MP3 is the fallback.
 * @param mp3Url - The primary MP3 audio URL
 * @returns Array of URLs with OGG first, MP3 as fallback
 */
function buildSources(mp3Url: string): string[] {
  const oggUrl = mp3Url.replace(/\.mp3(\?.*)?$/i, '.ogg$1');
  return [oggUrl, mp3Url];
}

/**
 * Start the requestAnimationFrame loop to track playback position.
 * Reads howl.seek() and updates the currentTime signal.
 */
function startTimeTracking(): void {
  if (rafId !== null) return;

  const tick = () => {
    if (howl && howl.playing()) {
      currentTime.value = howl.seek() as number;
    }
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
}

/**
 * Stop the requestAnimationFrame time tracking loop.
 */
function stopTimeTracking(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

/**
 * Load a track into the audio engine. Destroys any previous Howl instance.
 * Creates a new Howl with OGG/MP3 format fallback.
 * @param track - The track to load
 */
export function load(track: Track): void {
  // Destroy previous instance
  destroyHowl();

  playbackState.value = 'loading';

  const sources = buildSources(track.audioUrl);

  howl = new Howl({
    src: sources,
    html5: true, // Required for streaming large files
    volume: volume.value,
    preload: true,
    format: ['ogg', 'mp3'],
    onload: () => {
      duration.value = (howl as HowlType).duration();
      playbackState.value = 'paused';
    },
    onloaderror: () => {
      playbackState.value = 'error';
    },
    onplay: () => {
      isPlaying.value = true;
      playbackState.value = 'playing';
      startTimeTracking();
    },
    onpause: () => {
      isPlaying.value = false;
      playbackState.value = 'paused';
      stopTimeTracking();
    },
    onstop: () => {
      isPlaying.value = false;
      playbackState.value = 'paused';
      stopTimeTracking();
    },
    onend: () => {
      isPlaying.value = false;
      stopTimeTracking();
      // Auto-advance to next track
      nextTrack();
    },
  }) as HowlType;
}

/**
 * Destroy only the Howl instance without resetting all state.
 * Used internally when loading a new track (to avoid resetting
 * playbackState before the new load begins).
 */
function destroyHowl(): void {
  stopTimeTracking();
  if (howl) {
    howl.unload();
    howl = null;
  }
}

/**
 * Initialize the audio engine's reactive subscription to the playlist store.
 * When `currentTrack` changes (via nextTrack/prevTrack/playTrack),
 * the engine automatically loads and plays the new track.
 *
 * Call this once when the Player component mounts.
 */
export function initReactiveSubscription(): void {
  // Dispose any previous subscription
  if (trackEffectDispose) {
    trackEffectDispose();
  }

  trackEffectDispose = effect(() => {
    const track = currentTrack.value;
    if (track) {
      load(track);
      play();
    }
  });
}

/**
 * Start or resume playback of the current track.
 */
export function play(): void {
  if (howl) {
    howl.play();
  }
}

/**
 * Pause playback of the current track.
 */
export function pause(): void {
  if (howl) {
    howl.pause();
  }
}

/**
 * Toggle between play and pause states.
 */
export function togglePlay(): void {
  if (!howl) return;
  if (howl.playing()) {
    pause();
  } else {
    play();
  }
}

/**
 * Seek to a specific position in the current track.
 * @param fraction - Position as a fraction of total duration (0–1)
 */
export function seek(fraction: number): void {
  if (!howl) return;
  const clampedFraction = Math.max(0, Math.min(1, fraction));
  const seekTime = clampedFraction * duration.value;
  howl.seek(seekTime);
  currentTime.value = seekTime;
}

/**
 * Set the playback volume level.
 * @param level - Volume from 0 (muted) to 1 (max)
 */
export function setVolume(level: number): void {
  const clampedLevel = Math.max(0, Math.min(1, level));
  volume.value = clampedLevel;
  if (howl) {
    howl.volume(clampedLevel);
  }
}

/**
 * Get the underlying Howl instance (for testing purposes only).
 * @internal
 */
export function getHowl(): HowlType | null {
  return howl;
}

/**
 * Destroy the current Howl instance and reset all state signals.
 * Stops time tracking, unloads the audio file, and disposes the
 * reactive subscription.
 */
export function destroy(): void {
  destroyHowl();
  if (trackEffectDispose) {
    trackEffectDispose();
    trackEffectDispose = null;
  }
  currentTime.value = 0;
  duration.value = 0;
  isPlaying.value = false;
  playbackState.value = 'idle';
}
