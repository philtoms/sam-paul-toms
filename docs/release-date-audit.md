# Release Date Audit Report

**Task:** KB-092
**Date:** 2026-06-11
**Auditor:** Automated audit (AI agent)
**Scope:** All 4 release files in `src/content/releases/`

## Summary

All 4 `releaseDate` values in release frontmatter were invented during the initial scaffold (commit `f469003`, task KB-004, 2026-05-19). No corroborating evidence was found in the codebase for any of these dates. Each file has been flagged with a `dateStatus` field in its frontmatter indicating the audit result.

This audit follows the same methodology as the project publish-date audit (KB-089, see `docs/publish-date-audit.md`).

## Summary Table

| # | Release | File | Current releaseDate | Status | Evidence | Recommended Action |
|---|---------|------|-------------------|--------|----------|-------------------|
| 1 | Echoes | `echoes-ep.md` | 2025-08-03 | UNVERIFIED — likely placeholder | All streaming URLs are `example-` placeholders. Artwork is placeholder SVG. No audio files exist. Date from scaffold commit. | **High priority** — verify with content owner |
| 2 | Midnight Sessions | `midnight-sessions.md` | 2025-11-15 | UNVERIFIED — likely placeholder | All streaming URLs are `example-` placeholders. Artwork is placeholder SVG. No audio files exist. Body says "winter of 2025" but Nov 15 is autumn. Date from scaffold commit. | **High priority** — verify with content owner |
| 3 | Neon Lights | `neon-lights.md` | 2026-01-20 | UNVERIFIED — likely placeholder | All streaming URLs are `example-` placeholders. Artwork is placeholder SVG. No audio files exist. Body says "trip to Tokyo in late 2025" — a Jan 2026 release is plausible but body text reads as fictional. Date from scaffold commit. | **High priority** — verify with content owner |
| 4 | Gravity | `gravity.md` | 2026-04-10 | UNVERIFIED — likely placeholder | All streaming URLs are `example-` placeholders. Artwork is placeholder SVG. No audio files exist. Body mentions "restored 1960s Steinway" — reads as fictional. Date from scaffold commit. | **High priority** — verify with content owner |

## Detailed Findings

### Evidence Sources Checked

1. **Git history:** All 4 release files were created in a single scaffold commit (`f469003`, KB-004) on 2026-05-19. The commit message explicitly states: "Add 4 sample releases with placeholder SVG artwork." All `releaseDate` values were written at that time with no prior history.

2. **Artwork files:** All 4 artwork files in `public/images/releases/` are placeholder SVGs — simple colored rectangles with the release title and artist name rendered as `<text>` elements. These are not actual album artwork.

3. **Audio files:** No audio files exist in the codebase. The `public/releases/` directory (referenced by `audioFile` paths like `releases/midnight-sessions/01-dusk.mp3`) does not exist. No `.mp3` files were found anywhere in `public/`.

4. **Streaming URLs:** Every Spotify, Apple Music, and YouTube Music URL across all 4 releases contains `example-` path segments (e.g., `https://open.spotify.com/track/example-dusk`). Only the Bandcamp URLs use plausible paths (`https://sam.bandcamp.com/track/...`) but these also appear to be scaffold-generated.

5. **Body text:** All body text reads as fictional/scaffold-generated content:
   - Gravity: "recorded in a single take on a restored 1960s Steinway"
   - Neon Lights: "written during a trip to Tokyo in late 2025"
   - Midnight Sessions: "late-night recording sessions during the winter of 2025"
   - Echoes: "recordings of piano, guitar, and even a vintage drum machine tracked through analog outboard gear"

6. **Chronological spread:** Dates are spaced roughly 3 months apart (Aug 2025 → Nov 2025 → Jan 2026 → Apr 2026) — suspiciously even distribution that suggests deliberate spacing rather than actual release dates.

7. **Cross-reference with projects:** The project publish-date audit (KB-089) found project dates spanning 2023–2024. Release dates spanning 2025–2026 is chronologically plausible (releases after projects) but provides no corroboration given that all project dates were also invented.

8. **CHANGELOG:** No references to specific release dates.

### Individual Assessments

#### Echoes — 2025-08-03
EP with 4 tracks. Early August date. All 3 non-Bandcamp streaming URLs for individual tracks contain `example-`. The album-level streaming links also use `example-echoes`. Body text describes fictional-sounding recording process.

#### Midnight Sessions — 2025-11-15
Album with 6 tracks. Mid-November date. Body text says "winter of 2025" but November 15 is technically autumn (winter begins December 21). This inconsistency suggests the body text and date were invented independently during scaffold.

#### Neon Lights — 2026-01-20
Single with 1 track. January 2026 date. Body text mentions "trip to Tokyo in late 2025" — a January 2026 release after a late 2025 trip is chronologically plausible, which makes this date slightly harder to dismiss. However, all other evidence (placeholder URLs, no audio, placeholder artwork, scaffold commit) points firmly to fabrication.

#### Gravity — 2026-04-10
Single with 1 track. Furthest future date relative to the scaffold date (May 2026). Body text about a "restored 1960s Steinway" reads as fictional. Only has 2 streaming links (Spotify and Bandcamp), both with `example-` placeholders.

### Note on Streaming URLs

**All streaming URLs have been audited and removed (KB-095).** The original files contained 39 `example-` placeholder URLs across Spotify, Apple Music, and YouTube Music fields, plus 14 Bandcamp URLs (`sam.bandcamp.com`). A thorough search of all major streaming platforms confirmed that none of the 4 releases (Gravity, Echoes, Midnight Sessions, Neon Lights) exist as real releases by Sam Paul Toms. The artist's only streaming release is "A Life On the Farm (Original Motion Picture Soundtrack)" (Apple Music, Spotify, YouTube). All Bandcamp URLs returned 404 — the artist has no Bandcamp page. All placeholder and fake streaming URLs were removed in KB-095. An anti-regression test was added to prevent future `example-` placeholder URLs from being re-introduced.

## Action Items

The content owner should work through this checklist to verify or correct each date:

- [ ] **Echoes** — confirm or update `releaseDate: 2025-08-03` in `src/content/releases/echoes-ep.md`
- [ ] **Midnight Sessions** — confirm or update `releaseDate: 2025-11-15` in `src/content/releases/midnight-sessions.md`
- [ ] **Neon Lights** — confirm or update `releaseDate: 2026-01-20` in `src/content/releases/neon-lights.md`
- [ ] **Gravity** — confirm or update `releaseDate: 2026-04-10` in `src/content/releases/gravity.md`
- [ ] After updating dates, remove the `dateStatus` field from each file's frontmatter
- [ ] Replace `example-` streaming URLs with actual links (separate task recommended)
- [ ] Replace placeholder SVG artwork with actual album artwork (separate task recommended)
- [ ] After all dates are confirmed and `dateStatus` fields are removed, remove the `dateStatus` field from the releases schema in `src/content/config.ts`

## How to Update Dates

1. Open the release file in `src/content/releases/`
2. Edit the `releaseDate` value in the YAML frontmatter (format: `YYYY-MM-DD`)
3. Remove the `dateStatus` line
4. Run `npm run build` to verify the build passes
5. Run `npm run test` to verify all tests pass
6. Commit the change

## Technical Notes

- Each release file now contains an optional `dateStatus` frontmatter field indicating audit status.
- The `releases` schema in `src/content/config.ts` has been updated to accept `dateStatus` as an optional string field.
- The `dateStatus` field is intentionally not consumed by any component — it exists solely as an inline flag for content editors.
- Once all dates are verified and `dateStatus` fields are removed, the schema field can be removed as well.
- This audit follows the same format as the project publish-date audit (KB-089, `docs/publish-date-audit.md`).

## Related

- **KB-089** — Project `publishDate` audit (all 6 project dates also flagged as unverified)
- **KB-004** — Original scaffold commit that created all 4 release files with placeholder content
- **KB-010** — Added playable audio track references to release pages (but audio files were never added to the repository)
