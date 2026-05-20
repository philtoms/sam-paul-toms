// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
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
  setProgress: vi.fn(),
  onSeek: vi.fn(() => vi.fn()),
  destroy: vi.fn(),
}));

// Mock playlistStore signals for testing
let mockPlaybackState = 'idle';
let mockCurrentTrack: any = null;
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

  it('displays artwork thumbnail when available', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    const { container } = render(<Player />);

    const img = container.querySelector(
      '.audio-player-track-info__artwork',
    ) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/artwork.jpg');
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

  it('calls waveformRenderer.loadAudio with track audioUrl when a track is loaded', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    render(<Player />);

    expect(waveformRenderer.loadAudio).toHaveBeenCalledWith(
      mockTrack.audioUrl,
    );
  });
});
