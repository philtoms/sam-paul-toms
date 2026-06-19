/**
 * YouTube helpers — shared across the YouTubeEmbed and ProjectModal embeds.
 *
 * Extracted from the byte-identical inline copies that previously lived in
 * `src/components/ProjectModal.tsx` (KB-132) and
 * `src/components/YouTubeEmbed.astro` (KB-136). Moving the URL-building logic
 * into a pure `.ts` function lets the byte-identical contract be locked by
 * exact-equality unit tests rather than fragile source-grep strings.
 */

/**
 * Extract the 11-character YouTube video ID from a URL.
 *
 * Supports `youtube.com/watch?v=`, `youtu.be/`, and `youtube.com/embed/` URL
 * forms. Returns an empty string when the URL does not match any known form.
 *
 * @param url - A YouTube watch, short, or embed URL.
 * @returns The 11-character video ID, or `''` on no match.
 */
export function extractYouTubeId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return '';
}

/**
 * Build a YouTube embed URL with the `enablejsapi=1` player param.
 *
 * The `start` timestamp is appended only when `startTime` is truthy, so that
 * `0`, `undefined`, and `NaN` all fall through to the base URL — keeping the
 * no-`start` case byte-identical to the original embed URL:
 *   `https://www.youtube.com/embed/${videoId}?enablejsapi=1`
 *
 * When `startTime` is truthy, the URL becomes:
 *   `https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${encodeURIComponent(startTime)}`
 *
 * @param videoId - The 11-character YouTube video ID.
 * @param startTime - Optional start position in seconds. Falsy values omit `start`.
 * @returns The full embed URL. Never appends `&start=0` or `?start=`.
 */
export function buildYouTubeEmbedUrl(
  videoId: string,
  startTime?: number,
): string {
  const base = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
  return startTime
    ? `${base}&start=${encodeURIComponent(startTime)}`
    : base;
}
