import { describe, it, expect } from 'vitest';
import matter from 'gray-matter';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { extractYouTubeId } from '../../src/scripts/youtube';

/**
 * Thumbnail-compatibility audit for the project film pool.
 *
 * A project film is "thumbnail-compatible" when its `video:` frontmatter is a
 * single-video YouTube URL (`watch?v=`, `youtu.be/`, or `embed/`) that
 * `extractYouTubeId` resolves to an 11-character video ID. Compatible films can
 * be added directly to the `videoThumbnails` array in `src/pages/index.astro`,
 * where each entry takes a `{ image, youtubeUrl }` poster+URL pair.
 *
 * Why this test exists — it is a content-audit gate:
 * When this test fails because a new project has a thumbnail-compatible video,
 * add that film to the `videoThumbnails` array in `src/pages/index.astro`
 * (currently curated by KB-161/KB-164). Conversely, if a film is removed or its
 * URL changes to a non-extractable form (e.g. a bare playlist URL), reconcile
 * the expected sets below with the new reality.
 *
 * Note: Solace was found to already be compatible during KB-165 (its `video:`
 * field is a `watch?v=` URL, not a bare playlist URL as KB-164's film-pool
 * notes claimed). It is therefore an available 5th film even though the current
 * homepage thumbnail strip (4 entries) does not yet include it.
 */

const projectsDir = join(process.cwd(), 'src/content/projects');

const projectFiles = readdirSync(projectsDir)
  .filter((f) => f.endsWith('.md'))
  .sort();

function loadProject(filename: string) {
  const raw = readFileSync(join(projectsDir, filename), 'utf-8');
  const { data } = matter(raw);
  return { filename, data };
}

/**
 * A film is thumbnail-compatible when `extractYouTubeId` returns a non-empty ID
 * for its `video:` field. A project with no `video:` field (or a URL shape
 * `extractYouTubeId` does not recognise, e.g. a bare playlist URL) is
 * incompatible.
 */
function isThumbnailCompatible(filename: string): boolean {
  const { data } = loadProject(filename);
  return extractYouTubeId(String(data.video ?? '')) !== '';
}

const compatible = projectFiles.filter(isThumbnailCompatible);
const incompatible = projectFiles.filter((f) => !isThumbnailCompatible(f));

describe('Project film pool — thumbnail compatibility audit', () => {
  it('classifies exactly the six single-video films as thumbnail-compatible', () => {
    // Sorted alphabetically by filename. If a new compatible film is added, this
    // assertion fails with a clear diff — add it to the homepage thumbnail strip.
    expect(compatible).toEqual([
      'a-life-on-the-farm.md',
      'garrett-honn-sam-paul-toms.md',
      'solace.md',
      'the-bonbons.md',
      'the-solent.md',
      'void-and-vista.md',
    ]);
  });

  it('classifies Heimat as the only incompatible film', () => {
    expect(incompatible).toEqual(['heimat.md']);
  });

  it('heimat.md has no video field (documented content gap)', () => {
    const { data } = loadProject('heimat.md');
    expect(data.video).toBeUndefined();
  });

  it('every compatible film resolves to an 11-character video ID', () => {
    for (const filename of compatible) {
      const { data } = loadProject(filename);
      const id = extractYouTubeId(String(data.video));
      expect(id, `${filename} should yield an 11-char video ID`).toHaveLength(11);
    }
  });
});
