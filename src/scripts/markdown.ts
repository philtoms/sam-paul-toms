import { Marked } from 'marked';

/**
 * Dedicated `Marked` instance with project-wide options.
 *
 * Constructed at module scope so the (expensive) parser is configured once.
 * Using `new Marked({ ... })` instead of the `marked.use({ ... })` singleton
 * keeps this instance isolated — options here never leak into, or mutate,
 * the global `marked` singleton (which other libraries might rely on).
 *
 * Options:
 * - `breaks: true` — single newlines become `<br>` (GitHub-flavoured style),
 *   so a summary spread over multiple lines renders with line breaks.
 * - `gfm: true` — GitHub-flavoured markdown: strikethrough, tables,
 *   task lists, and other extended syntax.
 */
const marked = new Marked({ breaks: true, gfm: true });

/**
 * Pre-render a markdown string to HTML.
 *
 * **Server-side only.** This is imported from `.astro` files (e.g.
 * `ProjectGrid.astro`) where it runs in the Cloudflare worker at request
 * time. It must NEVER be imported from a `.tsx` client component — doing so
 * would bundle the markdown parser and ship it to the browser. The result
 * HTML is serialised into the JSON payload and rendered client-side via
 * `dangerouslySetInnerHTML` instead.
 *
 * @param md - First-party, version-controlled markdown source.
 * @returns The rendered HTML string.
 */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
