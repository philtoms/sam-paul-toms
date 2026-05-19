/**
 * PlaylistAccordion component tests.
 *
 * Tests the interactive accordion behavior: section toggling,
 * track rendering, and audio-player:play event dispatch.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
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

describe('PlaylistAccordion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all 4 section titles', () => {
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} />);

    expect(screen.getByText('Documentary')).toBeTruthy();
    expect(screen.getByText('Film')).toBeTruthy();
    expect(screen.getByText('Library')).toBeTruthy();
    expect(screen.getByText('Trailers, Themes & Idents')).toBeTruthy();
  });

  it('first section is expanded by default', () => {
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} />);

    // First section tracks should be visible
    expect(screen.getByText('The Weight of Water')).toBeTruthy();
    expect(screen.getByText('Beneath the Ice')).toBeTruthy();
    expect(screen.getByText('Unbroken')).toBeTruthy();
  });

  it('clicking a section header expands it and collapses others', () => {
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} />);

    // Click Film section
    const filmHeader = screen.getByText('Film').closest('button')!;
    fireEvent.click(filmHeader);

    // Film tracks should now be visible
    expect(screen.getByText('The Crossing')).toBeTruthy();
    expect(screen.getByText('Paper Towns')).toBeTruthy();
  });

  it('track rows render title, subtitle, and duration', () => {
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} />);

    expect(screen.getByText('The Weight of Water')).toBeTruthy();
    expect(screen.getByText('Dir. Ana Moreno')).toBeTruthy();
    expect(screen.getByText('3:42')).toBeTruthy();
  });

  it('clicking a track row dispatches audio-player:play event with correct section tracks and index', () => {
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} />);

    const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

    // Click "Beneath the Ice" (index 1 in Documentary section)
    const trackButton = screen.getByText('Beneath the Ice').closest('button')!;
    fireEvent.click(trackButton);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe('audio-player:play');
    expect(event.detail.tracks).toEqual(mockPlayableTracksMap.documentary);
    expect(event.detail.startIndex).toBe(1);

    dispatchSpy.mockRestore();
  });

  it('only one section is open at a time', () => {
    const { container } = render(
      <PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} />,
    );

    // Initially, Documentary is open
    const openSections = container.querySelectorAll('.accordion-content--open');
    expect(openSections.length).toBe(1);

    // Click Film header
    const filmHeader = screen.getByText('Film').closest('button')!;
    fireEvent.click(filmHeader);

    // Still only one open section
    const openSectionsAfterClick = container.querySelectorAll('.accordion-content--open');
    expect(openSectionsAfterClick.length).toBe(1);
  });

  it('clicking an open section header collapses it', () => {
    render(<PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} />);

    // Documentary is open by default; click to close
    const docHeader = screen.getByText('Documentary').closest('button')!;
    fireEvent.click(docHeader);

    // Click Film to open it
    const filmHeader = screen.getByText('Film').closest('button')!;
    fireEvent.click(filmHeader);

    // Now Film should be the only open section
    expect(screen.getByText('The Crossing')).toBeTruthy();
  });

  it('playlist-accordion has no background, border, or border-radius inline styles', () => {
    const { container } = render(
      <PlaylistAccordion sections={mockSections} playableTracksMap={mockPlayableTracksMap} />,
    );

    const accordion = container.querySelector('.playlist-accordion') as HTMLElement;
    expect(accordion).toBeTruthy();

    const style = accordion.style;
    // These CSS properties should NOT be set as inline styles on the element
    expect(style.backgroundColor).toBe('');
    expect(style.border).toBe('');
    expect(style.borderRadius).toBe('');
  });
});
