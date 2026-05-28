// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock accent-color module so progressColor resolves to the default
vi.mock('../../src/scripts/accent-color', () => ({
  getAccentColor: () => '#eab308',
}));

// Mock wavesurfer.js
const mockWaveSurferInstance = {
  setVolume: vi.fn(),
  load: vi.fn(),
  seekTo: vi.fn(),
  on: vi.fn(() => vi.fn()), // returns unsubscribe function
  getDuration: vi.fn(() => 180),
  destroy: vi.fn(),
};

let MockWaveSurferCreate: ReturnType<typeof vi.fn>;

vi.mock('wavesurfer.js', () => {
  MockWaveSurferCreate = vi.fn(() => mockWaveSurferInstance);
  return {
    default: {
      create: MockWaveSurferCreate,
    },
  };
});

let waveformRenderer: typeof import('../../src/components/AudioPlayer/waveformRenderer');

describe('waveformRenderer', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    vi.doMock('wavesurfer.js', () => ({
      default: {
        create: vi.fn(() => mockWaveSurferInstance),
      },
    }));

    // Re-mock each time so MockWaveSurferCreate is fresh
    MockWaveSurferCreate = vi.fn(() => mockWaveSurferInstance);
    const mod = await import('wavesurfer.js');
    (mod.default as any).create = MockWaveSurferCreate;

    waveformRenderer = await import(
      '../../src/components/AudioPlayer/waveformRenderer'
    );
  });

  afterEach(() => {
    waveformRenderer.destroy();
  });

  describe('init', () => {
    it('creates WaveSurfer instance with correct default options', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container);

      expect(MockWaveSurferCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          container,
          height: 40,
          waveColor: '#6b7280',
          progressColor: '#eab308',
          cursorColor: '#f5f5f5',
          barWidth: 2,
          barGap: 1,
          barRadius: 2,
          fillParent: true,
          interact: true,
        }),
      );
    });

    it('merges custom options over defaults', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container, { height: 96, waveColor: '#ff0000' });

      expect(MockWaveSurferCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          container,
          height: 96,
          waveColor: '#ff0000',
          barWidth: 2, // default preserved
        }),
      );
    });

    it('mutes wavesurfer audio output', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container);

      expect(mockWaveSurferInstance.setVolume).toHaveBeenCalledWith(0);
    });

    it('destroys previous instance before creating new one', () => {
      const container1 = document.createElement('div');
      const container2 = document.createElement('div');

      waveformRenderer.init(container1);
      expect(mockWaveSurferInstance.destroy).not.toHaveBeenCalled();

      waveformRenderer.init(container2);
      expect(mockWaveSurferInstance.destroy).toHaveBeenCalled();
    });
  });

  describe('loadAudio', () => {
    it('loads audio URL into wavesurfer', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container);

      waveformRenderer.loadAudio('https://example.com/audio.mp3');

      expect(mockWaveSurferInstance.load).toHaveBeenCalledWith(
        'https://example.com/audio.mp3',
      );
    });

    it('re-ensures volume is 0 after loading', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container);

      mockWaveSurferInstance.setVolume.mockClear();
      waveformRenderer.loadAudio('https://example.com/audio.mp3');

      expect(mockWaveSurferInstance.setVolume).toHaveBeenCalledWith(0);
    });

    it('does nothing if not initialized', () => {
      // destroy to ensure no instance
      waveformRenderer.destroy();
      mockWaveSurferInstance.load.mockClear();

      waveformRenderer.loadAudio('https://example.com/audio.mp3');

      expect(mockWaveSurferInstance.load).not.toHaveBeenCalled();
    });
  });

  describe('setProgress', () => {
    beforeEach(() => {
      const container = document.createElement('div');
      waveformRenderer.init(container);
    });

    it('calls ws.seekTo with the given fraction', () => {
      waveformRenderer.setProgress(0.5);
      expect(mockWaveSurferInstance.seekTo).toHaveBeenCalledWith(0.5);
    });

    it('clamps fraction to 0–1 range', () => {
      waveformRenderer.setProgress(-0.5);
      expect(mockWaveSurferInstance.seekTo).toHaveBeenCalledWith(0);

      waveformRenderer.setProgress(1.5);
      expect(mockWaveSurferInstance.seekTo).toHaveBeenCalledWith(1);
    });

    it('does nothing if not initialized', () => {
      waveformRenderer.destroy();
      mockWaveSurferInstance.seekTo.mockClear();

      waveformRenderer.setProgress(0.5);
      expect(mockWaveSurferInstance.seekTo).not.toHaveBeenCalled();
    });
  });

  describe('onSeek', () => {
    beforeEach(() => {
      const container = document.createElement('div');
      waveformRenderer.init(container);
    });

    it('registers an interaction event listener', () => {
      const callback = vi.fn();
      waveformRenderer.onSeek(callback);

      expect(mockWaveSurferInstance.on).toHaveBeenCalledWith(
        'interaction',
        expect.any(Function),
      );
    });

    it('callback converts newTime to fraction using duration', () => {
      const callback = vi.fn();
      waveformRenderer.onSeek(callback);

      // Get the handler passed to ws.on
      const handler = mockWaveSurferInstance.on.mock.calls[0][1];

      mockWaveSurferInstance.getDuration.mockReturnValue(180);
      handler(90); // half of 180

      expect(callback).toHaveBeenCalledWith(0.5);
    });

    it('skips callback when duration is 0', () => {
      const callback = vi.fn();
      waveformRenderer.onSeek(callback);

      const handler = mockWaveSurferInstance.on.mock.calls[0][1];

      mockWaveSurferInstance.getDuration.mockReturnValue(0);
      handler(0);

      expect(callback).not.toHaveBeenCalled();
    });

    it('returns an unsubscribe function', () => {
      const unsubscribe = vi.fn();
      mockWaveSurferInstance.on.mockReturnValue(unsubscribe);

      const result = waveformRenderer.onSeek(vi.fn());

      expect(result).toBe(unsubscribe);
    });

    it('returns no-op unsubscribe when not initialized', () => {
      waveformRenderer.destroy();
      const result = waveformRenderer.onSeek(vi.fn());

      expect(typeof result).toBe('function');
    });
  });

  describe('destroy', () => {
    it('calls ws.destroy and nulls the instance', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container);

      waveformRenderer.destroy();

      expect(mockWaveSurferInstance.destroy).toHaveBeenCalled();
    });

    it('is safe to call when not initialized', () => {
      expect(() => waveformRenderer.destroy()).not.toThrow();
    });

    it('is safe to call multiple times', () => {
      const container = document.createElement('div');
      waveformRenderer.init(container);

      waveformRenderer.destroy();
      mockWaveSurferInstance.destroy.mockClear();

      waveformRenderer.destroy();
      expect(mockWaveSurferInstance.destroy).not.toHaveBeenCalled();
    });
  });
});
