/**
 * SVG-based waveform renderer using pre-computed peak data.
 *
 * Replaces WaveSurfer.js for waveform visualization. Renders lightweight
 * SVG `<rect>` bars from peak data (fetched as JSON). The audio engine
 * (Howler.js) remains the sole audio source — this module is purely visual.
 *
 * Exports a factory function `createSvgWaveform()` that returns independent
 * instances, each managing its own SVG element, peaks, and event listeners.
 * This allows multiple waveform instances to coexist (e.g., one per TrackRow).
 */

import { getAccentHoverColor } from '../../scripts/accent-color';

/** Configuration options for the SVG waveform renderer. */
export interface SvgWaveformOptions {
  /** SVG height in pixels. Default: 40 */
  height?: number;
  /** Color for unplayed bars. Default: '#6b7280' (gray-500) */
  waveColor?: string;
  /** Color for played/progress bars. Resolved at runtime via getAccentHoverColor() if not set. */
  progressColor?: string;
  /** Bar width in pixels. Default: 2 */
  barWidth?: number;
  /** Gap between bars in pixels. Default: 1 */
  barGap?: number;
  /** Bar border radius in pixels. Default: 2 */
  barRadius?: number;
}

/** Default option values. */
const defaults: Required<SvgWaveformOptions> = {
  height: 40,
  waveColor: '#6b7280',
  progressColor: '#facc15',
  barWidth: 2,
  barGap: 1,
  barRadius: 2,
};

/** An independent SVG waveform renderer instance. */
export interface SvgWaveformInstance {
  /** Load peak data and render bars. */
  loadPeaks(peaks: number[]): void;
  /** Update the visual progress indicator (0–1 fraction). */
  setProgress(fraction: number): void;
  /** Register a click/drag seek handler. Returns unsubscribe function. */
  onSeek(callback: (fraction: number) => void): () => void;
  /** Destroy the instance, removing SVG and event listeners. */
  destroy(): void;
}

/**
 * Create an independent SVG waveform renderer instance in the given container.
 *
 * @param container - DOM element where the waveform SVG will be rendered
 * @param options - Optional overrides for visual configuration
 * @returns A waveform instance with loadPeaks, setProgress, onSeek, and destroy methods
 */
export function createSvgWaveform(
  container: HTMLElement,
  options?: SvgWaveformOptions,
): SvgWaveformInstance {
  const resolvedOptions: Required<SvgWaveformOptions> = {
    ...defaults,
    progressColor: getAccentHoverColor(),
    ...options,
  };

  let peaks: number[] = [];
  let currentFraction = 0;
  let seekCallback: ((fraction: number) => void) | null = null;
  let clickHandler: ((e: MouseEvent) => void) | null = null;
  let dragHandler: ((e: MouseEvent) => void) | null = null;
  let mouseUpHandler: (() => void) | null = null;

  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', String(resolvedOptions.height));
  svg.style.display = 'block';
  svg.style.cursor = 'pointer';
  container.appendChild(svg);

  // Self-reference for closures — set after object creation
  const instance: SvgWaveformInstance = {
    loadPeaks: () => {},
    setProgress: () => {},
    onSeek: () => () => {},
    destroy: () => {},
  };

  /** Render SVG rect elements from peak data. */
  function renderBars(): void {
    svg.innerHTML = '';
    if (peaks.length === 0) return;

    const { barWidth, barGap, barRadius, height, waveColor, progressColor } = resolvedOptions;
    const step = barWidth + barGap;
    const svgWidth = peaks.length * step;

    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'none');

    const progressIndex = Math.floor(currentFraction * peaks.length);

    for (let i = 0; i < peaks.length; i++) {
      const barHeight = Math.max(2, peaks[i] * height);
      const y = (height - barHeight) / 2;
      const x = i * step;

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(x));
      rect.setAttribute('y', String(y));
      rect.setAttribute('width', String(barWidth));
      rect.setAttribute('height', String(barHeight));
      rect.setAttribute('rx', String(barRadius));
      rect.setAttribute('ry', String(barRadius));
      rect.setAttribute('fill', i < progressIndex ? progressColor : waveColor);
      rect.dataset.index = String(i);

      svg.appendChild(rect);
    }
  }

  /** Calculate fraction from mouse event position relative to SVG. */
  function getFraction(e: MouseEvent): number {
    const rect = svg.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const x = e.clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  }

  // Assign actual implementations
  instance.loadPeaks = (newPeaks: number[]) => {
    peaks = newPeaks;
    renderBars();
  };

  instance.setProgress = (fraction: number) => {
    if (peaks.length === 0) return;
    currentFraction = Math.max(0, Math.min(1, fraction));

    const progressIndex = Math.floor(currentFraction * peaks.length);
    const rects = svg.querySelectorAll('rect');
    rects.forEach((rect, i) => {
      rect.setAttribute(
        'fill',
        i < progressIndex ? resolvedOptions.progressColor : resolvedOptions.waveColor,
      );
    });
  };

  instance.onSeek = (callback: (fraction: number) => void) => {
    seekCallback = callback;

    const handleClick = (e: MouseEvent) => {
      if (seekCallback) {
        const fraction = getFraction(e);
        seekCallback(fraction);
        instance.setProgress(fraction);
      }
    };

    const handleDrag = (e: MouseEvent) => {
      if (e.buttons > 0 && seekCallback) {
        const fraction = getFraction(e);
        seekCallback(fraction);
        instance.setProgress(fraction);
      }
    };

    const handleMouseUp = () => {
      // Drag ended
    };

    svg.addEventListener('mousedown', handleClick);
    svg.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleMouseUp);

    clickHandler = handleClick;
    dragHandler = handleDrag;
    mouseUpHandler = handleMouseUp;

    return () => {
      svg.removeEventListener('mousedown', handleClick);
      svg.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleMouseUp);
      clickHandler = null;
      dragHandler = null;
      mouseUpHandler = null;
      seekCallback = null;
    };
  };

  instance.destroy = () => {
    if (clickHandler) svg.removeEventListener('mousedown', clickHandler);
    if (dragHandler) svg.removeEventListener('mousemove', dragHandler);
    if (mouseUpHandler) window.removeEventListener('mouseup', mouseUpHandler);
    if (svg.parentNode) svg.parentNode.removeChild(svg);
  };

  return instance;
}
