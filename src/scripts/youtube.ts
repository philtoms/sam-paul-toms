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
 * Optional YouTube embed player params, all falsy-by-default so the no-option
 * case stays byte-identical to the original embed URL.
 */
export interface YouTubeEmbedOptions {
  /**
   * Loop the video indefinitely. YouTube only loops a single-video embed when
   * `playlist` is set to the same video ID, so `loop=1` is always emitted
   * together with `playlist=<videoId>`.
   */
  loop?: boolean;
  /**
   * Autoplay the video on load. Emitted as `autoplay=1&mute=1` because every
   * major browser's autoplay policy blocks playback with sound — without
   * `mute=1` the player stays paused (or silently blocked) despite
   * `autoplay=1`. The iframe must also permit autoplay via its `allow` attr.
   */
  autoplay?: boolean;
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
 * When `options.loop` is truthy, `&loop=1&playlist=<videoId>` is appended. The
 * `playlist` param must repeat the same video ID — `loop=1` alone has no effect
 * on a single-video embed.
 *
 * When `options.autoplay` is truthy, `&autoplay=1&mute=1` is appended. The
 * `mute=1` is mandatory: browser autoplay policy blocks unmuted autoplay, so
 * `autoplay=1` alone leaves the player paused/silently blocked.
 *
 * Params are emitted in a fixed order — `start`, `loop`, `autoplay` — so the
 * URL is deterministic and the byte-identical contract is lockable by exact-
 * equality tests. Falsy `startTime` / `options.loop` / `options.autoplay` omit
 * their respective params.
 *
 * @param videoId - The 11-character YouTube video ID.
 * @param startTime - Optional start position in seconds. Falsy values omit `start`.
 * @param options - Optional player params (e.g. `{ loop: true, autoplay: true }`).
 * @returns The full embed URL. Never appends `&start=0` or `?start=`.
 */
export function buildYouTubeEmbedUrl(
  videoId: string,
  startTime?: number,
  options?: YouTubeEmbedOptions,
): string {
  const base = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
  let url = base;
  if (startTime) {
    url += `&start=${encodeURIComponent(startTime)}`;
  }
  if (options?.loop) {
    // YouTube loops a single-video embed only when `playlist` repeats the same
    // video ID — `loop=1` on its own has no effect on a lone embed.
    url += `&loop=1&playlist=${encodeURIComponent(videoId)}`;
  }
  if (options?.autoplay) {
    // `mute=1` is required: every major browser blocks unmuted autoplay, so
    // `autoplay=1` alone leaves the player paused/silently blocked.
    url += `&autoplay=1&mute=1`;
  }
  return url;
}
