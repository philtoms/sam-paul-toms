# Thumbnail Content-Gap Analysis

**Task:** KB-165
**Date:** 2026-06-24
**Auditor:** Automated audit (AI agent)
**Scope:** All 6 project files in `src/content/projects/` — thumbnail-strip compatibility of their `video:` fields, and the quality of the Void and Vista poster image.

## Summary

KB-164 curated the homepage thumbnail strip (4 entries: showreel + The Bon-Bons + The Solent + Void and Vista) and noted the film pool was "exhausted," claiming Solace was playlist-only and incompatible. This audit found that **Solace was already thumbnail-compatible** — its `video:` field is a single-video `watch?v=` URL, not the bare playlist URL KB-164 described. The film pool therefore contains **5 usable single-video films**, not 3. Only Heimat remains unusable (no `video:` field at all).

Two autonomous actions were taken: (1) the Void and Vista poster was re-encoded at higher quality from a YouTube CDN frame; (2) a thumbnail-compatibility audit test was added to lock the film-pool contract. No change was needed (or made) to Solace.

A new compatibility gate — `tests/projects/thumbnail-compatibility.test.ts` — now classifies every project file via the real `extractYouTubeId` function, so the homepage strip can never silently drift out of sync with the available films.

## Summary Table

| # | Project | File | Video URL | Thumbnail-Compatible? | Action Taken |
|---|---------|------|-----------|----------------------|--------------|
| 1 | A Life On The Farm | `a-life-on-the-farm.md` | `watch?v=xlt63O1YvSM` | ✅ Yes (`xlt63O1YvSM`) | None — already wired as the showreel/"home" thumbnail |
| 2 | The Bon-Bons | `the-bonbons.md` | `youtu.be/Z7xAf045od0` ⚠️ | ✅ Yes (`Z7xAf045od0`) | None — already wired. ⚠️ URL has a leading space; see note below |
| 3 | The Solent | `the-solent.md` | `watch?v=SdjNvMMJqoE` | ✅ Yes (`SdjNvMMJqoE`) | None — already wired |
| 4 | Void and Vista | `void-and-vista.md` | `watch?v=LYPRDXxgtUY` | ✅ Yes (`LYPRDXxgtUY`) | **Poster upgraded** — re-encoded from 1280×720 `maxresdefault.jpg` |
| 5 | Solace | `solace.md` | `watch?v=HvO1Dx3alNc` | ✅ Yes (`HvO1Dx3alNc`) | **No change needed** — already compatible (premise corrected) |
| 6 | Heimat | `heimat.md` | _(none)_ | ❌ No | None possible — needs a YouTube URL from the product owner |

## Actions Taken in This Task

### 1. Void and Vista poster upgraded

`public/images/projects/VoidandVista.webp` was a 6,912-byte, 1200×628 webp — absurdly over-compressed (~0.009 bytes/pixel, nearly unrecognisable). It was replaced with a re-encode of the YouTube CDN `maxresdefault.jpg` frame (1280×720) for the Void and Vista video `LYPRDXxgtUY`:

- Downloaded `https://img.youtube.com/vi/LYPRDXxgtUY/maxresdefault.jpg` (HTTP 200, valid 32,869-byte JPEG, 1280×720).
- Re-encoded with `cwebp -q 90` to the **same path** `public/images/projects/VoidandVista.webp`.
- Result: **24,360 bytes** at 1280×720 — a 3.5× size increase and a dramatic quality improvement. (Quality 90 was chosen over the suggested 85 because q85 produced 19,046 bytes, just under the >20 KB quality bar this task set; q90 comfortably exceeds it while remaining a reasonable poster size.)
- Path and extension were kept identical, so no frontmatter change was needed and KB-164's `videoThumbnails` reference stays valid.

### 2. Solace — already compatible (premise corrected)

KB-164's film-pool notes claimed Solace was "playlist-only (incompatible with `extractYouTubeId`)." This was **factually incorrect**. `src/content/projects/solace.md` has always (since the original content commits, pre-dating KB-164) contained:

```yaml
video: 'https://www.youtube.com/watch?v=HvO1Dx3alNc'
videoStartTime: 30
```

This is a standard single-video URL. `extractYouTubeId('https://www.youtube.com/watch?v=HvO1Dx3alNc')` returns `'HvO1Dx3alNc'` — Solace is already thumbnail-compatible. The proposed RSS-feed extraction and bare-playlist → video-in-playlist conversion were therefore unnecessary and were **not performed**.

Because no conversion happened, `videoStartTime: 30` continues to work exactly as before: it is honoured as a `start=30` parameter on the embed (`buildYouTubeEmbedUrl` appends `&start=30` for any truthy start time). There is no playlist-queuing behaviour to speak of (see Technical Notes).

### 3. Thumbnail-compatibility audit test added

`tests/projects/thumbnail-compatibility.test.ts` classifies all 6 project files through the real `extractYouTubeId` gate and asserts the known sets:

- **Compatible (5):** `a-life-on-the-farm.md`, `solace.md`, `the-bonbons.md`, `the-solent.md`, `void-and-vista.md`
- **Incompatible (1):** `heimat.md`

When a new project adds a thumbnail-compatible video, the test fails with a clear diff, prompting the developer to add that film to the `videoThumbnails` array in `src/pages/index.astro`.

## Remaining Gaps Requiring Product-Owner Action

- **Heimat — no video.** `heimat.md` has no `video:` field, so it cannot appear in the thumbnail strip. The product owner must provide a YouTube URL (single-video: `watch?v=`, `youtu.be/`, or `embed/`) to unlock it.

- **Solace — not yet in the thumbnail strip.** Although Solace is thumbnail-compatible, the current homepage strip (`src/pages/index.astro`) has only 4 entries and does not include it. Adding a 5th entry (`{ image: '/images/projects/solace.jpeg', youtubeUrl: 'https://www.youtube.com/watch?v=HvO1Dx3alNc' }`) is a curation/UX decision — see the follow-up task. This is owned by the thumbnail-strip wiring work (KB-161/KB-164), not KB-165.

- **Solace starting clip verification.** The video `HvO1Dx3alNc` is the pre-existing, deliberately-chosen URL (it is referenced in the Solace summary as the "Listen on YouTube" link). It is a standalone single video, not the first clip of a playlist. The product owner should confirm this is the intended film for the Solace thumbnail/modal. (The original task premise involved pinning the first clip of playlist `PLFXASd15a3XO5QtQA6AGeFM73t3HxY7SG`; that conversion was not performed because Solace was already compatible. If the full playlist is the intended content, see the playlist-queuing note below.)

- **No additional films exist.** With Heimat blocked on a missing URL, the pool of usable films is exactly 5. Growing the strip further requires sourcing new single-video content.

- **Custom poster art.** The Void and Vista poster (and the other films) currently reuse YouTube CDN frames / branded artwork. Consider commissioning bespoke branded posters — especially for Void and Vista — rather than CDN grabs, for a more consistent visual identity across the strip.

## Technical Requirements for Adding New Thumbnail-Compatible Films

1. **URL format.** The project's `video:` frontmatter must be a single-video YouTube URL that `extractYouTubeId` resolves to an 11-character ID. Supported shapes: `youtube.com/watch?v=…`, `youtu.be/…`, `youtube.com/embed/…`. A **bare playlist URL** (`youtube.com/playlist?list=…`) returns `''` and is incompatible — pin a specific video instead (`watch?v=<id>`).

2. **Poster image.** The `image:` field should point to a poster of at least **1280×720** for crisp display in the strip. The image file must exist on disk under `public/`.

3. **Wiring.** To surface a compatible film in the strip, add an entry to the `videoThumbnails` array in `src/pages/index.astro`:
   ```ts
   { image: '/images/projects/<poster>', youtubeUrl: '<the single-video URL>' }
   ```
   Thumbnail videos always play from the beginning (the `videoStartTime` offset applies only to the main player, never to thumbnail clicks).

## Technical Notes

- **No playlist-queuing code path exists.** The original task premise referenced a `resolveYouTubeEmbed` function that would "queue the playlist after the pinned video" (a "shape 2" `watch?v=…&list=…` URL). **This function does not exist in the codebase.** The actual embed builder is `buildYouTubeEmbedUrl(videoId, startTime)` (`src/scripts/youtube.ts`), which constructs `https://www.youtube.com/embed/<id>?enablejsapi=1[&start=N]` from the video ID alone. Appending `&list=` to a `video:` field would have **no effect** on playback, because `extractYouTubeId` strips out the video ID and the list parameter is never forwarded to the iframe. Restoring Solace's playlist context would therefore require code changes (extending the embed builder to pass `&list=`), which is out of scope for this task and owned by the embed/thumbnail-handler tasks.

- **The Bon-Bons leading-space URL.** `the-bonbons.md` has `video: ' https://youtu.be/Z7xAf045od0'` (note the leading space). This is harmless — `extractYouTubeId`'s regex is unanchored, so it still resolves `Z7xAf045od0`, and the `z.string().url()` schema does not reject it — but it is a latent data-hygiene issue worth trimming in a future cleanup.

- **`videoStartTime` scope.** The start-time offset is applied only to the initial embed URL passed to `<YouTubeEmbed url=… startTime=…>` (used by the homepage showreel via the ProjectModal). It is never applied to thumbnail-strip clicks, which always play from 0:00.

## Action Items

- [ ] **Heimat** — product owner to provide a YouTube single-video URL for `src/content/projects/heimat.md`
- [ ] **Solace** — product owner to verify `HvO1Dx3alNc` is the intended film for the Solace thumbnail/modal (currently a standalone video, not the playlist)
- [ ] **Solace in strip** — decide whether to add Solace as a 5th thumbnail-strip entry (UX/curation decision; wiring owned by KB-161/KB-164)
- [ ] **Custom posters** — consider commissioning bespoke branded poster art for the films (especially Void and Vista)
- [ ] **The Bon-Bons** — trim the leading space from the `video:` URL in `the-bonbons.md` (minor data hygiene)

## Related

- **KB-164** — curated the 4-entry `videoThumbnails` strip; its "film pool exhausted / Solace playlist-only" finding is corrected here
- **KB-161 / KB-150** — homepage `videoThumbnails` wiring and the `initYouTubeThumbnails` handler
- **`tests/projects/thumbnail-compatibility.test.ts`** — the compatibility-audit gate added by this task
