// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/preact';
import Player from '../../../src/components/AudioPlayer/Player';

// Mock audioEngine module
vi.mock('../../../src/components/AudioPlayer/audioEngine', () => ({
  initReactiveSubscription: vi.fn(),
  play: vi.fn(),
  pause: vi.fn(),
  togglePlay: vi.fn(),
  seek: vi.fn(),
  setVolume: vi.fn(),
  destroy: vi.fn(),
}));

// Mock waveformRenderer module
vi.mock('../../../src/components/AudioPlayer/waveformRenderer', () => ({
  init: vi.fn(),
  loadAudio: vi.fn(),
  setProgress: vi.fn(),
  onSeek: vi.fn(() => vi.fn()),
  destroy: vi.fn(),
}));

// Mock playlistStore signals
let mockPlaybackState = 'idle';
let mockCurrentTrack: any = null;
let mockIsPlaying = false;
let mockVolume = 0.8;
let mockCurrentTime = 0;
let mockDuration = 0;

vi.mock('../../../src/components/AudioPlayer/playlistStore', () => ({
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

const mockTrack = {
  id: '1',
  title: 'Style Test Song',
  artist: 'Style Test Artist',
  audioUrl: 'https://example.com/test.mp3',
  artworkUrl: 'https://example.com/artwork.jpg',
};

describe('Player Style', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPlaybackState = 'idle';
    mockCurrentTrack = null;
    mockIsPlaying = false;
    mockVolume = 0.8;
    mockCurrentTime = 0;
    mockDuration = 0;
  });

  it('renders without errors when a track is loaded', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;
    mockDuration = 200;

    const { container } = render(<Player />);
    expect(container.querySelector('.audio-player-bar--expanded')).toBeInTheDocument();
  });

  it('renders SVG elements for transport buttons instead of emoji text', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    const { container } = render(<Player />);

    // Previous button should contain an SVG
    const prevBtn = screen.getByLabelText('Previous track');
    const prevSvg = prevBtn.querySelector('svg');
    expect(prevSvg).toBeInTheDocument();
    expect(prevSvg?.getAttribute('viewBox')).toBe('0 0 24 24');

    // Play button should contain an SVG (play icon)
    const playBtn = screen.getByLabelText('Play');
    const playSvg = playBtn.querySelector('svg');
    expect(playSvg).toBeInTheDocument();
    expect(playSvg?.getAttribute('viewBox')).toBe('0 0 24 24');

    // Next button should contain an SVG
    const nextBtn = screen.getByLabelText('Next track');
    const nextSvg = nextBtn.querySelector('svg');
    expect(nextSvg).toBeInTheDocument();
    expect(nextSvg?.getAttribute('viewBox')).toBe('0 0 24 24');

    // Verify no emoji characters in transport buttons
    const transportBtns = container.querySelectorAll('.audio-player-transport button');
    transportBtns.forEach((btn) => {
      // SVG elements should be present, not text emoji
      expect(btn.querySelector('svg')).toBeInTheDocument();
      // The button text content should not contain emoji
      const textContent = btn.textContent ?? '';
      expect(textContent).not.toMatch(/[⏮⏸▶⏭🔊🔈]/u);
    });
  });

  it('applies correct CSS classes to player bar elements', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    const { container } = render(<Player />);

    // Bar container classes
    const bar = container.querySelector('.audio-player-bar.audio-player-bar--expanded');
    expect(bar).toBeInTheDocument();

    // Waveform area
    expect(container.querySelector('.audio-player-waveform')).toBeInTheDocument();

    // Controls row
    expect(container.querySelector('.audio-player-controls')).toBeInTheDocument();

    // Track info section
    expect(container.querySelector('.audio-player-track-info')).toBeInTheDocument();
    expect(container.querySelector('.audio-player-track-info__artwork')).toBeInTheDocument();
    expect(container.querySelector('.audio-player-track-info__details')).toBeInTheDocument();
    expect(container.querySelector('.audio-player-track-info__title')).toBeInTheDocument();
    expect(container.querySelector('.audio-player-track-info__artist')).toBeInTheDocument();

    // Transport section
    expect(container.querySelector('.audio-player-transport')).toBeInTheDocument();
    expect(container.querySelector('.audio-player-btn--play')).toBeInTheDocument();
    expect(container.querySelectorAll('.audio-player-btn--skip')).toHaveLength(2);

    // Volume section
    expect(container.querySelector('.audio-player-volume')).toBeInTheDocument();
    expect(container.querySelector('.audio-player-volume__icon')).toBeInTheDocument();
    expect(container.querySelector('.audio-player-volume__slider')).toBeInTheDocument();

    // Progress fallback
    expect(container.querySelector('.audio-player-progress')).toBeInTheDocument();
  });

  it('renders volume-on SVG when volume > 0 and volume-off SVG when muted', () => {
    // Test with volume > 0 (volume-on with sound waves)
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;
    mockVolume = 0.8;

    const { container: container1 } = render(<Player />);

    const volumeIconOn = container1.querySelector('.audio-player-volume__icon');
    expect(volumeIconOn).toBeInTheDocument();
    const svgOn = volumeIconOn?.querySelector('svg');
    expect(svgOn).toBeInTheDocument();
    // Volume-on SVG has path elements for sound waves
    const pathsOn = svgOn?.querySelectorAll('path');
    expect(pathsOn?.length).toBeGreaterThanOrEqual(2); // Two arc paths for waves

    // Clean up
    container1.remove();

    // Reset and test with volume = 0 (muted with X lines)
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;
    mockVolume = 0;

    const { container: container2 } = render(<Player />);

    const volumeIconOff = container2.querySelector('.audio-player-volume__icon');
    expect(volumeIconOff).toBeInTheDocument();
    const svgOff = volumeIconOff?.querySelector('svg');
    expect(svgOff).toBeInTheDocument();
    // Muted SVG has line elements for the X mark
    const linesOff = svgOff?.querySelectorAll('line');
    expect(linesOff?.length).toBe(2); // Two lines forming the X

    // Verify no emoji in either state
    const volumeTextOn = container1.querySelector('.audio-player-volume__icon')?.textContent ?? '';
    const volumeTextOff = container2.querySelector('.audio-player-volume__icon')?.textContent ?? '';
    expect(volumeTextOn).not.toMatch(/[🔊🔈]/u);
    expect(volumeTextOff).not.toMatch(/[🔊🔈]/u);
  });
});
