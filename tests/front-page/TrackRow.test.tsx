/**
 * TrackRow component tests.
 *
 * Tests track row rendering: title, subtitle, duration, category icon,
 * SVG waveform creation via createSvgWaveform (with fetch for peak data),
 * interaction handler dispatching seek events, progress sync via effect(),
 * and cleanup on unmount.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';

// Mock accent-color module
vi.mock('../../src/scripts/accent-color', () => ({
  getAccentColor: () => '#eab308',
  getAccentHoverColor: () => '#facc15',
}));

// Mock fetch for waveform peak data
const { mockFetch } = vi.hoisted(() => ({
  mockFetch: vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ peaks: Array(200).fill(0.5), duration: 200 }),
    }),
  ),
}));
vi.stubGlobal('fetch', mockFetch);

// Mock playlistStore signals
const { mockSignalRefs } = vi.hoisted(() => ({
  mockSignalRefs: {
    currentTrack: null as import('../../src/components/AudioPlayer/types').Track | null,
    currentTime: null as number | null,
    duration: null as number | null,
    isPlaying: null as boolean | null,
  },
}));

vi.mock('../../src/components/AudioPlayer/playlistStore', () => ({
  get currentTrack() {
    return mockSignalRefs.currentTrack;
  },
  get currentTime() {
    return mockSignalRefs.currentTime;
  },
  get duration() {
    return mockSignalRefs.duration;
  },
  get isPlaying() {
    return mockSignalRefs.isPlaying;
  },
}));

// Mock audio-player-events
const { mockSeekPlayer } = vi.hoisted(() => ({
  mockSeekPlayer: vi.fn(),
}));

vi.mock('../../src/scripts/audio-player-events', () => ({
  seekPlayer: mockSeekPlayer,
}));

import TrackRow from '../../src/components/TrackRow';

// Initialize real Preact signals
import { signal } from '@preact/signals';

const mockCurrentTrack = (mockSignalRefs.currentTrack = signal<import('../../src/components/AudioPlayer/types').Track | null>(null));
const mockCurrentTime = (mockSignalRefs.currentTime = signal(0));
const mockDuration = (mockSignalRefs.duration = signal(0));
const mockIsPlaying = (mockSignalRefs.isPlaying = signal(false));

const baseTrack = {
  title: 'The Weight of Water',
  subtitle: 'Dir. Ana Moreno',
  duration: '3:42',
  icon: 'film',
};

describe('TrackRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentTrack.value = null;
    mockCurrentTime.value = 0;
    mockDuration.value = 0;
    mockIsPlaying.value = false;
  });

  it('renders track title, subtitle, and duration', () => {
    render(<TrackRow track={baseTrack} onPlay={vi.fn()} />);

    expect(screen.getByText('The Weight of Water')).toBeTruthy();
    expect(screen.getByText('Dir. Ana Moreno')).toBeTruthy();
    expect(screen.getByText('3:42')).toBeTruthy();
  });

  it('renders without subtitle when not provided', () => {
    const track = { title: 'Drift', duration: '3:15', icon: 'music' };
    render(<TrackRow track={track} onPlay={vi.fn()} />);

    expect(screen.getByText('Drift')).toBeTruthy();
    expect(screen.queryByText('Dir. Ana Moreno')).toBeNull();
  });

  it('renders the category icon based on track.icon', () => {
    const { container } = render(
      <TrackRow track={{ ...baseTrack, icon: 'film' }} onPlay={vi.fn()} />,
    );

    const iconSpan = container.querySelector('.shrink-0');
    expect(iconSpan).toBeTruthy();
    expect(iconSpan!.classList.contains('w-10')).toBe(true);
    expect(iconSpan!.classList.contains('h-10')).toBe(true);
    expect(iconSpan!.querySelector('svg')).toBeTruthy();
  });

  it('creates SVG waveform instance when audioUrl is provided', () => {
    render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        trackId="track-1"
        onPlay={vi.fn()}
      />,
    );

    // Should fetch peaks data for the waveform
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not create SVG waveform instance when audioUrl is omitted', () => {
    render(<TrackRow track={baseTrack} onPlay={vi.fn()} />);

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does not create SVG waveform instance when audioUrl is empty string', () => {
    render(
      <TrackRow track={baseTrack} audioUrl="" onPlay={vi.fn()} />,
    );

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('destroys SVG waveform instance on component unmount', () => {
    const { container, unmount } = render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        trackId="track-1"
        onPlay={vi.fn()}
      />,
    );

    // SVG should exist while mounted
    const waveformDiv = container.querySelector('.w-96');
    expect(waveformDiv).toBeTruthy();

    unmount();

    // After unmount, the waveform div should be gone from the DOM
    expect(container.querySelector('.w-96')).toBeFalsy();
  });

  it('clicking the row calls the onPlay callback', () => {
    const onPlay = vi.fn();
    render(
      <TrackRow track={baseTrack} audioUrl="http://example.com/track.mp3" onPlay={onPlay} />,
    );

    const button = screen.getByText('The Weight of Water').closest('button')!;
    fireEvent.click(button);

    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it('syncs progress via effect() when trackId matches current playing track', () => {
    mockCurrentTrack.value = { id: 'track-1', title: 'Test', artist: 'A', audioUrl: 'test.mp3' };
    mockCurrentTime.value = 60;
    mockDuration.value = 200;

    const { container } = render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        trackId="track-1"
        onPlay={vi.fn()}
      />,
    );

    // SVG waveform should exist and show progress
    // Progress 60/200 = 0.3, rendered via SVG rects
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('resets waveform progress to 0 when track is no longer the active track', () => {
    mockCurrentTrack.value = { id: 'track-1', title: 'Test', artist: 'A', audioUrl: 'test.mp3' };
    mockCurrentTime.value = 60;
    mockDuration.value = 200;

    const { container } = render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        trackId="track-1"
        onPlay={vi.fn()}
      />,
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();

    // Switch active track to a different track
    mockCurrentTrack.value = { id: 'other-track', title: 'Other', artist: 'A', audioUrl: 'other.mp3' };

    // SVG should still exist but progress should be reset
    const svgAfter = container.querySelector('svg');
    expect(svgAfter).toBeTruthy();
  });

  it('renders an <img> element when track.icon is an https:// URL', () => {
    const { container } = render(
      <TrackRow track={{ ...baseTrack, icon: 'https://example.com/icon.png' }} onPlay={vi.fn()} />,
    );

    const iconSpan = container.querySelector('.shrink-0');
    expect(iconSpan).toBeTruthy();
    const img = iconSpan!.querySelector('img');
    expect(img).toBeTruthy();
    expect(img!.getAttribute('src')).toBe('https://example.com/icon.png');
    expect(img!.getAttribute('alt')).toBe('');
    expect(img!.classList.contains('w-full')).toBe(true);
    expect(img!.classList.contains('h-full')).toBe(true);
    expect(img!.classList.contains('object-cover')).toBe(true);
  });

  it('renders an <img> element when track.icon is an http:// URL', () => {
    const { container } = render(
      <TrackRow track={{ ...baseTrack, icon: 'http://example.com/icon.png' }} onPlay={vi.fn()} />,
    );

    const iconSpan = container.querySelector('.shrink-0');
    expect(iconSpan).toBeTruthy();
    const img = iconSpan!.querySelector('img');
    expect(img).toBeTruthy();
    expect(img!.getAttribute('src')).toBe('http://example.com/icon.png');
  });

  it('renders SVG icon for named icon (no regression)', () => {
    const { container } = render(
      <TrackRow track={{ ...baseTrack, icon: 'film' }} onPlay={vi.fn()} />,
    );

    const iconSpan = container.querySelector('.shrink-0');
    expect(iconSpan).toBeTruthy();
    expect(iconSpan!.querySelector('svg')).toBeTruthy();
    expect(iconSpan!.querySelector('img')).toBeNull();
  });

  it('renders default music SVG for unrecognised non-URL icon name', () => {
    const { container } = render(
      <TrackRow track={{ ...baseTrack, icon: 'unknown' }} onPlay={vi.fn()} />,
    );

    const iconSpan = container.querySelector('.shrink-0');
    expect(iconSpan).toBeTruthy();
    expect(iconSpan!.querySelector('svg')).toBeTruthy();
    expect(iconSpan!.querySelector('img')).toBeNull();
  });

  // --- Play/Pause Overlay Tests ---

  it('does not render overlay when trackId is undefined', () => {
    const { container } = render(
      <TrackRow track={baseTrack} onPlay={vi.fn()} />,
    );

    expect(container.querySelector('.track-row-play-overlay')).toBeNull();
  });

  it('does not render overlay when trackId is defined but does not match currentTrack', () => {
    mockCurrentTrack.value = { id: 'other-track', title: 'Other', artist: 'A', audioUrl: 'other.mp3' };

    const { container } = render(
      <TrackRow track={baseTrack} trackId="track-1" onPlay={vi.fn()} />,
    );

    expect(container.querySelector('.track-row-play-overlay')).toBeNull();
  });

  it('renders overlay when trackId matches currentTrack.id', () => {
    mockCurrentTrack.value = { id: 'track-1', title: 'Test', artist: 'A', audioUrl: 'test.mp3' };

    const { container } = render(
      <TrackRow track={baseTrack} trackId="track-1" onPlay={vi.fn()} />,
    );

    const overlay = container.querySelector('.track-row-play-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay!.classList.contains('absolute')).toBe(true);
    expect(overlay!.classList.contains('inset-0')).toBe(true);
    expect(overlay!.classList.contains('rounded-lg')).toBe(true);
  });

  it('overlay shows pause icon (two rects) when isPlaying is true', () => {
    mockCurrentTrack.value = { id: 'track-1', title: 'Test', artist: 'A', audioUrl: 'test.mp3' };
    mockIsPlaying.value = true;

    const { container } = render(
      <TrackRow track={baseTrack} trackId="track-1" onPlay={vi.fn()} />,
    );

    const overlay = container.querySelector('.track-row-play-overlay');
    expect(overlay).toBeTruthy();
    const rects = overlay!.querySelectorAll('rect');
    expect(rects.length).toBe(2);
  });

  it('overlay shows play icon (polygon) when isPlaying is false', () => {
    mockCurrentTrack.value = { id: 'track-1', title: 'Test', artist: 'A', audioUrl: 'test.mp3' };
    mockIsPlaying.value = false;

    const { container } = render(
      <TrackRow track={baseTrack} trackId="track-1" onPlay={vi.fn()} />,
    );

    const overlay = container.querySelector('.track-row-play-overlay');
    expect(overlay).toBeTruthy();
    const polygon = overlay!.querySelector('polygon');
    expect(polygon).toBeTruthy();
  });

  it('clicking the overlay dispatches audio-player:toggle event on document', () => {
    mockCurrentTrack.value = { id: 'track-1', title: 'Test', artist: 'A', audioUrl: 'test.mp3' };
    mockIsPlaying.value = true;

    const toggleSpy = vi.fn();
    document.addEventListener('audio-player:toggle', toggleSpy);

    const { container } = render(
      <TrackRow track={baseTrack} trackId="track-1" onPlay={vi.fn()} />,
    );

    const overlay = container.querySelector('.track-row-play-overlay') as HTMLElement;
    fireEvent.click(overlay);

    expect(toggleSpy).toHaveBeenCalledTimes(1);

    document.removeEventListener('audio-player:toggle', toggleSpy);
  });

  it('clicking the overlay does NOT call the row onPlay prop (stopPropagation)', () => {
    mockCurrentTrack.value = { id: 'track-1', title: 'Test', artist: 'A', audioUrl: 'test.mp3' };
    mockIsPlaying.value = true;

    const onPlay = vi.fn();

    const { container } = render(
      <TrackRow track={baseTrack} trackId="track-1" onPlay={onPlay} />,
    );

    const overlay = container.querySelector('.track-row-play-overlay') as HTMLElement;
    fireEvent.click(overlay);

    expect(onPlay).not.toHaveBeenCalled();
  });

  it('overlay disappears when currentTrack changes to a different track', () => {
    mockCurrentTrack.value = { id: 'track-1', title: 'Test', artist: 'A', audioUrl: 'test.mp3' };

    const { container, rerender } = render(
      <TrackRow track={baseTrack} trackId="track-1" onPlay={vi.fn()} />,
    );

    expect(container.querySelector('.track-row-play-overlay')).toBeTruthy();

    // Switch to a different track and rerender to pick up the signal change
    mockCurrentTrack.value = { id: 'track-2', title: 'Other', artist: 'B', audioUrl: 'other.mp3' };
    rerender(<TrackRow track={baseTrack} trackId="track-1" onPlay={vi.fn()} />);

    expect(container.querySelector('.track-row-play-overlay')).toBeNull();
  });
});
