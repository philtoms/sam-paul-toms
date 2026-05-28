// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';

// Mock accent-color module
vi.mock('../../src/scripts/accent-color', () => ({
  getAccentColor: () => '#eab308',
  getAccentHoverColor: () => '#facc15',
}));

import { createSvgWaveform, type SvgWaveformInstance } from '../../src/components/AudioPlayer/svgWaveform';

describe('svgWaveform', () => {
  let instance: SvgWaveformInstance;

  afterEach(() => {
    if (instance) {
      instance.destroy();
    }
  });

  describe('createSvgWaveform (init)', () => {
    it('creates an SVG element in the container', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container);

      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg!.namespaceURI).toBe('http://www.w3.org/2000/svg');
    });

    it('sets SVG height from options', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container, { height: 60 });

      const svg = container.querySelector('svg');
      expect(svg!.getAttribute('height')).toBe('60');
    });

    it('uses default height of 40', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container);

      const svg = container.querySelector('svg');
      expect(svg!.getAttribute('height')).toBe('40');
    });

    it('does NOT destroy other instances when creating a new one', () => {
      const container1 = document.createElement('div');
      const container2 = document.createElement('div');

      const inst1 = createSvgWaveform(container1);
      const inst2 = createSvgWaveform(container2);

      // Both containers should have SVGs
      expect(container1.querySelector('svg')).toBeTruthy();
      expect(container2.querySelector('svg')).toBeTruthy();

      inst1.destroy();
      inst2.destroy();
    });

    it('applies custom options', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container, {
        height: 50,
        waveColor: '#ff0000',
        progressColor: '#00ff00',
        barWidth: 3,
        barGap: 2,
        barRadius: 1,
      });

      // Load peaks to render bars and verify options are applied
      instance.loadPeaks([0.5, 0.8, 0.3]);
      const svg = container.querySelector('svg')!;
      const rects = svg.querySelectorAll('rect');
      expect(rects.length).toBe(3);

      // Check bar width from custom option
      expect(rects[0].getAttribute('width')).toBe('3');
    });
  });

  describe('loadPeaks', () => {
    it('renders the correct number of rect elements', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container);
      instance.loadPeaks([0.2, 0.5, 0.8, 0.3, 0.6]);

      const rects = container.querySelectorAll('rect');
      expect(rects.length).toBe(5);
    });

    it('renders bars with heights matching peak values', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container, { height: 40 });
      instance.loadPeaks([0.5]);

      const rect = container.querySelector('rect')!;
      const barHeight = parseFloat(rect.getAttribute('height')!);
      // barHeight = max(2, 0.5 * 40) = 20
      expect(barHeight).toBe(20);
    });

    it('renders bars with minimum height of 2 for tiny peaks', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container, { height: 40 });
      instance.loadPeaks([0.001]);

      const rect = container.querySelector('rect')!;
      const barHeight = parseFloat(rect.getAttribute('height')!);
      expect(barHeight).toBe(2); // min height
    });

    it('sets SVG viewBox based on number of peaks and bar dimensions', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container, { barWidth: 2, barGap: 1, height: 40 });
      instance.loadPeaks([0.5, 0.5, 0.5]);

      const svg = container.querySelector('svg')!;
      // 3 peaks * (2 + 1) = 9 width, height = 40
      expect(svg.getAttribute('viewBox')).toBe('0 0 9 40');
    });

    it('positions bars centered vertically', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container, { height: 40 });
      instance.loadPeaks([1.0]);

      const rect = container.querySelector('rect')!;
      // barHeight = 40 (full height), y = (40 - 40) / 2 = 0
      expect(rect.getAttribute('y')).toBe('0');
    });

    it('applies border radius to bars', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container, { barRadius: 3 });
      instance.loadPeaks([0.5]);

      const rect = container.querySelector('rect')!;
      expect(rect.getAttribute('rx')).toBe('3');
      expect(rect.getAttribute('ry')).toBe('3');
    });

    it('clears previous bars when loading new peaks', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container);

      instance.loadPeaks([0.5, 0.5]);
      expect(container.querySelectorAll('rect').length).toBe(2);

      instance.loadPeaks([0.5, 0.5, 0.5, 0.5]);
      expect(container.querySelectorAll('rect').length).toBe(4);
    });
  });

  describe('setProgress', () => {
    it('colors bars correctly based on progress fraction', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container, {
        waveColor: '#6b7280',
        progressColor: '#facc15',
      });
      instance.loadPeaks([0.5, 0.5, 0.5, 0.5]);

      // 50% progress → first 2 bars colored
      instance.setProgress(0.5);

      const rects = container.querySelectorAll('rect');
      expect(rects[0].getAttribute('fill')).toBe('#facc15'); // played
      expect(rects[1].getAttribute('fill')).toBe('#facc15'); // played
      expect(rects[2].getAttribute('fill')).toBe('#6b7280'); // unplayed
      expect(rects[3].getAttribute('fill')).toBe('#6b7280'); // unplayed
    });

    it('clamps fraction to 0–1 range', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container, {
        waveColor: '#6b7280',
        progressColor: '#facc15',
      });
      instance.loadPeaks([0.5, 0.5]);

      instance.setProgress(-0.5);
      const rects = container.querySelectorAll('rect');
      expect(rects[0].getAttribute('fill')).toBe('#6b7280'); // 0 progress
      expect(rects[1].getAttribute('fill')).toBe('#6b7280');

      instance.setProgress(1.5);
      expect(rects[0].getAttribute('fill')).toBe('#facc15'); // full progress
      expect(rects[1].getAttribute('fill')).toBe('#facc15');
    });

    it('sets all bars to waveColor at progress 0', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container, {
        waveColor: '#6b7280',
        progressColor: '#facc15',
      });
      instance.loadPeaks([0.5, 0.5, 0.5]);

      instance.setProgress(0);

      const rects = container.querySelectorAll('rect');
      for (const rect of rects) {
        expect(rect.getAttribute('fill')).toBe('#6b7280');
      }
    });

    it('sets all bars to progressColor at progress 1', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container, {
        waveColor: '#6b7280',
        progressColor: '#facc15',
      });
      instance.loadPeaks([0.5, 0.5, 0.5]);

      instance.setProgress(1);

      const rects = container.querySelectorAll('rect');
      for (const rect of rects) {
        expect(rect.getAttribute('fill')).toBe('#facc15');
      }
    });

    it('does nothing if no peaks loaded', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container);
      // No loadPeaks called — should not throw
      expect(() => instance.setProgress(0.5)).not.toThrow();
    });
  });

  describe('onSeek', () => {
    it('registers a click handler that calculates correct fraction', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      instance = createSvgWaveform(container);
      instance.loadPeaks([0.5, 0.5, 0.5, 0.5]);

      const callback = vi.fn();
      instance.onSeek(callback);

      const svg = container.querySelector('svg')!;
      svg.getBoundingClientRect = () => ({
        left: 0,
        top: 0,
        width: 400,
        height: 40,
        right: 400,
        bottom: 40,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      // Click at 50% position
      const clickEvent = new MouseEvent('mousedown', {
        clientX: 200,
        bubbles: true,
      });
      svg.dispatchEvent(clickEvent);

      expect(callback).toHaveBeenCalledWith(0.5);

      document.body.removeChild(container);
    });

    it('returns an unsubscribe function that removes the handler', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      instance = createSvgWaveform(container);
      instance.loadPeaks([0.5, 0.5]);

      const callback = vi.fn();
      const unsubscribe = instance.onSeek(callback);

      unsubscribe();

      const svg = container.querySelector('svg')!;
      svg.getBoundingClientRect = () => ({
        left: 0, top: 0, width: 400, height: 40, right: 400, bottom: 40, x: 0, y: 0, toJSON: () => ({}),
      });

      const clickEvent = new MouseEvent('mousedown', {
        clientX: 200,
        bubbles: true,
      });
      svg.dispatchEvent(clickEvent);

      expect(callback).not.toHaveBeenCalled();

      document.body.removeChild(container);
    });

    it('handles drag events (mousemove with button pressed)', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      instance = createSvgWaveform(container);
      instance.loadPeaks([0.5, 0.5, 0.5, 0.5]);

      const callback = vi.fn();
      instance.onSeek(callback);

      const svg = container.querySelector('svg')!;
      svg.getBoundingClientRect = () => ({
        left: 0, top: 0, width: 400, height: 40, right: 400, bottom: 40, x: 0, y: 0, toJSON: () => ({}),
      });

      // mousemove with button pressed (buttons = 1)
      const dragEvent = new MouseEvent('mousemove', {
        clientX: 100,
        buttons: 1,
        bubbles: true,
      });
      svg.dispatchEvent(dragEvent);

      expect(callback).toHaveBeenCalledWith(0.25); // 100/400

      document.body.removeChild(container);
    });

    it('ignores mousemove without button pressed', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      instance = createSvgWaveform(container);
      instance.loadPeaks([0.5, 0.5]);

      const callback = vi.fn();
      instance.onSeek(callback);

      const svg = container.querySelector('svg')!;
      svg.getBoundingClientRect = () => ({
        left: 0, top: 0, width: 400, height: 40, right: 400, bottom: 40, x: 0, y: 0, toJSON: () => ({}),
      });

      // mousemove without button (buttons = 0)
      const hoverEvent = new MouseEvent('mousemove', {
        clientX: 200,
        buttons: 0,
        bubbles: true,
      });
      svg.dispatchEvent(hoverEvent);

      expect(callback).not.toHaveBeenCalled();

      document.body.removeChild(container);
    });

    it('clamps fraction to 0 when clicking left of SVG', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      instance = createSvgWaveform(container);
      instance.loadPeaks([0.5, 0.5]);

      const callback = vi.fn();
      instance.onSeek(callback);

      const svg = container.querySelector('svg')!;
      svg.getBoundingClientRect = () => ({
        left: 100, top: 0, width: 400, height: 40, right: 500, bottom: 40, x: 100, y: 0, toJSON: () => ({}),
      });

      const clickEvent = new MouseEvent('mousedown', {
        clientX: 50,
        bubbles: true,
      });
      svg.dispatchEvent(clickEvent);

      expect(callback).toHaveBeenCalledWith(0);

      document.body.removeChild(container);
    });

    it('clamps fraction to 1 when clicking right of SVG', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      instance = createSvgWaveform(container);
      instance.loadPeaks([0.5, 0.5]);

      const callback = vi.fn();
      instance.onSeek(callback);

      const svg = container.querySelector('svg')!;
      svg.getBoundingClientRect = () => ({
        left: 100, top: 0, width: 400, height: 40, right: 500, bottom: 40, x: 100, y: 0, toJSON: () => ({}),
      });

      const clickEvent = new MouseEvent('mousedown', {
        clientX: 600,
        bubbles: true,
      });
      svg.dispatchEvent(clickEvent);

      expect(callback).toHaveBeenCalledWith(1);

      document.body.removeChild(container);
    });
  });

  describe('destroy', () => {
    it('removes the SVG element from the container', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container);

      expect(container.querySelector('svg')).toBeTruthy();

      instance.destroy();

      expect(container.querySelector('svg')).toBeFalsy();
    });

    it('is safe to call multiple times', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container);

      instance.destroy();
      expect(() => instance.destroy()).not.toThrow();
    });

    it('removes event listeners', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      instance = createSvgWaveform(container);
      instance.loadPeaks([0.5, 0.5]);

      const callback = vi.fn();
      instance.onSeek(callback);

      instance.destroy();

      // SVG is removed, so no more events should fire
      const svg = container.querySelector('svg');
      expect(svg).toBeNull();

      document.body.removeChild(container);
    });
  });

  describe('multiple concurrent instances', () => {
    it('multiple instances can coexist without interfering', () => {
      const container1 = document.createElement('div');
      const container2 = document.createElement('div');

      const inst1 = createSvgWaveform(container1, { waveColor: '#111111', progressColor: '#222222' });
      const inst2 = createSvgWaveform(container2, { waveColor: '#333333', progressColor: '#444444' });

      inst1.loadPeaks([0.5, 0.5, 0.5]);
      inst2.loadPeaks([0.8, 0.8]);

      inst1.setProgress(0.5);
      inst2.setProgress(1);

      // Instance 1: floor(0.5 * 3) = 1 → only bar index 0 is played
      const rects1 = container1.querySelectorAll('rect');
      expect(rects1.length).toBe(3);
      expect(rects1[0].getAttribute('fill')).toBe('#222222');
      expect(rects1[1].getAttribute('fill')).toBe('#111111');
      expect(rects1[2].getAttribute('fill')).toBe('#111111');

      // Instance 2: all bars played
      const rects2 = container2.querySelectorAll('rect');
      expect(rects2.length).toBe(2);
      expect(rects2[0].getAttribute('fill')).toBe('#444444');
      expect(rects2[1].getAttribute('fill')).toBe('#444444');

      inst1.destroy();
      inst2.destroy();
    });
  });

  describe('custom options', () => {
    it('applies custom height, colors, and bar dimensions', () => {
      const container = document.createElement('div');
      instance = createSvgWaveform(container, {
        height: 24,
        waveColor: '#333333',
        progressColor: '#ffcc00',
        barWidth: 3,
        barGap: 2,
        barRadius: 1,
      });
      instance.loadPeaks([0.8, 0.4, 0.6]);

      const svg = container.querySelector('svg')!;
      expect(svg.getAttribute('height')).toBe('24');

      const rects = svg.querySelectorAll('rect');
      expect(rects.length).toBe(3);

      // Check bar width
      expect(rects[0].getAttribute('width')).toBe('3');

      // Check bar radius
      expect(rects[0].getAttribute('rx')).toBe('1');

      // Check bar height for peak 0.8 with height 24
      // barHeight = max(2, 0.8 * 24) = 19.2
      expect(parseFloat(rects[0].getAttribute('height')!)).toBeCloseTo(19.2);

      // Check viewBox: 3 peaks * (3 + 2) = 15 width
      expect(svg.getAttribute('viewBox')).toBe('0 0 15 24');
    });
  });
});
