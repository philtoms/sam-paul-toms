/**
 * Homepage (`index.astro`) wiring test.
 *
 * Source-grep style (mirrors `HeroBanner.test.ts`): reads `index.astro`
 * verbatim and asserts on substrings. This guards the "imported but never
 * rendered" regression — `YouTubeEmbed` was historically imported yet never
 * invoked in the template, leaving the showreel video invisible and the
 * component's inline `<script>` unbundled.
 *
 * It asserts *wiring* (is the component on the page, bound to the real
 * constant?), NOT behaviour — component behaviour is locked separately in
 * `YouTubeEmbed.test.ts` via the Astro Container API. Do not duplicate those
 * assertions here.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const indexPath = resolve(process.cwd(), 'src/pages/index.astro');
const index = readFileSync(indexPath, 'utf-8');

describe('Homepage YouTubeEmbed wiring', () => {
  it('renders the component bound to the real youtubeUrl constant', () => {
    // Regression guard: fails if the component is imported but not rendered,
    // or is rendered with a hardcoded/different URL instead of the constant.
    expect(index).toContain('<YouTubeEmbed url={youtubeUrl}');
  });

  it('passes the videoThumbnails array to the embed', () => {
    // Guards against the prop being dropped from the render, which would
    // silently leave the thumbnail strip empty (the KB-161 regression).
    expect(index).toContain('videoThumbnails={videoThumbnails}');
  });

  it('uses branded project poster images (not YouTube CDN grabs)', () => {
    // The showreel's own poster acts as a "home/reset" thumbnail (KB-164).
    expect(index).toContain('/images/projects/ALOTF.jpg');
    // The remaining films use their canonical branded posters from the
    // content collection, matching the ProjectGrid/ProjectModal artwork.
    expect(index).toContain('/images/projects/the-bonbons.jpeg');
    expect(index).toContain('/images/projects/VoidandVista.webp');
  });

  it('no longer references the old YouTube CDN thumbnail grabs', () => {
    // KB-164 replaced the video-thumb-{1,2,3}.jpeg CDN grabs with branded
    // project posters; ensure they were not re-introduced.
    expect(index).not.toContain('video-thumb-1');
    expect(index).not.toContain('video-thumb-2');
    expect(index).not.toContain('video-thumb-3');
  });

  it('keeps the showreel video constant intact', () => {
    expect(index).toContain('watch?v=xlt63O1YvSM');
  });

  it('still imports the YouTubeEmbed component', () => {
    expect(index).toMatch(/import\s+YouTubeEmbed/);
  });
});
