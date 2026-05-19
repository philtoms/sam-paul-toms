import { describe, it, expect } from 'vitest';
import {
  durationToISO8601,
  resolveAbsoluteUrl,
  generateMusicAlbumSchema,
  generateMusicRecordingSchema,
} from '../../src/scripts/structured-data';
import type { ReleaseData, TrackData } from '../../src/scripts/structured-data';

const siteUrl = 'https://sam.music/';

const sampleRelease: ReleaseData = {
  title: 'Midnight Sessions',
  artist: 'Sam',
  releaseDate: new Date('2025-11-15'),
  type: 'album',
  artwork: '/images/releases/midnight-sessions.svg',
  description: 'A late-night journey through ambient textures.',
  tracks: [
    { title: 'Dusk', duration: '4:12' },
    { title: 'Midnight Drive', duration: '5:38' },
    { title: 'Neon Rain', duration: '3:55' },
  ],
};

describe('durationToISO8601', () => {
  it('converts "3:42" to "PT3M42S"', () => {
    expect(durationToISO8601('3:42')).toBe('PT3M42S');
  });

  it('converts "1:05" to "PT1M5S"', () => {
    expect(durationToISO8601('1:05')).toBe('PT1M5S');
  });

  it('converts "0:00" to "PT0M0S"', () => {
    expect(durationToISO8601('0:00')).toBe('PT0M0S');
  });

  it('converts "10:30" to "PT10M30S"', () => {
    expect(durationToISO8601('10:30')).toBe('PT10M30S');
  });

  it('handles ":42" as "PT0M42S"', () => {
    expect(durationToISO8601(':42')).toBe('PT0M42S');
  });

  it('handles "3:" as "PT3M0S"', () => {
    expect(durationToISO8601('3:')).toBe('PT3M0S');
  });
});

describe('resolveAbsoluteUrl', () => {
  it('resolves a relative path with leading slash', () => {
    expect(resolveAbsoluteUrl('/images/art.svg', siteUrl)).toBe(
      'https://sam.music/images/art.svg',
    );
  });

  it('resolves a relative path without leading slash', () => {
    expect(resolveAbsoluteUrl('images/art.svg', siteUrl)).toBe(
      'https://sam.music/images/art.svg',
    );
  });

  it('returns an already-absolute URL unchanged', () => {
    const abs = 'https://cdn.example.com/art.svg';
    expect(resolveAbsoluteUrl(abs, siteUrl)).toBe(abs);
  });

  it('handles http:// URLs as already-absolute', () => {
    const abs = 'http://example.com/art.svg';
    expect(resolveAbsoluteUrl(abs, siteUrl)).toBe(abs);
  });
});

describe('generateMusicAlbumSchema', () => {
  it('returns correct @type and @context', () => {
    const schema = generateMusicAlbumSchema(sampleRelease, siteUrl);
    expect(schema).toHaveProperty('@context', 'https://schema.org');
    expect(schema).toHaveProperty('@type', 'MusicAlbum');
  });

  it('maps release fields correctly', () => {
    const schema = generateMusicAlbumSchema(sampleRelease, siteUrl) as Record<
      string,
      unknown
    >;
    expect(schema.name).toBe('Midnight Sessions');
    expect(schema.byArtist).toEqual({
      '@type': 'MusicGroup',
      name: 'Sam',
    });
    expect(schema.datePublished).toBe('2025-11-15');
    expect(schema.image).toBe('https://sam.music/images/releases/midnight-sessions.svg');
    expect(schema.description).toBe('A late-night journey through ambient textures.');
  });

  it('includes albumReleaseType mapped correctly for album', () => {
    const schema = generateMusicAlbumSchema(sampleRelease, siteUrl) as Record<
      string,
      unknown
    >;
    expect(schema.albumReleaseType).toBe('https://schema.org/AlbumRelease');
  });

  it('maps EP release type', () => {
    const epRelease = { ...sampleRelease, type: 'ep' as const };
    const schema = generateMusicAlbumSchema(epRelease, siteUrl) as Record<
      string,
      unknown
    >;
    expect(schema.albumReleaseType).toBe('https://schema.org/EPRelease');
  });

  it('maps single release type', () => {
    const singleRelease = { ...sampleRelease, type: 'single' as const };
    const schema = generateMusicAlbumSchema(singleRelease, siteUrl) as Record<
      string,
      unknown
    >;
    expect(schema.albumReleaseType).toBe('https://schema.org/SingleRelease');
  });

  it('tracks array has correct length and structure', () => {
    const schema = generateMusicAlbumSchema(sampleRelease, siteUrl) as Record<
      string,
      unknown
    >;
    const tracks = schema.track as Array<Record<string, unknown>>;
    expect(tracks).toHaveLength(3);
    expect(tracks[0]).toEqual({
      '@type': 'MusicRecording',
      name: 'Dusk',
      duration: 'PT4M12S',
    });
    expect(tracks[2]).toEqual({
      '@type': 'MusicRecording',
      name: 'Neon Rain',
      duration: 'PT3M55S',
    });
  });

  it('omits description when not provided', () => {
    const noDescRelease = { ...sampleRelease, description: undefined };
    const schema = generateMusicAlbumSchema(noDescRelease, siteUrl) as Record<
      string,
      unknown
    >;
    expect(schema).not.toHaveProperty('description');
  });

  it('numTracks matches tracks length', () => {
    const schema = generateMusicAlbumSchema(sampleRelease, siteUrl) as Record<
      string,
      unknown
    >;
    expect(schema.numTracks).toBe(3);
  });
});

describe('generateMusicRecordingSchema', () => {
  const sampleTrack: TrackData = { title: 'Dusk', duration: '4:12' };

  it('returns correct @type and @context', () => {
    const schema = generateMusicRecordingSchema(
      sampleTrack,
      sampleRelease,
      siteUrl,
      'midnight-sessions',
    );
    expect(schema).toHaveProperty('@context', 'https://schema.org');
    expect(schema).toHaveProperty('@type', 'MusicRecording');
  });

  it('maps track fields correctly', () => {
    const schema = generateMusicRecordingSchema(
      sampleTrack,
      sampleRelease,
      siteUrl,
      'midnight-sessions',
    ) as Record<string, unknown>;
    expect(schema.name).toBe('Dusk');
    expect(schema.duration).toBe('PT4M12S');
    expect(schema.byArtist).toEqual({
      '@type': 'MusicGroup',
      name: 'Sam',
    });
  });

  it('inAlbum references correct album name', () => {
    const schema = generateMusicRecordingSchema(
      sampleTrack,
      sampleRelease,
      siteUrl,
      'midnight-sessions',
    ) as Record<string, unknown>;
    expect(schema.inAlbum).toEqual({
      '@type': 'MusicAlbum',
      name: 'Midnight Sessions',
    });
  });

  it('url is constructed from siteUrl + slug', () => {
    const schema = generateMusicRecordingSchema(
      sampleTrack,
      sampleRelease,
      siteUrl,
      'midnight-sessions',
    ) as Record<string, unknown>;
    expect(schema.url).toBe('https://sam.music/releases/midnight-sessions');
  });

  it('image is resolved to absolute URL', () => {
    const schema = generateMusicRecordingSchema(
      sampleTrack,
      sampleRelease,
      siteUrl,
      'midnight-sessions',
    ) as Record<string, unknown>;
    expect(schema.image).toBe(
      'https://sam.music/images/releases/midnight-sessions.svg',
    );
  });
});
