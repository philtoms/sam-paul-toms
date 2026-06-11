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
 * Uses the content-specified MP3 URL directly and RAF-based time tracking.
 *
 * Uses a Preact `effect()` to reactively subscribe to `currentTrack`
 * changes — when the playlist advances (via nextTrack/prevTrack/playTrack),
 * the engine automatically loads and plays the new track.
 */

let howl: HowlType | null = null;
let rafId: number | null = null;
let trackEffectDispose: (() => void) | null = null;
let fadeIntervalId: ReturnType<typeof setInterval> | null = null;

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
 * Creates a new Howl with the track's MP3 audio URL as the single source.
 * @param track - The track to load
 */
export function load(track: Track): void {
  // Destroy previous instance
  destroyHowl();

  playbackState.value = 'loading';

  howl = new Howl({
    src: [track.audioUrl],
    html5: true, // Required for streaming large files
    volume: volume.peek(),
    preload: true,
    format: ['mp3'],
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
 * Cancel any in-progress fade-out operation.
 * Clears the interval and restores Howler volume to the stored preference.
 */
function cancelFade(): void {
  if (fadeIntervalId !== null) {
    clearInterval(fadeIntervalId);
    fadeIntervalId = null;
  }
}

/**
 * Destroy only the Howl instance without resetting all state.
 * Used internally when loading a new track (to avoid resetting
 * playbackState before the new load begins).
 */
function destroyHowl(): void {
  cancelFade();
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
 * Smoothly fade out the audio over the given duration, then pause.
 * Only modifies the Howler volume directly — does NOT touch the `volume`
 * signal so the user's slider position is preserved. After pausing,
 * the Howler volume is restored to the stored preference so next manual
 * play uses the correct level.
 *
 * @param fadeDuration - Duration of the fade in ms (default: 500)
 */
export function fadeAndPause(fadeDuration: number = 500): void {
  if (!howl || !howl.playing()) return;

  // Cancel any in-progress fade before starting a new one
  cancelFade();

  const startVolume = howl.volume();
  const steps = 20;
  const stepTime = fadeDuration / steps;
  const volumeStep = startVolume / steps;
  let currentStep = 0;

  fadeIntervalId = setInterval(() => {
    currentStep++;
    if (currentStep >= steps) {
      // Fade complete — pause and restore volume
      clearInterval(fadeIntervalId!);
      fadeIntervalId = null;
      howl!.volume(0);
      howl!.pause();
      // Restore Howler volume to stored preference for next manual play
      howl!.volume(volume.peek());
    } else {
      howl!.volume(startVolume - volumeStep * currentStep);
    }
  }, stepTime);
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
  cancelFade();
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
