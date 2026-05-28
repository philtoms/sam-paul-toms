// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock accent-color module
vi.mock('../../src/scripts/accent-color', () => ({
  getAccentColor: () => '#eab308',
  getAccentHoverColor: () => '#facc15',
}));

import * as waveformRenderer from '../../src/components/AudioPlayer/waveformRenderer';

describe('waveformRenderer', () => {
  beforeEach(() => {
    waveformRenderer.destroy();
  });

  afterEach(() => {
    waveformRenderer.destroy();
  });

  describe('init', () => {
    it('creates an SVG element in the container', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container);

      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('sets SVG height from options', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container, { height: 96 });

      const svg = container.querySelector('svg');
      expect(svg!.getAttribute('height')).toBe('96');
    });

    it('destroys previous instance before creating new one', () => {
      const container1 = document.createElement('div');
      const container2 = document.createElement('div');

      waveformRenderer.init(container1);
      const svg1 = container1.querySelector('svg');

      waveformRenderer.init(container2);

      // First container's SVG should be removed
      expect(container1.contains(svg1)).toBe(false);
      // Second container should have an SVG
      expect(container2.querySelector('svg')).toBeTruthy();
    });
  });

  describe('loadAudio', () => {
    it('is a no-op (backward-compat)', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container);

      // Should not throw
      expect(() => waveformRenderer.loadAudio('https://example.com/audio.mp3')).not.toThrow();
    });
  });

  describe('loadPeaks', () => {
    it('renders bars from peak data', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container);
      waveformRenderer.loadPeaks([0.2, 0.5, 0.8, 0.3]);

      const rects = container.querySelectorAll('rect');
      expect(rects.length).toBe(4);
    });

    it('does nothing if not initialized', () => {
      waveformRenderer.destroy();
      expect(() => waveformRenderer.loadPeaks([0.5])).not.toThrow();
    });
  });

  describe('setProgress', () => {
    it('colors bars based on progress fraction', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container, {
        waveColor: '#6b7280',
        progressColor: '#facc15',
      });
      waveformRenderer.loadPeaks([0.5, 0.5, 0.5, 0.5]);

      waveformRenderer.setProgress(0.5);

      const rects = container.querySelectorAll('rect');
      // floor(0.5 * 4) = 2 → first 2 bars colored
      expect(rects[0].getAttribute('fill')).toBe('#facc15');
      expect(rects[1].getAttribute('fill')).toBe('#facc15');
      expect(rects[2].getAttribute('fill')).toBe('#6b7280');
      expect(rects[3].getAttribute('fill')).toBe('#6b7280');
    });

    it('clamps fraction to 0–1 range', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container, {
        waveColor: '#6b7280',
        progressColor: '#facc15',
      });
      waveformRenderer.loadPeaks([0.5, 0.5]);

      waveformRenderer.setProgress(-0.5);
      const rects = container.querySelectorAll('rect');
      expect(rects[0].getAttribute('fill')).toBe('#6b7280');

      waveformRenderer.setProgress(1.5);
      expect(rects[0].getAttribute('fill')).toBe('#facc15');
      expect(rects[1].getAttribute('fill')).toBe('#facc15');
    });

    it('does nothing if not initialized', () => {
      waveformRenderer.destroy();
      expect(() => waveformRenderer.setProgress(0.5)).not.toThrow();
    });
  });

  describe('onSeek', () => {
    it('returns an unsubscribe function', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      waveformRenderer.init(container);
      waveformRenderer.loadPeaks([0.5, 0.5]);

      const callback = vi.fn();
      const unsub = waveformRenderer.onSeek(callback);

      expect(typeof unsub).toBe('function');

      unsub();
      document.body.removeChild(container);
    });

    it('returns no-op unsubscribe when not initialized', () => {
      waveformRenderer.destroy();
      const result = waveformRenderer.onSeek(vi.fn());
      expect(typeof result).toBe('function');
    });
  });

  describe('destroy', () => {
    it('removes SVG from container', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container);

      expect(container.querySelector('svg')).toBeTruthy();

      waveformRenderer.destroy();

      expect(container.querySelector('svg')).toBeFalsy();
    });

    it('is safe to call when not initialized', () => {
      expect(() => waveformRenderer.destroy()).not.toThrow();
    });

    it('is safe to call multiple times', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container);

      waveformRenderer.destroy();
      expect(() => waveformRenderer.destroy()).not.toThrow();
    });
  });
});
