/**
 * TrackRow component tests.
 *
 * Tests track row rendering: title, subtitle, duration, category icon,
 * waveform creation via wavesurfer.js (interactive mode with progressColor),
 * interaction handler dispatching seek events, progress sync via effect(),
 * and cleanup on unmount.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';

// Hoisted mock definitions (vi.mock factories are hoisted above imports)
const { mockCreate, mockWsInstance } = vi.hoisted(() => {
  // Track registered event handlers by event name
  const eventHandlers: Record<string, (...args: any[]) => void> = {};
  const instance = {
    setVolume: vi.fn(),
    load: vi.fn(),
    destroy: vi.fn(),
    getDuration: vi.fn(() => 200),
    seekTo: vi.fn(),
    on: vi.fn((eventName: string, handler: (...args: any[]) => void) => {
      eventHandlers[eventName] = handler;
      // Return an unsubscribe function (wavesurfer v7 convention)
      return () => {
        delete eventHandlers[eventName];
      };
    }),
    _getEventHandlers: () => eventHandlers,
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

// Mock playlistStore signals — use wrapper objects so real signals can be
// initialized after the @preact/signals import resolves.
// vi.hoisted runs before imports, so signal() is unavailable there.
const { mockSignalRefs } = vi.hoisted(() => ({
  mockSignalRefs: {
    currentTrack: null as any,
    currentTime: null as any,
    duration: null as any,
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
}));

// Mock audio-player-events
const { mockSeekPlayer } = vi.hoisted(() => ({
  mockSeekPlayer: vi.fn(),
}));

vi.mock('../../src/scripts/audio-player-events', () => ({
  seekPlayer: mockSeekPlayer,
}));

import TrackRow from '../../src/components/TrackRow';

// Initialize real Preact signals (after imports so signal() is available).
// The mock getters above delegate to these via the wrapper object.
import { signal } from '@preact/signals';

const mockCurrentTrack = (mockSignalRefs.currentTrack = signal<any>(null));
const mockCurrentTime = (mockSignalRefs.currentTime = signal(0));
const mockDuration = (mockSignalRefs.duration = signal(0));

const baseTrack = {
  title: 'The Weight of Water',
  subtitle: 'Dir. Ana Moreno',
  duration: '3:42',
  icon: 'film',
};

describe('TrackRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the event handlers tracked on the mock instance
    const handlers = (mockWsInstance as any)._getEventHandlers();
    for (const key of Object.keys(handlers)) {
      delete handlers[key];
    }
    mockCurrentTrack.value = null;
    mockCurrentTime.value = 0;
    mockDuration.value = 0;
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

  it('creates WaveSurfer instance with interactive options when audioUrl is provided', () => {
    render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        trackId="track-1"
        onPlay={vi.fn()}
      />,
    );

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        height: 24,
        waveColor: '#6b7280',
        progressColor: '#eab308',
        barWidth: 2,
        barGap: 1,
        barRadius: 1,
        fillParent: true,
        interact: true,
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

  it('registers interaction handler when trackId is provided', () => {
    render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        trackId="track-1"
        onPlay={vi.fn()}
      />,
    );

    expect(mockWsInstance.on).toHaveBeenCalledWith(
      'interaction',
      expect.any(Function),
    );
  });

  it('does not register interaction handler when trackId is omitted', () => {
    render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        onPlay={vi.fn()}
      />,
    );

    expect(mockWsInstance.on).not.toHaveBeenCalledWith(
      'interaction',
      expect.any(Function),
    );
  });

  it('interaction handler dispatches seek when currentTrack matches trackId', () => {
    mockCurrentTrack.value = { id: 'track-1', title: 'Test', artist: 'Artist', audioUrl: 'test.mp3' };

    render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        trackId="track-1"
        onPlay={vi.fn()}
      />,
    );

    // Get the registered interaction handler
    const handlers = (mockWsInstance as any)._getEventHandlers();
    const interactionHandler = handlers['interaction'];
    expect(interactionHandler).toBeDefined();

    // Simulate wavesurfer interaction at 100 seconds out of 200 duration
    interactionHandler(100);

    expect(mockSeekPlayer).toHaveBeenCalledWith('track-1', 0.5);
  });

  it('interaction handler does NOT dispatch seek when currentTrack does not match', () => {
    mockCurrentTrack.value = { id: 'other-track', title: 'Other', artist: 'Artist', audioUrl: 'other.mp3' };

    render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        trackId="track-1"
        onPlay={vi.fn()}
      />,
    );

    const handlers = (mockWsInstance as any)._getEventHandlers();
    const interactionHandler = handlers['interaction'];
    expect(interactionHandler).toBeDefined();

    interactionHandler(100);

    expect(mockSeekPlayer).not.toHaveBeenCalled();
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

    render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        trackId="track-1"
        onPlay={vi.fn()}
      />,
    );

    // effect() runs synchronously on creation; with matching track and dur > 0,
    // it should call seekTo(60/200) = seekTo(0.3)
    expect(mockWsInstance.seekTo).toHaveBeenCalledWith(0.3);
  });

  it('resets seekTo to 0 via effect() when trackId does not match current track', () => {
    mockCurrentTrack.value = { id: 'other-track', title: 'Other', artist: 'A', audioUrl: 'other.mp3' };
    mockCurrentTime.value = 60;
    mockDuration.value = 200;

    render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        trackId="track-1"
        onPlay={vi.fn()}
      />,
    );

    // After fix: effect resets progress to 0 when track is not active
    expect(mockWsInstance.seekTo).toHaveBeenCalledWith(0);
  });

  it('clamps seekTo fraction via effect() when currentTime exceeds duration', () => {
    mockCurrentTrack.value = { id: 'track-1', title: 'Test', artist: 'A', audioUrl: 'test.mp3' };
    mockCurrentTime.value = 300;
    mockDuration.value = 200;

    render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        trackId="track-1"
        onPlay={vi.fn()}
      />,
    );

    // 300/200 = 1.5, clamped to 1
    expect(mockWsInstance.seekTo).toHaveBeenCalledWith(1);
  });

  it('resets waveform progress to 0 when track is no longer the active track', () => {
    mockCurrentTrack.value = { id: 'track-1', title: 'Test', artist: 'A', audioUrl: 'test.mp3' };
    mockCurrentTime.value = 60;
    mockDuration.value = 200;

    render(
      <TrackRow
        track={baseTrack}
        audioUrl="http://example.com/track.mp3"
        trackId="track-1"
        onPlay={vi.fn()}
      />,
    );

    // Initially track-1 is active — progress synced to 60/200 = 0.3
    expect(mockWsInstance.seekTo).toHaveBeenCalledWith(0.3);
    mockWsInstance.seekTo.mockClear();

    // Switch active track to a different track — effect should re-run
    mockCurrentTrack.value = { id: 'other-track', title: 'Other', artist: 'A', audioUrl: 'other.mp3' };

    // Progress should be reset to 0
    expect(mockWsInstance.seekTo).toHaveBeenCalledWith(0);
  });
});
