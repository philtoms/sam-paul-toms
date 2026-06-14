// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import path from 'node:path';
import Player from '../../src/components/AudioPlayer/Player';

// Mock audioEngine module
vi.mock('../../src/components/AudioPlayer/audioEngine', () => ({
  initReactiveSubscription: vi.fn(),
  play: vi.fn(),
  pause: vi.fn(),
  togglePlay: vi.fn(),
  seek: vi.fn(),
  setVolume: vi.fn(),
  destroy: vi.fn(),
}));

// Mock waveformRenderer module
vi.mock('../../src/components/AudioPlayer/waveformRenderer', () => ({
  init: vi.fn(),
  loadAudio: vi.fn(),
  loadPeaks: vi.fn(),
  setProgress: vi.fn(),
  onSeek: vi.fn(() => vi.fn()),
  destroy: vi.fn(),
}));

// Mock fetch for waveform peaks
const mockFetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ peaks: Array(200).fill(0.5), duration: 200 }),
  }),
);
vi.stubGlobal('fetch', mockFetch);

// Mock audio-helpers
vi.mock('../../src/scripts/audio-helpers', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getWaveformPeaksUrl: (_audioUrl: string) => '/waveforms/test.json',
}));

// Mock playlistStore signals for testing
let mockPlaybackState = 'idle';
let mockCurrentTrack: import('../../src/components/AudioPlayer/types').Track | null = null;
let mockIsPlaying = false;
let mockVolume = 0.8;
let mockCurrentTime = 0;
let mockDuration = 0;

vi.mock('../../src/components/AudioPlayer/playlistStore', () => ({
  get playbackState() {
    return { value: mockPlaybackState };
  },
  get currentTrack() {
    return { value: mockCurrentTrack };
  },
  get isPlaying() {
    return { value: mockIsPlaying };
  },
  get volume() {
    return { value: mockVolume };
  },
  get currentTime() {
    return { value: mockCurrentTime };
  },
  get duration() {
    return { value: mockDuration };
  },
  get tracks() {
    return { value: [] };
  },
  setPlaylist: vi.fn(),
  nextTrack: vi.fn(),
  prevTrack: vi.fn(),
}));

import * as audioEngine from '../../src/components/AudioPlayer/audioEngine';
import * as waveformRenderer from '../../src/components/AudioPlayer/waveformRenderer';
import * as playlistStore from '../../src/components/AudioPlayer/playlistStore';

const mockTrack = {
  id: '1',
  title: 'Test Song',
  artist: 'Test Artist',
  subtitle: 'Test Artist',
  audioUrl: 'https://example.com/test.mp3',
  artworkUrl: 'https://example.com/artwork.jpg',
};

describe('Player', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock state
    mockPlaybackState = 'idle';
    mockCurrentTrack = null;
    mockIsPlaying = false;
    mockVolume = 0.8;
    mockCurrentTime = 0;
    mockDuration = 0;
  });

  afterEach(() => {
    // Clean up any event listeners
    document.removeEventListener('audio-player:play', vi.fn());
  });

  it('renders collapsed bar when idle with no track', () => {
    const { container } = render(<Player />);

    const bar = container.querySelector('.audio-player-bar--collapsed');
    expect(bar).toBeInTheDocument();
  });

  it('renders transport controls when a track is loaded', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;
    mockDuration = 200;

    const { container } = render(<Player />);

    const expandedBar = container.querySelector(
      '.audio-player-bar--expanded',
    );
    expect(expandedBar).toBeInTheDocument();

    const prevBtn = screen.getByLabelText('Previous track');
    const playBtn = screen.getByLabelText('Play');
    const nextBtn = screen.getByLabelText('Next track');

    expect(prevBtn).toBeInTheDocument();
    expect(playBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();
  });

  it('displays track title and artist', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    render(<Player />);

    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('displays track icon when a track is loaded', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    const { container } = render(<Player />);

    const icon = container.querySelector(
      '.audio-player-track-info__icon',
    );
    expect(icon).toBeInTheDocument();
  });

  it('renders an <img> element when track icon is an HTTPS URL', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = {
      ...mockTrack,
      icon: 'https://example.com/artwork.jpg',
    };

    const { container } = render(<Player />);

    const iconContainer = container.querySelector(
      '.audio-player-track-info__icon',
    );
    expect(iconContainer).toBeInTheDocument();

    const img = iconContainer!.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute('src')).toBe('https://example.com/artwork.jpg');
  });

  it('renders an SVG (no <img>) when track icon is a category key', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = {
      ...mockTrack,
      icon: 'film',
    };

    const { container } = render(<Player />);

    const iconContainer = container.querySelector(
      '.audio-player-track-info__icon',
    );
    expect(iconContainer).toBeInTheDocument();

    const img = iconContainer!.querySelector('img');
    expect(img).not.toBeInTheDocument();

    const svg = iconContainer!.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders the default music SVG when track icon is undefined', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = {
      ...mockTrack,
      // icon is intentionally omitted
    };

    const { container } = render(<Player />);

    const iconContainer = container.querySelector(
      '.audio-player-track-info__icon',
    );
    expect(iconContainer).toBeInTheDocument();

    const img = iconContainer!.querySelector('img');
    expect(img).not.toBeInTheDocument();

    const svg = iconContainer!.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('initializes audio engine on mount', () => {
    render(<Player />);

    expect(audioEngine.initReactiveSubscription).toHaveBeenCalled();
  });

  it('clicking play/pause button toggles playback', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    render(<Player />);

    const playBtn = screen.getByLabelText('Play');
    fireEvent.click(playBtn);

    expect(audioEngine.togglePlay).toHaveBeenCalled();
  });

  it('shows pause icon when playing', () => {
    mockPlaybackState = 'playing';
    mockCurrentTrack = mockTrack;
    mockIsPlaying = true;

    render(<Player />);

    const pauseBtn = screen.getByLabelText('Pause');
    expect(pauseBtn).toBeInTheDocument();
  });

  it('handles custom audio-player:play event', () => {
    render(<Player />);

    const detail = { tracks: [mockTrack], startIndex: 0 };
    document.dispatchEvent(
      new CustomEvent('audio-player:play', { detail }),
    );

    expect(playlistStore.setPlaylist).toHaveBeenCalledWith(
      [mockTrack],
      0,
    );
  });

  it('handles custom audio-player:pause event', () => {
    render(<Player />);

    document.dispatchEvent(new CustomEvent('audio-player:pause'));

    expect(audioEngine.pause).toHaveBeenCalled();
  });

  it('handles audio-player:seek event for the current track', () => {
    mockPlaybackState = 'playing';
    mockCurrentTrack = mockTrack;
    mockIsPlaying = true;

    render(<Player />);

    document.dispatchEvent(
      new CustomEvent('audio-player:seek', {
        detail: { trackId: '1', fraction: 0.5 },
      }),
    );

    expect(audioEngine.seek).toHaveBeenCalledWith(0.5);
  });

  it('ignores audio-player:seek event for a non-matching trackId', () => {
    mockPlaybackState = 'playing';
    mockCurrentTrack = mockTrack;
    mockIsPlaying = true;

    render(<Player />);

    document.dispatchEvent(
      new CustomEvent('audio-player:seek', {
        detail: { trackId: 'other-track', fraction: 0.5 },
      }),
    );

    expect(audioEngine.seek).not.toHaveBeenCalled();
  });

  it('handles volume slider change', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    const { container } = render(<Player />);

    const slider = container.querySelector(
      '.audio-player-volume__slider',
    ) as HTMLInputElement;
    expect(slider).toBeInTheDocument();

    fireEvent.input(slider, { target: { value: '0.5' } });

    expect(audioEngine.setVolume).toHaveBeenCalledWith(0.5);
  });

  it('handles volume icon click toggle', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    const { container } = render(<Player />);

    const icon = container.querySelector('.audio-player-volume__icon');
    expect(icon).toBeInTheDocument();

    fireEvent.click(icon!);

    // Volume is 0.8, so clicking should mute
    expect(audioEngine.setVolume).toHaveBeenCalledWith(0);
  });

  it('handles volume icon click to unmute when muted', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;
    mockVolume = 0;

    const { container } = render(<Player />);

    const icon = container.querySelector('.audio-player-volume__icon');
    fireEvent.click(icon!);

    expect(audioEngine.setVolume).toHaveBeenCalledWith(0.8);
  });

  it('audio-player-bar has z-index 50 for correct stacking above main content', async () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    // Inject the Player CSS so jsdom can resolve computed styles
    const cssContent = await import('fs').then((fs) =>
      fs.promises.readFile(
        path.resolve(__dirname, '../../src/components/AudioPlayer/Player.css'),
        'utf-8',
      ),
    );
    const styleEl = document.createElement('style');
    styleEl.textContent = cssContent;
    document.head.appendChild(styleEl);

    const { container } = render(<Player />);
    const bar = container.querySelector('.audio-player-bar') as HTMLElement;
    expect(bar).toBeInTheDocument();

    const computedStyle = window.getComputedStyle(bar);
    expect(computedStyle.zIndex).toBe('50');

    // Cleanup injected style
    document.head.removeChild(styleEl);
  });

  it('fetches waveform peaks and calls loadPeaks when a track is loaded', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    render(<Player />);

    expect(waveformRenderer.init).toHaveBeenCalled();
    // Player now fetches peaks JSON instead of loading audio directly
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/waveforms/'),
    );
  });
});
