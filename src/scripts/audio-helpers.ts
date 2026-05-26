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
  return import.meta.env.R2_PUBLIC_URL || 'http://localhost:8788/r2';
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
  trackData: { title: string; audioFile?: string; icon?: string; subtitle?: string },
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
  };
}
