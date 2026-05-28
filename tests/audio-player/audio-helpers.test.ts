import { describe, it, expect, vi } from 'vitest';
import {
  getR2PublicUrl,
  resolveAudioUrl,
  buildTrackFromContent,
  getWaveformPeaksUrl,
} from '../../src/scripts/audio-helpers';
import type { Track } from '../../src/components/AudioPlayer/types';

const DEFAULT_R2_URL = 'http://localhost:4321/r2';

function withEnv(url: string, fn: () => void) {
  vi.stubEnv('R2_PUBLIC_URL', url);
  try {
    fn();
  } finally {
    vi.unstubAllEnvs();
  }
}

function withoutEnv(fn: () => void) {
  vi.stubEnv('R2_PUBLIC_URL', undefined);
  try {
    fn();
  } finally {
    vi.unstubAllEnvs();
  }
}

describe('audio-helpers', () => {
  describe('getR2PublicUrl', () => {
    it('returns the R2_PUBLIC_URL from environment when set', () => {
      withEnv('https://pub-abc123.r2.dev', () => {
        expect(getR2PublicUrl()).toBe('https://pub-abc123.r2.dev');
      });
    });

    it('falls back to localhost when R2_PUBLIC_URL is not set', () => {
      withoutEnv(() => {
        expect(getR2PublicUrl()).toBe(DEFAULT_R2_URL);
      });
    });
  });

  describe('resolveAudioUrl', () => {
    it('prepends R2 base URL to relative paths', () => {
      withEnv(DEFAULT_R2_URL, () => {
        expect(resolveAudioUrl('releases/gravity/01-gravity.mp3')).toBe(
          'http://localhost:4321/r2/releases/gravity/01-gravity.mp3',
        );
      });
    });

    it('strips leading slash from path to avoid double slashes', () => {
      withEnv(DEFAULT_R2_URL, () => {
        expect(resolveAudioUrl('/releases/gravity/01-gravity.mp3')).toBe(
          'http://localhost:4321/r2/releases/gravity/01-gravity.mp3',
        );
      });
    });

    it('returns absolute http URLs unchanged', () => {
      withEnv(DEFAULT_R2_URL, () => {
        expect(resolveAudioUrl('http://example.com/audio.mp3')).toBe(
          'http://example.com/audio.mp3',
        );
      });
    });

    it('returns absolute https URLs unchanged', () => {
      withEnv(DEFAULT_R2_URL, () => {
        expect(resolveAudioUrl('https://example.com/audio.mp3')).toBe(
          'https://example.com/audio.mp3',
        );
      });
    });

    it('returns empty string for empty input', () => {
      withEnv(DEFAULT_R2_URL, () => {
        expect(resolveAudioUrl('')).toBe('');
      });
    });

    it('strips trailing slash from base URL', () => {
      withEnv('http://localhost:4321/r2/', () => {
        expect(resolveAudioUrl('releases/test/01-test.mp3')).toBe(
          'http://localhost:4321/r2/releases/test/01-test.mp3',
        );
      });
    });
  });

  describe('buildTrackFromContent', () => {
    it('produces a valid Track with resolved audioUrl', () => {
      withEnv(DEFAULT_R2_URL, () => {
        const track = buildTrackFromContent(
          {
            title: 'Dusk',
            audioFile: 'releases/midnight-sessions/01-dusk.mp3',
          },
          'midnight-sessions',
          0,
          'Sam',
          '/images/releases/midnight-sessions.svg',
        );

        expect(track).toEqual({
          id: 'midnight-sessions-0',
          title: 'Dusk',
          artist: 'Sam',
          audioUrl:
            'http://localhost:4321/r2/releases/midnight-sessions/01-dusk.mp3',
          artworkUrl: '/images/releases/midnight-sessions.svg',
        } satisfies Track);
      });
    });

    it('handles missing audioFile gracefully (empty audioUrl)', () => {
      const track = buildTrackFromContent(
        { title: 'Untitled' },
        'some-release',
        2,
        'Sam',
      );

      expect(track).toEqual({
        id: 'some-release-2',
        title: 'Untitled',
        artist: 'Sam',
        audioUrl: '',
        artworkUrl: undefined,
      } satisfies Track);
    });

    it('constructs correct id from slug and index', () => {
      const track = buildTrackFromContent(
        { title: 'Test', audioFile: 'releases/test/03-test.mp3' },
        'test-ep',
        3,
        'Sam',
      );

      expect(track.id).toBe('test-ep-3');
    });
  });

  describe('getWaveformPeaksUrl', () => {
    it('derives correct path from production R2 URL', () => {
      expect(
        getWaveformPeaksUrl(
          'https://pub-abc123.r2.dev/works/documentary/01-the-weight-of-water.mp3',
        ),
      ).toBe('/waveforms/works/documentary/01-the-weight-of-water.json');
    });

    it('derives correct path from dev wrangler URL (with /r2 prefix)', () => {
      expect(
        getWaveformPeaksUrl(
          'http://localhost:4321/r2/works/documentary/01-the-weight-of-water.mp3',
        ),
      ).toBe('/waveforms/works/documentary/01-the-weight-of-water.json');
    });

    it('derives correct path from dev local files URL (with /audio-samples prefix)', () => {
      expect(
        getWaveformPeaksUrl(
          'http://localhost:4321/audio-samples/works/documentary/01-the-weight-of-water.mp3',
        ),
      ).toBe('/waveforms/works/documentary/01-the-weight-of-water.json');
    });

    it('derives correct path for releases content', () => {
      expect(
        getWaveformPeaksUrl(
          'https://pub-abc123.r2.dev/releases/midnight-sessions/01-dusk.mp3',
        ),
      ).toBe('/waveforms/releases/midnight-sessions/01-dusk.json');
    });

    it('derives correct path from dev URL for releases content', () => {
      expect(
        getWaveformPeaksUrl(
          'http://localhost:4321/r2/releases/midnight-sessions/01-dusk.mp3',
        ),
      ).toBe('/waveforms/releases/midnight-sessions/01-dusk.json');
    });

    it('handles case-insensitive .MP3 extension', () => {
      expect(
        getWaveformPeaksUrl(
          'https://pub-abc123.r2.dev/works/test/01-audio.MP3',
        ),
      ).toBe('/waveforms/works/test/01-audio.json');
    });

    it('handles relative path (non-URL input)', () => {
      expect(
        getWaveformPeaksUrl('works/documentary/01-the-weight-of-water.mp3'),
      ).toBe('/waveforms/works/documentary/01-the-weight-of-water.json');
    });

    it('handles relative path with leading slash', () => {
      expect(
        getWaveformPeaksUrl('/works/documentary/01-the-weight-of-water.mp3'),
      ).toBe('/waveforms/works/documentary/01-the-weight-of-water.json');
    });

    it('falls back to full pathname when no content directory found', () => {
      expect(
        getWaveformPeaksUrl('https://example.com/some/other/path/audio.mp3'),
      ).toBe('/waveforms/some/other/path/audio.json');
    });

    it('produces path matching build script output for documentary track', () => {
      // This traces the exact path from content file → audioUrl → peaksUrl
      // Content: audioFile: "works/documentary/01-the-weight-of-water.mp3"
      // resolveAudioUrl produces: "https://pub-xxx.r2.dev/works/documentary/01-the-weight-of-water.mp3"
      // Build script getOutputPath: "public/waveforms/works/documentary/01-the-weight-of-water.json"
      // getWaveformPeaksUrl must produce: "/waveforms/works/documentary/01-the-weight-of-water.json"
      const audioUrl =
        'https://pub-xxx.r2.dev/works/documentary/01-the-weight-of-water.mp3';
      const peaksUrl = getWaveformPeaksUrl(audioUrl);
      expect(peaksUrl).toBe(
        '/waveforms/works/documentary/01-the-weight-of-water.json',
      );
    });
  });
});
