/**
 * PlaylistAccordion component tests.
 *
 * Tests the interactive accordion behavior: section toggling,
 * track rendering, and audio-player:play event dispatch.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';

// Mock wavesurfer.js — TrackRow's MiniWaveform creates WaveSurfer instances
const { mockCreate, sharedMockInstance } = vi.hoisted(() => {
  const instance = {
    setVolume: vi.fn(),
    load: vi.fn(),
    destroy: vi.fn(),
    getDuration: vi.fn(() => 200),
    seekTo: vi.fn(),
    on: vi.fn(() => vi.fn()),
  };
  return {
    mockCreate: vi.fn(() => instance),
    sharedMockInstance: instance,
  };
});

// Mock isTrackCurrentlyPlaying — controlled per test
const { mockIsTrackCurrentlyPlaying } = vi.hoisted(() => ({
  mockIsTrackCurrentlyPlaying: vi.fn(() => false),
}));

vi.mock('wavesurfer.js', () => ({
  default: {
    create: mockCreate,
  },
}));

vi.mock('../../src/components/AudioPlayer/playlistStore', () => ({
  isTrackCurrentlyPlaying: mockIsTrackCurrentlyPlaying,
  currentTrack: { value: null, peek: () => null },
  currentTime: { value: 0 },
  duration: { value: 0 },
}));

vi.mock('../../src/scripts/audio-player-events', () => ({
  seekPlayer: vi.fn(),
}));

import PlaylistAccordion from '../../src/components/PlaylistAccordion';

const mockSections = [
  {
    title: 'Documentary',
    slug: 'documentary',
    description: 'Original scores for documentary film.',
    tracks: [
      { title: 'The Weight of Water', subtitle: 'Dir. Ana Moreno', duration: '3:42', icon: 'film' },
      { title: 'Beneath the Ice', duration: '4:18', icon: 'film' },
      { title: 'Unbroken', duration: '5:01', icon: 'music' },
    ],
  },
  {
    title: 'Film',
    slug: 'film',
    description: 'Scores for feature films.',
    tracks: [
      { title: 'The Crossing', subtitle: 'Dir. Léa Dupont', duration: '4:35', icon: 'film' },
      { title: 'Paper Towns', duration: '3:28', icon: 'film' },
    ],
  },
  {
    title: 'Library',
    slug: 'library',
    tracks: [
      { title: 'Drift', duration: '3:15', icon: 'music' },
    ],
  },
  {
    title: 'Trailers, Themes & Idents',
    slug: 'trailers-themes-idents',
    tracks: [
      { title: 'Horizon', duration: '2:30', icon: 'tv' },
      { title: 'Pulse', subtitle: 'Cannes 2025', duration: '1:45', icon: 'trailer' },
    ],
  },
];

const mockPlayableTracksMap: Record<string, Array<{
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
}>> = {
  documentary: [
    { id: 'doc-0', title: 'The Weight of Water', artist: 'Sam', audioUrl: 'http://example.com/doc-0.mp3' },
    { id: 'doc-1', title: 'Beneath the Ice', artist: 'Sam', audioUrl: 'http://example.com/doc-1.mp3' },
    { id: 'doc-2', title: 'Unbroken', artist: 'Sam', audioUrl: 'http://example.com/doc-2.mp3' },
  ],
  film: [
    { id: 'film-0', title: 'The Crossing', artist: 'Sam', audioUrl: 'http://example.com/film-0.mp3' },
    { id: 'film-1', title: 'Paper Towns', artist: 'Sam', audioUrl: 'http://example.com/film-1.mp3' },
  ],
  library: [
    { id: 'lib-0', title: 'Drift', artist: 'Sam', audioUrl: 'http://example.com/lib-0.mp3' },
  ],
  'trailers-themes-idents': [
    { id: 'trailer-0', title: 'Horizon', artist: 'Sam', audioUrl: 'http://example.com/trailer-0.mp3' },
    { id: 'trailer-1', title: 'Pulse', artist: 'Sam', audioUrl: 'http://example.com/trailer-1.mp3' },
  ],
};

// Full track list across all sections in order (for cross-section next/prev)
const mockAllTracks = [
  ...mockPlayableTracksMap.documentary,
  ...mockPlayableTracksMap.film,
  ...mockPlayableTracksMap.library,
  ...mockPlayableTracksMap['trailers-themes-idents'],
];

describe('PlaylistAccordion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all 4 section titles', () => {
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />);

    expect(screen.getByText('Documentary')).toBeTruthy();
    expect(screen.getByText('Film')).toBeTruthy();
    expect(screen.getByText('Library')).toBeTruthy();
    expect(screen.getByText('Trailers, Themes & Idents')).toBeTruthy();
  });

  it('all sections are expanded by default', () => {
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />);

    // All section tracks should be visible
    // Documentary
    expect(screen.getByText('The Weight of Water')).toBeTruthy();
    expect(screen.getByText('Beneath the Ice')).toBeTruthy();
    expect(screen.getByText('Unbroken')).toBeTruthy();
    // Film
    expect(screen.getByText('The Crossing')).toBeTruthy();
    expect(screen.getByText('Paper Towns')).toBeTruthy();
    // Library
    expect(screen.getByText('Drift')).toBeTruthy();
    // Trailers
    expect(screen.getByText('Horizon')).toBeTruthy();
    expect(screen.getByText('Pulse')).toBeTruthy();
  });

  it('clicking an open section header collapses it without affecting others', () => {
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />);

    // All sections open by default — click Documentary to close it
    const docHeader = screen.getByText('Documentary').closest('button')!;
    fireEvent.click(docHeader);

    // Film, Library, Trailers should remain open
    expect(screen.getByText('The Crossing')).toBeTruthy();
    expect(screen.getByText('Drift')).toBeTruthy();
    expect(screen.getByText('Horizon')).toBeTruthy();
  });

  it('track rows render title, subtitle, and duration', () => {
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />);

    expect(screen.getByText('The Weight of Water')).toBeTruthy();
    expect(screen.getByText('Dir. Ana Moreno')).toBeTruthy();
    expect(screen.getByText('3:42')).toBeTruthy();
  });

  it('clicking a track row dispatches audio-player:play event with all tracks and correct global index', () => {
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />);

    const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

    // Click "Beneath the Ice" (index 1 in Documentary section → global index 1)
    const trackButton = screen.getByText('Beneath the Ice').closest('button')!;
    fireEvent.click(trackButton);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe('audio-player:play');
    expect(event.detail.tracks).toEqual(mockAllTracks);
    expect(event.detail.startIndex).toBe(1);

    dispatchSpy.mockRestore();
  });

  it('multiple sections can be open simultaneously', () => {
    const { container } = render(
      <PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />,
    );

    // Initially, all 4 sections are open
    const openSections = container.querySelectorAll('.accordion-content--open');
    expect(openSections.length).toBe(4);

    // Click Documentary header to close it
    const docHeader = screen.getByText('Documentary').closest('button')!;
    fireEvent.click(docHeader);

    // 3 remain open
    const openSectionsAfterClick = container.querySelectorAll('.accordion-content--open');
    expect(openSectionsAfterClick.length).toBe(3);
  });

  it('clicking an open section header collapses it', () => {
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />);

    // Documentary is open by default; click to close
    const docHeader = screen.getByText('Documentary').closest('button')!;
    fireEvent.click(docHeader);

    // Click Film to close it too (it's already open by default)
    const filmHeader = screen.getByText('Film').closest('button')!;
    fireEvent.click(filmHeader);

    // Library and Trailers should still be open
    expect(screen.getByText('Drift')).toBeTruthy();
    expect(screen.getByText('Horizon')).toBeTruthy();
  });

  it('playlist-accordion has no background, border, or border-radius inline styles', () => {
    const { container } = render(
      <PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />,
    );

    const accordion = container.querySelector('.playlist-accordion') as HTMLElement;
    expect(accordion).toBeTruthy();

    const style = accordion.style;
    // These CSS properties should NOT be set as inline styles on the element
    expect(style.backgroundColor).toBe('');
    expect(style.border).toBe('');
    expect(style.borderRadius).toBe('');
  });

  it('renders chevron SVG before the title text in DOM order', () => {
    const { container } = render(
      <PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />,
    );

    const header = container.querySelector('.accordion-header')!;
    const firstChild = header.firstElementChild;
    expect(firstChild?.tagName).toBe('svg');
    expect(firstChild?.classList.contains('accordion-chevron')).toBe(true);
  });

  it('applies rotate-90 class to chevron when section is open and no rotation when closed', () => {
    const { container } = render(
      <PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />,
    );

    const headers = container.querySelectorAll('.accordion-header');

    // All sections are open by default — ALL chevrons should have rotate-90
    for (let i = 0; i < headers.length; i++) {
      const chevron = headers[i].querySelector('.accordion-chevron')!;
      expect(chevron.classList.contains('rotate-90')).toBe(true);
    }

    // Click Documentary section to close it
    fireEvent.click(headers[0]);

    // Documentary chevron should no longer have rotate-90
    const docChevron = container.querySelectorAll('.accordion-header')[0].querySelector('.accordion-chevron')!;
    expect(docChevron.classList.contains('rotate-90')).toBe(false);

    // Film chevron should still have rotate-90
    const filmChevron = container.querySelectorAll('.accordion-header')[1].querySelector('.accordion-chevron')!;
    expect(filmChevron.classList.contains('rotate-90')).toBe(true);
  });

  it('passes correct audio URLs from playableTracksMap to track row waveforms', () => {
    render(
      <PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />,
    );

    // All tracks across all sections are rendered in the DOM (closed sections
    // use CSS overflow:hidden), so 8 WaveSurfer instances are created total
    expect(mockCreate).toHaveBeenCalledTimes(8);

    // Verify the loaded audio URLs match the playableTracksMap order
    expect(sharedMockInstance.load).toHaveBeenCalledTimes(8);
    expect(sharedMockInstance.load.mock.calls[0][0]).toBe('http://example.com/doc-0.mp3');
    expect(sharedMockInstance.load.mock.calls[1][0]).toBe('http://example.com/doc-1.mp3');
    expect(sharedMockInstance.load.mock.calls[2][0]).toBe('http://example.com/doc-2.mp3');
    expect(sharedMockInstance.load.mock.calls[3][0]).toBe('http://example.com/film-0.mp3');
    expect(sharedMockInstance.load.mock.calls[4][0]).toBe('http://example.com/film-1.mp3');
    expect(sharedMockInstance.load.mock.calls[5][0]).toBe('http://example.com/lib-0.mp3');
    expect(sharedMockInstance.load.mock.calls[6][0]).toBe('http://example.com/trailer-0.mp3');
    expect(sharedMockInstance.load.mock.calls[7][0]).toBe('http://example.com/trailer-1.mp3');
  });

  it('clicking first track of first section dispatches with startIndex 0 and all tracks', () => {
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />);

    const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

    // Click "The Weight of Water" (index 0 in Documentary, global index 0)
    const trackButton = screen.getByText('The Weight of Water').closest('button')!;
    fireEvent.click(trackButton);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe('audio-player:play');
    expect(event.detail.tracks).toEqual(mockAllTracks);
    expect(event.detail.startIndex).toBe(0);

    dispatchSpy.mockRestore();
  });

  it('clicking a track in a later section dispatches with correct global startIndex', () => {
    // Open Trailers section first
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />);

    const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

    // Click "Horizon" (index 0 in trailers-themes-idents, global index 6)
    // doc(3) + film(2) + library(1) = 6 preceding tracks
    const trailerHeader = screen.getByText('Trailers, Themes & Idents').closest('button')!;
    fireEvent.click(trailerHeader);

    const trackButton = screen.getByText('Horizon').closest('button')!;
    fireEvent.click(trackButton);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe('audio-player:play');
    expect(event.detail.tracks).toEqual(mockAllTracks);
    expect(event.detail.startIndex).toBe(6);

    dispatchSpy.mockRestore();
  });


  describe('no-op guard for currently-playing track', () => {
    it('does NOT dispatch audio-player:play when clicked track is already playing', () => {
      // Simulate: "The Weight of Water" (doc-0) is currently playing
      mockIsTrackCurrentlyPlaying.mockImplementation((id: string) => id === 'doc-0');

      render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />);

      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

      // Click "The Weight of Water" (index 0 in Documentary section, global index 0)
      const trackButton = screen.getByText('The Weight of Water').closest('button')!;
      fireEvent.click(trackButton);

      // No event should be dispatched — the track is already playing
      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(mockIsTrackCurrentlyPlaying).toHaveBeenCalledWith('doc-0');

      dispatchSpy.mockRestore();
    });

    it('dispatches audio-player:play when a different track is clicked', () => {
      // Simulate: "The Weight of Water" (doc-0) is currently playing
      mockIsTrackCurrentlyPlaying.mockImplementation((id: string) => id === 'doc-0');

      render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />);

      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

      // Click "Beneath the Ice" (index 1 in Documentary section, global index 1) — different track
      const trackButton = screen.getByText('Beneath the Ice').closest('button')!;
      fireEvent.click(trackButton);

      // Event SHOULD be dispatched — different track
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('audio-player:play');
      expect(event.detail.tracks).toEqual(mockAllTracks);
      expect(event.detail.startIndex).toBe(1);

      dispatchSpy.mockRestore();
    });

    it('dispatches audio-player:play when same track is paused (not playing)', () => {
      // Simulate: no track is currently playing (all return false)
      mockIsTrackCurrentlyPlaying.mockReturnValue(false);

      render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} allTracks={mockAllTracks} />);

      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

      // Click "The Weight of Water" — same track but it's paused
      const trackButton = screen.getByText('The Weight of Water').closest('button')!;
      fireEvent.click(trackButton);

      // Event SHOULD be dispatched — track is not playing
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('audio-player:play');
      expect(event.detail.tracks).toEqual(mockAllTracks);
      expect(event.detail.startIndex).toBe(0);

      dispatchSpy.mockRestore();
    });
  });
});
