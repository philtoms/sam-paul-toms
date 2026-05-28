/**
 * Waveform renderer — thin wrapper around svgWaveform.ts.
 *
 * Provides the same external API shape that Player.tsx expects
 * (init, loadAudio → loadPeaks, setProgress, onSeek, destroy),
 * but delegates to the lightweight SVG renderer using pre-computed
 * peak data instead of WaveSurfer.js canvas-based decoding.
 *
 * The audio engine (Howler.js / audioEngine.ts) is the sole audio source.
 * This module is purely visual.
 */

import {
  createSvgWaveform,
  type SvgWaveformInstance,
  type SvgWaveformOptions,
} from './svgWaveform';

let instance: SvgWaveformInstance | null = null;

/**
 * Initialize the waveform renderer in the given container element.
 * Creates an SVG waveform instance with the configured visual options.
 *
 * @param container - DOM element where the waveform will be rendered
 * @param options - Optional overrides for waveform configuration
 */
export function init(
  container: HTMLElement,
  options?: SvgWaveformOptions,
): void {
  destroy();
  instance = createSvgWaveform(container, options);
}

/**
 * Load pre-computed peak data and render waveform bars.
 * Replaces the old loadAudio() which downloaded and decoded MP3 files client-side.
 *
 * @param peaks - Array of normalized peak values (0–1), typically ~200 values
 */
export function loadPeaks(peaks: number[]): void {
  if (!instance) return;
  instance.loadPeaks(peaks);
}

/**
 * Backward-compatible alias. In the WaveSurfer era, this downloaded an MP3
 * and decoded it client-side. Now it's a no-op — peaks must be loaded via
 * loadPeaks(). Kept for API compatibility during migration.
 *
 * @deprecated Use loadPeaks() instead. This will be removed in a future refactor.
 */
export function loadAudio(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _url: string,
): void {
  // No-op: waveform data is now loaded via loadPeaks()
  // The MP3 file is only fetched by Howler.js when the user clicks play
}

/**
 * Update the visual progress bar to reflect the current playback position.
 *
 * @param fraction - Playback position as a fraction of total duration (0–1)
 */
export function setProgress(fraction: number): void {
  if (!instance) return;
  instance.setProgress(fraction);
}

/**
 * Register a callback for when the user clicks or drags on the waveform.
 * Returns an unsubscribe function.
 *
 * @param callback - Function called with the seek position as a fraction (0–1)
 * @returns Unsubscribe function
 */
export function onSeek(callback: (fraction: number) => void): () => void {
  if (!instance) return () => {};
  return instance.onSeek(callback);
}

/**
 * Destroy the waveform renderer and clean up resources.
 */
export function destroy(): void {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
