/**
 * Accent colour helpers for JS consumers that cannot resolve CSS custom properties.
 *
 * WaveSurfer.js renders to a <canvas> and uses fillStyle directly, so it cannot
 * read CSS var() values. These functions read the current accent colours from the
 * DOM's computed styles and return plain hex strings.
 *
 * Client-side only — requires `document` to be available.
 */

/** Read the current accent colour from the DOM. Falls back to #eab308. */
export function getAccentColor(): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-accent')
    .trim();
  return value || '#eab308';
}

/** Read the current accent hover colour from the DOM. Falls back to #facc15. */
export function getAccentHoverColor(): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-accent-hover')
    .trim();
  return value || '#facc15';
}
