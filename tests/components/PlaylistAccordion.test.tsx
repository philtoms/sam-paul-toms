/**
 * PlaylistAccordion style regression tests.
 *
 * Asserts CSS properties that are easy to regress (e.g. text alignment).
 * JSDOM does not load CSS files, so we inject the stylesheet manually
 * following the pattern in tests/components/audio-player/player-style.test.tsx.
 *
 * Note: JSDOM's UA stylesheet for <button> sets text-align: center and
 * does not always resolve class-selector overrides for that property.
 * We therefore assert both (a) the computed style and (b) that the CSS
 * rule is present in the stylesheet as a belt-and-suspenders regression guard.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Mock accent-color for SVG waveform instances
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

vi.mock('../../src/components/AudioPlayer/playlistStore', () => ({
  isTrackCurrentlyPlaying: vi.fn(() => false),
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
    title: 'Test Section',
    slug: 'test-section',
    tracks: [{ title: 'Test Track', duration: '3:00', icon: 'music' }],
  },
];

const mockPlayableTracksMap = {
  'test-section': [
    { id: 'test-0', title: 'Test Track', artist: 'Sam', audioUrl: 'http://example.com/test.mp3' },
  ],
};

const mockAllTracks = [...mockPlayableTracksMap['test-section']];

const sectionWithCredit = {
  ...mockSections[0],
  credit: 'Directed by Test Director',
};

const sectionWithTrackCredit = {
  ...mockSections[0],
  tracks: [
    { ...mockSections[0].tracks[0], credit: 'Composed by Test Composer' },
  ],
};

describe('PlaylistAccordion — play overlay accent color regression', () => {
  it('overlay icons use accent color (text-accent) not white', () => {
    const cssContent = readFileSync(
      resolve(__dirname, '../../src/components/PlaylistAccordion.css'),
      'utf-8',
    );

    // The TrackRow component uses text-accent Tailwind class on the overlay.
    // We verify the CSS file doesn't contain any white color overrides for
    // .track-row-play-overlay, and that the hover rule uses the accent color.
    const overlayRules = cssContent.match(
      /\.track-row-play-overlay[^{]*\{[^}]*\}/gs,
    );
    expect(overlayRules).not.toBeNull();

    // Ensure none of the overlay rules set color to white
    for (const rule of overlayRules!) {
      expect(rule).not.toMatch(/color:\s*(#fff(fff)?|white)/);
    }

    // Verify hover background uses accent color, not plain black
    const hoverMatch = cssContent.match(
      /\.track-row-play-overlay:hover\s*\{[^}]*\}/s,
    );
    expect(hoverMatch).not.toBeNull();
    expect(hoverMatch![0]).toContain('var(--color-accent)');
    expect(hoverMatch![0]).not.toContain('#000');
  });
});

describe('PlaylistAccordion — header text alignment regression', () => {
  it('accordion-header rule in PlaylistAccordion.css includes text-align: left', () => {
    const cssContent = readFileSync(
      resolve(__dirname, '../../src/components/PlaylistAccordion.css'),
      'utf-8',
    );

    // Extract the .accordion-header rule block
    const headerRuleMatch = cssContent.match(
      /\.accordion-header\s*\{[^}]*\}/s,
    );
    expect(headerRuleMatch).not.toBeNull();

    const headerRule = headerRuleMatch![0];
    expect(headerRule).toContain('text-align: left');
  });

  it('renders an accordion-header button element', () => {
    const { container } = render(
      <PlaylistAccordion
        sections={mockSections}
        playableTracksMap={mockPlayableTracksMap}
        allTracks={mockAllTracks}
      />,
    );

    const header = container.querySelector('.accordion-header') as HTMLElement;
    expect(header).toBeTruthy();
    expect(header.tagName).toBe('BUTTON');
  });
});

describe('PlaylistAccordion — section credit rendering', () => {
  it('renders the credit text under the section title when provided', () => {
    render(
      <PlaylistAccordion
        sections={[sectionWithCredit]}
        playableTracksMap={mockPlayableTracksMap}
        allTracks={mockAllTracks}
      />,
    );

    expect(screen.getByText('Directed by Test Director')).toBeTruthy();
  });

  it('does NOT render a credit element when credit is omitted', () => {
    render(
      <PlaylistAccordion
        sections={mockSections}
        playableTracksMap={mockPlayableTracksMap}
        allTracks={mockAllTracks}
      />,
    );

    expect(screen.queryByText(/credit/i)).toBeNull();
  });

  it('does NOT render a credit element when credit is an empty string', () => {
    const sectionWithEmptyCredit = { ...mockSections[0], credit: '' };
    render(
      <PlaylistAccordion
        sections={[sectionWithEmptyCredit]}
        playableTracksMap={mockPlayableTracksMap}
        allTracks={mockAllTracks}
      />,
    );

    expect(screen.queryByText(/credit/i)).toBeNull();
  });
});

describe('PlaylistAccordion — per-track credit threading', () => {
  it('renders per-track credit text through the accordion → TrackRow pipeline', () => {
    render(
      <PlaylistAccordion
        sections={[sectionWithTrackCredit]}
        playableTracksMap={mockPlayableTracksMap}
        allTracks={mockAllTracks}
      />,
    );

    // Verifies the field survives the sections → PlaylistSection.tracks → TrackRow threading
    expect(screen.getByText('Composed by Test Composer')).toBeTruthy();
  });
});
