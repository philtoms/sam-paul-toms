/**
 * Audio URL resolution utilities.
 *
 * Audio files are served from Cloudflare R2 (not from Astro's public/ directory).
 * These helpers construct full audio URLs from a relative audioFile path
 * and the R2_PUBLIC_URL environment variable.
 */

import type { Track } from '../components/AudioPlayer/types';

/**
 * Get the R2 public base URL from the environment.
 * Falls back to the local dev Wrangler R2 proxy URL.
 *
 * R2_PUBLIC_URL does NOT need a PUBLIC_ prefix because it is only used
 * server-side in Astro frontmatter (never in client-side code).
 */
export function getR2PublicUrl(): string {
  return import.meta.env.R2_PUBLIC_URL || 'http://localhost:4321/r2';
}

/**
 * Resolve a relative audio file path to a full URL.
 *
 * @param audioFile - Relative path like `releases/midnight-sessions/01-dusk.mp3`
 *                    or an absolute URL starting with `http`.
 * @returns Full URL to the audio file on R2.
 */
export function resolveAudioUrl(audioFile: string): string {
  if (!audioFile) return '';
  if (audioFile.startsWith('http://') || audioFile.startsWith('https://')) {
    return audioFile;
  }
  const base = getR2PublicUrl().replace(/\/$/, '');
  const path = audioFile.replace(/^\//, '');
  return `${base}/${path}`;
}

/**
 * Derive the waveform peaks JSON URL from an audio URL.
 *
 * Extracts the relative audio file path (e.g., "works/documentary/01.mp3")
 * from the full audio URL by finding the content directory segment,
 * then maps it to the corresponding waveform JSON path.
 *
 * The build script (`generate-waveforms.ts`) generates files using the raw
 * `audioFile` path from content frontmatter, so this function must extract
 * that same path regardless of the base URL prefix used in different environments:
 * - Production: https://pub-xxx.r2.dev/works/documentary/01.mp3
 * - Dev (wrangler): http://localhost:4321/r2/works/documentary/01.mp3
 * - Dev (local files): http://localhost:4321/audio-samples/works/documentary/01.mp3
 *
 * All produce: /waveforms/works/documentary/01.json
 *
 * @param audioUrl - Full audio URL as stored in the Track object
 * @returns Relative URL to the waveform peaks JSON file
 */
export function getWaveformPeaksUrl(audioUrl: string): string {
  // Known content directories that appear in audioFile paths
  const contentDirs = ['works/', 'releases/'];

  let relativePath: string | undefined;

  try {
    const url = new URL(audioUrl);
    const pathname = url.pathname;

    // Find the content directory in the path to strip any base URL prefix
    for (const dir of contentDirs) {
      const idx = pathname.indexOf('/' + dir);
      if (idx !== -1) {
        relativePath = pathname.slice(idx + 1); // strip leading /
        break;
      }
    }

    // Fallback: if no content directory found, use the full pathname
    if (!relativePath) {
      relativePath = pathname.replace(/^\//, '');
    }
  } catch {
    // Not a valid URL — treat as a relative path
    relativePath = audioUrl.replace(/^\//, '');
  }

  const jsonPath = relativePath.replace(/\.mp3$/i, '.json');
  return `/waveforms/${jsonPath}`;
}

/**
 * Build a fully-populated Track object from content frontmatter data.
 *
 * @param trackData - A track object from the markdown frontmatter
 *   (must have `title`, optionally `audioFile`)
 * @param releaseSlug - The release slug (e.g. `midnight-sessions`)
 * @param trackIndex - Zero-based index of the track in the release
 * @param artist - Artist name
 * @param artworkUrl - URL to the album artwork
 * @returns A Track object with resolved audioUrl
 */
export function buildTrackFromContent(
  trackData: {
    title: string;
    audioFile?: string;
    icon?: string;
    subtitle?: string;
    credit?: string;
  },
  releaseSlug: string,
  trackIndex: number,
  artist: string,
  artworkUrl?: string,
): Track {
  return {
    id: `${releaseSlug}-${trackIndex}`,
    title: trackData.title,
    artist,
    audioUrl: trackData.audioFile ? resolveAudioUrl(trackData.audioFile) : '',
    artworkUrl,
    icon: trackData.icon,
    subtitle: trackData.subtitle,
    credit: trackData.credit,
  };
}
