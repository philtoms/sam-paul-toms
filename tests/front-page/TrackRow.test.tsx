/**
 * TrackRow component tests.
 *
 * Tests track row rendering: title, subtitle, duration, category icon,
 * waveform creation via wavesurfer.js, and cleanup on unmount.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';

// Hoisted mock definitions (vi.mock factories are hoisted above imports)
const { mockCreate, mockWsInstance } = vi.hoisted(() => {
  const instance = {
    setVolume: vi.fn(),
    load: vi.fn(),
    destroy: vi.fn(),
  };
  return {
    mockCreate: vi.fn(() => instance),
    mockWsInstance: instance,
  };
});

vi.mock('wavesurfer.js', () => ({
  default: {
    create: mockCreate,
  },
}));

import TrackRow from '../../src/components/TrackRow';

const baseTrack = {
  title: 'The Weight of Water',
  subtitle: 'Dir. Ana Moreno',
  duration: '3:42',
  icon: 'film',
};

describe('TrackRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    // The icon container should contain an SVG element
    const iconSpan = container.querySelector('.shrink-0');
    expect(iconSpan).toBeTruthy();
    expect(iconSpan!.querySelector('svg')).toBeTruthy();
  });

  it('creates WaveSurfer instance with compact options when audioUrl is provided', () => {
    render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        onPlay={vi.fn()}
      />,
    );

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        height: 24,
        waveColor: '#6b7280',
        progressColor: '#8b5cf6',
        barWidth: 2,
        barGap: 1,
        barRadius: 1,
        fillParent: true,
        interact: false,
      }),
    );
    expect(mockWsInstance.setVolume).toHaveBeenCalledWith(0);
    expect(mockWsInstance.load).toHaveBeenCalledWith('http://example.com/track.mp3');
  });

  it('does not create WaveSurfer instance when audioUrl is omitted', () => {
    render(<TrackRow track={baseTrack} onPlay={vi.fn()} />);

    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('does not create WaveSurfer instance when audioUrl is empty string', () => {
    render(
      <TrackRow track={baseTrack} audioUrl="" onPlay={vi.fn()} />,
    );

    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('destroys WaveSurfer instance on component unmount', () => {
    const { unmount } = render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        onPlay={vi.fn()}
      />,
    );

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockWsInstance.destroy).not.toHaveBeenCalled();

    unmount();

    expect(mockWsInstance.destroy).toHaveBeenCalledTimes(1);
  });

  it('waveform container has w-48 class (not w-24)', () => {
    const { container } = render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        onPlay={vi.fn()}
      />,
    );

    // Find the waveform container div (rendered by MiniWaveform)
    const waveformDiv = container.querySelector('[class*="w-48"]');
    expect(waveformDiv).toBeTruthy();
    expect(waveformDiv!.classList.contains('w-48')).toBe(true);
    expect(waveformDiv!.classList.contains('w-24')).toBe(false);
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
});
