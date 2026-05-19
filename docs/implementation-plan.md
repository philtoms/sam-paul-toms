# Implementation Plan — Music Portfolio Website

**Generated:** 2026-05-19
**Source:** `docs/initial-research.md` (Sections 2 & 6)

---

## Overview

This plan translates the research report's recommendations into 8 concrete, ordered kanban tasks for building a music portfolio website. The site uses Astro as the framework, wavesurfer.js + howler.js for audio, Cloudflare Pages + R2 for hosting, and Umami for analytics.

## Tech Stack

| Layer     | Technology                           |
| --------- | ------------------------------------ |
| Framework | Astro (islands architecture)         |
| Styling   | Tailwind CSS v4                      |
| Audio     | wavesurfer.js v7 + howler.js         |
| Hosting   | Cloudflare Pages (site) + R2 (audio) |
| Analytics | Umami (self-hosted)                  |
| Content   | Astro content collections (Markdown) |
| SEO       | JSON-LD, Open Graph, sitemap         |

---

## Task Summary

| ID     | Task                          | Size | Dependencies           |
| ------ | ----------------------------- | ---- | ---------------------- |
| KB-002 | Project Scaffolding           | M    | —                      |
| KB-003 | Audio Player Component        | L    | KB-002                 |
| KB-004 | Track & Release Listing Pages | M    | KB-002                 |
| KB-005 | Artist Bio / About Page       | M    | KB-002                 |
| KB-006 | SEO & Meta Tags               | S    | KB-002, KB-004         |
| KB-007 | Dark Mode & Design System     | M    | KB-002                 |
| KB-008 | Cloudflare Pages + R2 Deploy  | M    | KB-002, KB-003, KB-006 |
| KB-009 | Analytics (Umami)             | S    | KB-002                 |

---

## Dependency Graph

```
                          ┌──────────┐
                          │  KB-002  │
                          │ Scaffold │
                          └────┬─────┘
                               │
              ┌────────────────┼────────────────────┬───────────────┐
              │                │                    │               │
              ▼                ▼                    ▼               ▼
        ┌──────────┐   ┌──────────┐         ┌──────────┐   ┌──────────┐
        │  KB-003  │   │  KB-004  │         │  KB-005  │   │  KB-007  │
        │  Audio   │   │ Releases │         │   Bio    │   │  Design  │
        └────┬─────┘   └────┬─────┘         └──────────┘   └──────────┘
             │              │
             │              ▼
             │        ┌──────────┐
             │        │  KB-006  │
             │        │   SEO    │
             │        └────┬─────┘
             │             │
             ▼             ▼
        ┌─────────────────────┐
        │       KB-008        │
        │   Cloudflare Deploy │
        └─────────────────────┘

        ┌──────────┐
        │  KB-009  │  (depends only on KB-002)
        │ Analytics│
        └──────────┘
```

---

## Recommended Implementation Order

The tasks are ordered to respect dependencies while maximizing parallelism:

### Phase 1 — Foundation

1. **KB-002: Project Scaffolding** — Must be completed first; everything depends on it.

### Phase 2 — Core Features (can run in parallel)

2. **KB-003: Audio Player Component** — Largest task (L), start early
3. **KB-004: Track & Release Listing Pages** — Needed before SEO task
4. **KB-005: Artist Bio / About Page** — Independent, can run in parallel
5. **KB-007: Dark Mode & Design System** — Establishes visual tokens early

### Phase 3 — Integration

6. **KB-006: SEO & Meta Tags** — Depends on KB-004 being complete
7. **KB-009: Analytics (Umami)** — Small task, can run anytime after scaffolding

### Phase 4 — Deployment

8. **KB-008: Cloudflare Pages + R2 Deploy** — Depends on KB-003 and KB-006 being complete. Final integration task.

### Optimal Parallel Execution

```
Week 1:  KB-002 ──────────────────────────────────────┐
                                                       │
Week 2:  KB-003 ────────────────────┐                  │
         KB-004 ──────────┐         │                  │
         KB-005 ─────────┐│         │                  │
         KB-007 ────────┐ ││         │                  │
         KB-009 ──────┐ │ ││         │                  │
                      │ │ ││         │                  │
Week 3:              KB-006 ────────┘│                  │
                                    │                  │
Week 3/4:                          KB-008 ─────────────┘
```

---

## Notes

- **Total estimated effort:** 2–5 days for v1 (per research Section 6)
- **Ongoing cost:** $0–12/year (domain only; hosting is free tier)
- **No CMS in v1:** Content is managed via Markdown files and git. A CMS (DecapCMS or TinaCMS) can be added later.
- **Not included in v1:** Gig calendar (Bandsintown embed), email signup (Buttondown), merch store, blog/news, video section. These are Should-Have/Nice-to-Have features for future iterations.
