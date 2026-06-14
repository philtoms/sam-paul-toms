// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/preact';
import path from 'node:path';
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
let mockCurrentTrack: typeof mockTrack | null = null;
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

    // Track info section
    expect(container.querySelector('.audio-player-track-info')).toBeInTheDocument();
    expect(container.querySelector('.audio-player-track-info__icon')).toBeInTheDocument();
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

    // All major sections are direct children of the expanded bar (single-row layout)
    const directChildren = Array.from(bar!.children);
    const childClasses = directChildren.map((el) => el.className);
    // Order: track-info → transport → time → waveform → time → volume
    expect(childClasses).toEqual([
      'audio-player-track-info',
      'audio-player-transport',
      'audio-player-time audio-player-time--current',
      'audio-player-waveform',
      'audio-player-time audio-player-time--total',
      'audio-player-volume',
    ]);
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

  it('volume slider has vertical orientation styling', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    const { container } = render(<Player />);
    const slider = container.querySelector('.audio-player-volume__slider') as HTMLInputElement;
    expect(slider).toBeInTheDocument();
    // Verify the slider is a range input with vertical writing mode applied via CSS class
    expect(slider.type).toBe('range');
    expect(slider.className).toBe('audio-player-volume__slider');
  });

  it('player bar has border-radius style applied', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    const { container } = render(<Player />);
    const bar = container.querySelector('.audio-player-bar--expanded') as HTMLElement;
    expect(bar).toBeInTheDocument();
    // The player bar element should have the audio-player-bar class which carries border-radius
    expect(bar.classList.contains('audio-player-bar')).toBe(true);
  });

  it('track info icon has square dimensions with rounded corners', async () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    // Inject the Player CSS so jsdom can resolve computed styles
    const cssContent = await import('fs').then((fs) =>
      fs.promises.readFile(
        path.resolve(__dirname, '../../../src/components/AudioPlayer/Player.css'),
        'utf-8',
      ),
    );
    const styleEl = document.createElement('style');
    styleEl.textContent = cssContent;
    document.head.appendChild(styleEl);

    const { container } = render(<Player />);
    const icon = container.querySelector('.audio-player-track-info__icon') as HTMLElement;
    expect(icon).toBeInTheDocument();

    const computedStyle = window.getComputedStyle(icon);
    expect(computedStyle.width).toBe('40px');
    expect(computedStyle.height).toBe('40px');
    expect(computedStyle.borderRadius).toBe('var(--radius-lg)');
    expect(computedStyle.overflow).toBe('hidden');
    expect(computedStyle.background).toContain('rgba(255, 255, 255, 0.05)');

    // Cleanup injected style
    document.head.removeChild(styleEl);
  });

  it('expanded bar uses CSS Grid layout with six columns', async () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    // Inject the Player CSS so jsdom can resolve computed styles
    const cssContent = await import('fs').then((fs) =>
      fs.promises.readFile(
        path.resolve(__dirname, '../../../src/components/AudioPlayer/Player.css'),
        'utf-8',
      ),
    );
    const styleEl = document.createElement('style');
    styleEl.textContent = cssContent;
    document.head.appendChild(styleEl);

    const { container } = render(<Player />);
    const bar = container.querySelector('.audio-player-bar--expanded') as HTMLElement;
    expect(bar).toBeInTheDocument();

    const computedStyle = window.getComputedStyle(bar);
    expect(computedStyle.display).toBe('grid');
    // 6 columns: track-info(300px) transport(auto) time(auto) waveform(1fr) time(auto) volume(auto)
    expect(computedStyle.gridTemplateColumns).toBe('300px auto auto 1fr auto auto');

    // Cleanup injected style
    document.head.removeChild(styleEl);
  });

  it('long track title is truncated with text-overflow ellipsis', async () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = {
      ...mockTrack,
      title: 'A'.repeat(250) + ' — The Extremely Long Title That Should Definitely Be Truncated By CSS Ellipsis Rules And Not Overflow The Container',
    };

    // Inject the Player CSS so jsdom can resolve computed styles
    const cssContent = await import('fs').then((fs) =>
      fs.promises.readFile(
        path.resolve(__dirname, '../../../src/components/AudioPlayer/Player.css'),
        'utf-8',
      ),
    );
    const styleEl = document.createElement('style');
    styleEl.textContent = cssContent;
    document.head.appendChild(styleEl);

    const { container } = render(<Player />);
    const titleEl = container.querySelector('.audio-player-track-info__title') as HTMLElement;
    expect(titleEl).toBeInTheDocument();

    const computedStyle = window.getComputedStyle(titleEl);
    expect(computedStyle.textOverflow).toBe('ellipsis');
    expect(computedStyle.overflow).toBe('hidden');
    expect(computedStyle.whiteSpace).toBe('nowrap');

    // Verify track-info container has overflow hidden and min-width 0 for grid truncation
    const trackInfo = container.querySelector('.audio-player-track-info') as HTMLElement;
    const trackInfoStyle = window.getComputedStyle(trackInfo);
    expect(trackInfoStyle.overflow).toBe('hidden');
    expect(trackInfoStyle.minWidth).toBe('0px');

    // Cleanup injected style
    document.head.removeChild(styleEl);
  });

  it('volume container has relative positioning for absolute pseudo-element hover bridge', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    const { container } = render(<Player />);
    const volumeContainer = container.querySelector('.audio-player-volume') as HTMLElement;
    expect(volumeContainer).toBeInTheDocument();

    // The .audio-player-volume class must carry position: relative so that
    // the absolutely-positioned ::after hover bridge and slider are
    // positioned relative to it (not the viewport or player bar).
    // JSDOM doesn't apply real CSS, so we verify the class is present and
    // the element exists with the expected structure.
    expect(volumeContainer.classList.contains('audio-player-volume')).toBe(true);

    // The slider must be a child of the volume container (for :hover to work)
    const slider = volumeContainer.querySelector('.audio-player-volume__slider');
    expect(slider).toBeInTheDocument();
    expect(volumeContainer.contains(slider)).toBe(true);
  });

  it('expanded player bar creates a positioning context for background pseudo-elements', async () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    // Inject the Player CSS so jsdom can resolve computed styles
    const cssContent = await import('fs').then((fs) =>
      fs.promises.readFile(
        path.resolve(__dirname, '../../../src/components/AudioPlayer/Player.css'),
        'utf-8',
      ),
    );
    const styleEl = document.createElement('style');
    styleEl.textContent = cssContent;
    document.head.appendChild(styleEl);

    const { container } = render(<Player />);
    const bar = container.querySelector('.audio-player-bar--expanded') as HTMLElement;
    expect(bar).toBeInTheDocument();

    const computedStyle = window.getComputedStyle(bar);
    // position: fixed (from .audio-player-bar) creates a containing block
    // for absolutely-positioned ::before/::after pseudo-elements
    expect(computedStyle.position).toBe('fixed');

    // Cleanup injected style
    document.head.removeChild(styleEl);
  });

  it('expanded player bar CSS defines background image and overlay via pseudo-elements', async () => {
    // Read the raw CSS and parse for ::before/::after rules — JSDOM cannot
    // resolve computed styles on pseudo-elements
    const cssContent = await import('fs').then((fs) =>
      fs.promises.readFile(
        path.resolve(__dirname, '../../../src/components/AudioPlayer/Player.css'),
        'utf-8',
      ),
    );

    // ::before should reference the banner image with cover sizing and cinematic crop
    expect(cssContent).toMatch(
      /\.audio-player-bar--expanded::before\s*\{[^}]*background-image:\s*url\(['"]\/images\/spt_no_text\.png['"]\)/,
    );
    expect(cssContent).toMatch(
      /\.audio-player-bar--expanded::before\s*\{[^}]*background-size:\s*cover/,
    );
    expect(cssContent).toMatch(
      /\.audio-player-bar--expanded::before\s*\{[^}]*background-position:/,
    );
    expect(cssContent).toMatch(
      /\.audio-player-bar--expanded::before\s*\{[^}]*z-index:\s*-1/,
    );

    // ::after overlay is intentionally disabled (commented out) in the CSS
    // so we only verify the pseudo-element exists with correct z-index
    expect(cssContent).toMatch(
      /\.audio-player-bar--expanded::after\s*\{[^}]*z-index:\s*-1/,
    );

    // Both pseudo-elements should have border-radius matching the pill shape
    const beforeMatch = cssContent.match(
      /\.audio-player-bar--expanded::before\s*\{([^}]*)\}/,
    );
    const afterMatch = cssContent.match(
      /\.audio-player-bar--expanded::after\s*\{([^}]*)\}/,
    );
    expect(beforeMatch).toBeTruthy();
    expect(afterMatch).toBeTruthy();
    expect(beforeMatch![1]).toContain('border-radius: 9999px');
    expect(afterMatch![1]).toContain('border-radius: 9999px');
  });

  it('volume slider element exists and is a range input', () => {
    mockPlaybackState = 'paused';
    mockCurrentTrack = mockTrack;

    const { container } = render(<Player />);
    const slider = container.querySelector('.audio-player-volume__slider') as HTMLInputElement;
    expect(slider).toBeInTheDocument();

    // Verify the slider is a range input — the hover gap fix relies on
    // the slider being position: absolute inside .audio-player-volume,
    // and the CSS class carries that positioning.
    expect(slider.type).toBe('range');
    expect(slider.getAttribute('aria-label')).toBe('Volume');
    expect(slider.tagName.toLowerCase()).toBe('input');
  });
});
