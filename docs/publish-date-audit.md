# Publish Date Audit Report

**Task:** KB-089
**Date:** 2026-06-11
**Auditor:** Automated audit (AI agent)
**Scope:** All 6 project files in `src/content/projects/`

## Summary

All 6 `publishDate` values in project frontmatter were invented during the initial scaffold (commit `3c9958e`, task KB-086, 2026-06-11). No corroborating evidence was found in the codebase for any of these dates. Each file has been flagged with a `dateStatus` field in its frontmatter indicating the audit result.

## Summary Table

| #   | Project            | File                    | Current publishDate | Status     | Evidence                                                                                   | Recommended Action                                                |
| --- | ------------------ | ----------------------- | ------------------- | ---------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| 1   | Void and Vista     | `void-and-vista.md`     | 2024-01-08          | UNVERIFIED | No evidence. Date from scaffold commit.                                                    | Verify with content owner                                         |
| 2   | Solace             | `solace.md`             | 2023-11-20          | UNVERIFIED | No evidence. Date from scaffold commit.                                                    | Verify with content owner                                         |
| 3   | A Life On The Farm | `a-life-on-the-farm.md` | 2024-03-15          | UNVERIFIED | No evidence. Date from scaffold commit. YouTube video exists but publish date not checked. | Verify with content owner; check YouTube video upload date        |
| 4   | The Bon-Bons       | `the-bonbons.md`        | 2024-04-22          | UNVERIFIED | No evidence. Date from scaffold commit.                                                    | Verify with content owner                                         |
| 5   | Heimat             | `heimat.md`             | 2024-06-01          | SUSPECT    | First-of-month pattern — classic placeholder indicator. No evidence.                       | **High priority** — likely placeholder. Verify with content owner |
| 6   | The Solent         | `the-solent.md`         | 2024-09-10          | UNVERIFIED | No evidence. Date from scaffold commit.                                                    | Verify with content owner                                         |

## Detailed Findings

### Evidence Sources Checked

1. **Git history:** All 6 project files were created in a single scaffold commit (`3c9958e`) on 2026-06-11. All `publishDate` values were written at that time with no prior history.

2. **Project images:** All project images (`heimat.jpeg`, `solace.jpeg`, etc.) were committed together on 2026-05-31 ("live assets" commit). File timestamps provide no date evidence.

3. **Audio files:** No audio files exist locally in `public/audio-samples/works/` (they are served from R2/cloud storage). No file metadata available for cross-referencing.

4. **Works catalogue:** The `src/content/works/` files list tracks for each project but contain no date information — only titles, durations, and file paths.

5. **works:** Release dates span 2025–2026 (Echoes EP: 2025-08-03, Midnight Sessions: 2025-11-15, Neon Lights: 2026-01-20, Gravity: 2026-04-10). Project dates (2023–2024) being earlier than release dates is chronologically plausible but provides no corroboration.

6. **README / CHANGELOG:** No references to specific project dates.

7. **YouTube:** A Life On The Farm has a YouTube video (`https://www.youtube.com/watch?v=xlt63O1YvSM`). The video upload date was not checked (requires live internet access) but could provide evidence.

### Individual Assessments

#### Void and Vista — 2024-01-08

Early January date. Could be real (start of year release) or arbitrary. No evidence for or against.

#### Solace — 2023-11-20

Mid-month, plausible. No evidence. This is the only date in 2023; the other 5 are in 2024.

#### A Life On The Farm — 2024-03-15

Mid-month, plausible. Has a YouTube video which could provide date evidence if checked externally.

#### The Bon-Bons — 2024-04-22

Mid-month, plausible. No evidence.

#### Heimat — 2024-06-01 ⚠️

**First-of-month date — strong placeholder indicator.** This pattern (round dates like the 1st, 15th, or last day of month) commonly appears when dates are invented rather than recorded. Highest suspicion of all 6 dates.

#### The Solent — 2024-09-10

Mid-month, plausible. No evidence.

### Patterns Observed

- **All dates were authored on the same day** (2026-06-11) in a single scaffold commit — none have provenance from actual project records.
- **5 of 6 dates are in 2024** — this clustering could indicate fabrication or could reflect a genuinely busy year.
- **Dates span ~10 months** (Nov 2023 to Sep 2024) in roughly even spacing — this even distribution is mildly suspicious.

## Action Items

The content owner should work through this checklist to verify or correct each date:

- [ ] **Void and Vista** — confirm or update `publishDate: 2024-01-08` in `src/content/projects/void-and-vista.md`
- [ ] **Solace** — confirm or update `publishDate: 2023-11-20` in `src/content/projects/solace.md`
- [ ] **A Life On The Farm** — confirm or update `publishDate: 2024-03-15` in `src/content/projects/a-life-on-the-farm.md` (also consider checking the YouTube video upload date)
- [ ] **The Bon-Bons** — confirm or update `publishDate: 2024-04-22` in `src/content/projects/the-bonbons.md`
- [ ] **Heimat** — confirm or update `publishDate: 2024-06-01` in `src/content/projects/heimat.md` (⚠️ likely placeholder)
- [ ] **The Solent** — confirm or update `publishDate: 2024-09-10` in `src/content/projects/the-solent.md`
- [ ] After updating dates, remove the `dateStatus` field from each file's frontmatter
- [ ] After all dates are confirmed, remove the `dateStatus` field from the schema in `src/content/config.ts`

## How to Update Dates

1. Open the project file in `src/content/projects/`
2. Edit the `publishDate` value in the YAML frontmatter (format: `YYYY-MM-DD`)
3. Remove the `dateStatus` line
4. Run `npm run build` to verify the build passes
5. Run `npm run test` to verify all tests pass
6. Commit the change

## Technical Notes

- Each project file now contains an optional `dateStatus` frontmatter field indicating audit status.
- The `projects` schema in `src/content/config.ts` has been updated to accept `dateStatus` as an optional string field.
- The `dateStatus` field is intentionally not consumed by any component — it exists solely as an inline flag for content editors.
- Once all dates are verified and `dateStatus` fields are removed, the schema field can be removed as well.

## Related

- **KB-092** — Release `releaseDate` audit (all 4 release dates also flagged as unverified; see `docs/release-date-audit.md`)
