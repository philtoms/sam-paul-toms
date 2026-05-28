import WaveSurfer from 'wavesurfer.js';
import type { WaveSurferOptions } from 'wavesurfer.js';
import { getAccentHoverColor } from '../../scripts/accent-color';

/**
 * Waveform renderer wrapping wavesurfer.js v7.
 *
 * wavesurfer.js is used purely for visual waveform rendering — it is muted
 * so howler.js remains the sole audio source (avoids double-playback).
 * The Player component syncs visual progress via a RAF loop that calls
 * `setProgress(currentTime / duration)`.
 */

let ws: WaveSurfer | null = null;

/** Default waveform visualization options */
const defaultOptions: Partial<WaveSurferOptions> = {
  height: 40,
  waveColor: '#6b7280', // gray-500
  // Note: progressColor is resolved at runtime via getAccentHoverColor() because
  // canvas fillStyle cannot resolve CSS custom properties.
  cursorColor: '#f5f5f5', // --color-text
  barWidth: 2,
  barGap: 1,
  barRadius: 2,
  fillParent: true,
  interact: true,
};

/**
 * Initialize the waveform renderer in the given container element.
 * Creates a WaveSurfer instance with the configured visual options.
 * wavesurfer's audio output is muted so howler.js is the sole audio source.
 *
 * @param container - DOM element where the waveform will be rendered
 * @param options - Optional overrides for wavesurfer configuration
 */
export function init(
  container: HTMLElement,
  options?: Partial<WaveSurferOptions>,
): void {
  destroy();

  ws = WaveSurfer.create({
    ...defaultOptions,
    progressColor: getAccentHoverColor(),
    ...options,
    container,
  });

  // Mute wavesurfer's audio — howler.js is the sole audio source
  ws.setVolume(0);
}

/**
 * Load an audio file into wavesurfer for waveform decoding and rendering.
 * The audio is decoded client-side to generate waveform peaks.
 * wavesurfer's volume is set to 0 to prevent double-playback with howler.js.
 *
 * @param url - URL of the audio file to decode and render
 */
export function loadAudio(url: string): void {
  if (!ws) return;
  ws.load(url);
  // Re-ensure volume is 0 after loading
  ws.setVolume(0);
}

/**
 * Update the visual progress bar to reflect the current playback position.
 * Since wavesurfer is muted, this only updates the visual display.
 *
 * @param fraction - Playback position as a fraction of total duration (0–1)
 */
export function setProgress(fraction: number): void {
  if (!ws) return;
  const clamped = Math.max(0, Math.min(1, fraction));
  ws.seekTo(clamped);
}

/**
 * Register a callback for when the user clicks or drags on the waveform.
 * Returns an unsubscribe function.
 *
 * @param callback - Function called with the seek position as a fraction (0–1)
 * @returns Unsubscribe function
 */
export function onSeek(callback: (fraction: number) => void): () => void {
  if (!ws) return () => {};

  return ws.on('interaction', (newTime: number) => {
    const duration = ws!.getDuration();
    if (duration > 0) {
      callback(newTime / duration);
    }
  });
}

/**
 * Get the WaveSurfer instance (for testing purposes only).
 * @internal
 */
export function getWaveSurfer(): WaveSurfer | null {
  return ws;
}

/**
 * Destroy the wavesurfer instance and clean up resources.
 */
export function destroy(): void {
  if (ws) {
    ws.destroy();
    ws = null;
  }
}
