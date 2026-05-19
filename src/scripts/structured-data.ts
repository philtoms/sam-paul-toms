/**
 * Structured data helpers for generating Schema.org JSON-LD objects
 * for music content (albums, EPs, singles, and tracks).
 */

interface TrackData {
  title: string;
  duration: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeMusicUrl?: string;
  bandcampUrl?: string;
  audioFile?: string;
}

interface ReleaseData {
  title: string;
  artist: string;
  releaseDate: Date;
  type: 'album' | 'ep' | 'single';
  artwork: string;
  description?: string;
  tracks: TrackData[];
}

/**
 * Convert a duration string in "M:SS" format to ISO 8601 duration.
 * Examples: "3:42" → "PT3M42S", "1:05" → "PT1M5S"
 */
export function durationToISO8601(duration: string): string {
  const parts = duration.split(':');
  const minutes = parseInt(parts[0] || '0', 10);
  const seconds = parseInt(parts[1] || '0', 10);
  return `PT${minutes}M${seconds}S`;
}

/**
 * Resolve a relative path to an absolute URL using the site's base URL.
 * If the path already starts with "http", it is returned as-is.
 */
export function resolveAbsoluteUrl(path: string, siteUrl: string): string {
  if (path.startsWith('http')) {
    return path;
  }
  const base = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
  const separator = path.startsWith('/') ? '' : '/';
  return `${base}${separator}${path}`;
}

/**
 * Map release type to Schema.org MusicAlbumReleaseType enumeration.
 */
function albumReleaseType(type: 'album' | 'ep' | 'single'): string {
  const mapping: Record<string, string> = {
    album: 'https://schema.org/AlbumRelease',
    ep: 'https://schema.org/EPRelease',
    single: 'https://schema.org/SingleRelease',
  };
  return mapping[type];
}

/**
 * Generate a Schema.org MusicAlbum JSON-LD object for a release.
 */
export function generateMusicAlbumSchema(
  release: ReleaseData,
  siteUrl: string,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: release.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: release.artist,
    },
    datePublished: release.releaseDate.toISOString().split('T')[0],
    image: resolveAbsoluteUrl(release.artwork, siteUrl),
    albumReleaseType: albumReleaseType(release.type),
    numTracks: release.tracks.length,
    track: release.tracks.map((track) => ({
      '@type': 'MusicRecording',
      name: track.title,
      duration: durationToISO8601(track.duration),
    })),
    ...(release.description ? { description: release.description } : {}),
  };
}

/**
 * Generate a Schema.org MusicRecording JSON-LD object for a track.
 */
export function generateMusicRecordingSchema(
  track: TrackData,
  release: ReleaseData,
  siteUrl: string,
  slug: string,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: track.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: release.artist,
    },
    duration: durationToISO8601(track.duration),
    inAlbum: {
      '@type': 'MusicAlbum',
      name: release.title,
    },
    url: `${siteUrl}releases/${slug}`,
    image: resolveAbsoluteUrl(release.artwork, siteUrl),
  };
}

/** Type exports for consumers */
export type { TrackData, ReleaseData };
