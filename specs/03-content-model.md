# 03 — Content Model

**Last updated:** 2026-06-12

**Purpose:** Documents all five Astro content collections, their Zod schemas, relationships, and how to add new content.

---

## Overview

Content is managed through Astro's content collections system defined in `src/content/config.ts`. Each collection uses the `glob()` loader to read Markdown files from a dedicated directory. All schemas are defined with Zod and validated at build time.

All content files are Markdown (`.md`) with YAML frontmatter. The filename (without extension) becomes the collection entry's `id`, which is used for URL routing in some collections.

---

## Collections

### `releases`

**Directory:** `src/content/releases/`
**Loader:** `glob({ pattern: '**/*.md', base: './src/content/releases' })`

Represents musical releases (albums, EPs, singles). Each release has its own detail page at `/releases/[slug]`.

#### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | ✅ | Release title |
| `artist` | `string` | ✅ | Artist name |
| `releaseDate` | `Date` | ✅ | Release date |
| `dateStatus` | `string` | ❌ | Flag for unverified dates (e.g., `"UNVERIFIED — likely placeholder"`) |
| `type` | `enum('album', 'ep', 'single')` | ✅ | Release type |
| `artwork` | `string` | ✅ | Path to album artwork image |
| `description` | `string` | ❌ | Short description |
| `tracks` | `array` | ✅ | List of tracks (see below) |
| `streamingLinks` | `object` | ❌ | Links to streaming platforms (see below) |

**Track object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | ✅ | Track title |
| `duration` | `string` | ✅ | Duration in `M:SS` format (e.g., `"4:12"`) |
| `spotifyUrl` | `URL string` | ❌ | Spotify track URL |
| `appleMusicUrl` | `URL string` | ❌ | Apple Music track URL |
| `youtubeMusicUrl` | `URL string` | ❌ | YouTube Music track URL |
| `bandcampUrl` | `URL string` | ❌ | Bandcamp track URL |
| `audioFile` | `string` | ❌ | Relative path to MP3 in R2 (e.g., `releases/midnight-sessions/01-dusk.mp3`) |

**Streaming links object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `spotify` | `URL string` | ❌ | Spotify album URL |
| `appleMusic` | `URL string` | ❌ | Apple Music album URL |
| `youtubeMusic` | `URL string` | ❌ | YouTube Music album URL |
| `bandcamp` | `URL string` | ❌ | Bandcamp album URL |

#### Example Frontmatter

```yaml
---
title: Midnight Sessions
artist: Sam
releaseDate: 2025-11-15
dateStatus: "UNVERIFIED — likely placeholder"
type: album
artwork: /images/releases/midnight-sessions.svg
description: >
  A late-night journey through ambient textures and driving rhythms.
tracks:
  - title: Dusk
    duration: "4:12"
    audioFile: releases/midnight-sessions/01-dusk.mp3
  - title: Midnight Drive
    duration: "5:38"
    audioFile: releases/midnight-sessions/02-midnight-drive.mp3
streamingLinks:
  spotify: https://open.spotify.com/album/xxx
  appleMusic: https://music.apple.com/album/xxx
---
```

---

### `about`

**Directory:** `src/content/about/`
**Loader:** `glob({ pattern: '**/*.md', base: './src/content/about' })`

Single-entry collection for the artist's bio. The first entry is used by the homepage and `AboutModal`.

#### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | ✅ | About section title |
| `photo` | `string` | ✅ | Path to artist portrait |
| `photoAlt` | `string` | ✅ | Alt text for portrait |
| `genreTags` | `string[]` | ✅ | Array of genre labels |
| `pressQuotes` | `array` | ✅ | Array of press quote objects |
| `contactEmail` | `string` | ❌ | Contact email (currently unused) |

**Press quote object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | `string` | ✅ | Quote text |
| `source` | `string` | ✅ | Publication/source name |
| `url` | `URL string` | ❌ | Link to original article |

#### Example Frontmatter

```yaml
---
title: 'About Sam'
photo: '/images/bio/spt.png'
photoAlt: 'Sam performing live'
genreTags:
  - Electronic
  - Ambient
  - Indie
  - Experimental
pressQuotes:
  - text: "A singular voice in electronic music."
    source: 'Pitchfork'
  - text: 'One of the most compelling live performers.'
    source: 'Resident Advisor'
    url: 'https://example.com/ra-live-review'
---
```

The Markdown body contains the full bio text.

---

### `works`

**Directory:** `src/content/works/`
**Loader:** `glob({ pattern: '**/*.md', base: './src/content/works' })`

Playlist sections for the homepage accordion. Each entry represents a category of work (e.g., Documentary, Film, Library).

#### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | ✅ | Section display title (e.g., `"Documentary Film"`) |
| `slug` | `string` | ✅ | URL-safe identifier (e.g., `"documentary"`) |
| `description` | `string` | ❌ | Section description |
| `tracks` | `array` | ✅ | Array of track objects (see below) |

**Track object:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | `string` | ✅ | — | Track title |
| `duration` | `string` | ✅ | — | Duration in `M:SS` or `MM:SS` format |
| `audioFile` | `string` | ❌ | — | Relative path to MP3 in R2 |
| `icon` | `string` | ❌ | `'music'` | Category icon key (`music`, `film`, `tv`, `trailer`) or URL to custom image |
| `subtitle` | `string` | ❌ | — | Track subtitle (e.g., production credit) |

#### Example Frontmatter

```yaml
---
title: 'Documentary Film'
slug: 'documentary'
description: 'Original scores for documentary film and television.'
tracks:
  - title: 'A Worldwide Sensation'
    duration: '01:35'
    icon: 'images/A Life On The Farm.jpeg'
    subtitle: 'A Life On The Farm (Original Motion Picture Soundtrack)'
    audioFile: 'works/documentary/A Life on the Farm - A Worldwide Sensation.mp3'
  - title: 'The Man'
    duration: '03:17'
    icon: 'film'
    audioFile: 'works/documentary/A Life on the Farm - The Man.mp3'
---
```

---

### `projects`

**Directory:** `src/content/projects/`
**Loader:** `glob({ pattern: '**/*.md', base: './src/content/projects' })`

Project entries displayed in the `ProjectGrid` on the homepage. Each project opens in a `ProjectModal`.

#### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | ✅ | Project title |
| `slug` | `string` | ✅ | URL-safe identifier |
| `summary` | `string` | ✅ | Short project description |
| `publishDate` | `Date` | ✅ | Publication date (used for sorting) |
| `dateStatus` | `string` | ❌ | Flag for unverified dates |
| `image` | `string` | ✅ | Path to project image |
| `video` | `URL string` | ❌ | YouTube video URL |
| `videoStartTime` | `number` | ❌ | YouTube video start time in seconds (passed as `start` param) |

#### Example Frontmatter

```yaml
---
title: 'Heimat'
slug: 'heimat'
summary: 'Original soundtrack for the documentary film Heimat.'
publishDate: 2024-06-01
dateStatus: 'UNVERIFIED — possibly placeholder'
image: '/images/projects/heimat.jpeg'
---
```

---

### `gallery`

**Directory:** `src/content/gallery/`
**Loader:** `glob({ pattern: '**/*.md', base: './src/content/gallery' })`

Gallery items displayed in the `MediaCarousel` on the homepage.

#### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | ✅ | Item title |
| `type` | `enum('image', 'video', 'instagram')` | ✅ | Media type |
| `src` | `string` | ✅ | Source image/video URL |
| `thumbnail` | `string` | ❌ | Thumbnail image path |
| `alt` | `string` | ❌ | Alt text |
| `order` | `number` | ✅ | Display order (ascending) |
| `instagramUrl` | `URL string` | ❌ | Instagram post URL (for `type: 'instagram'`) |

#### Example Frontmatter

```yaml
---
title: "Studio Session — Composing for Documentary"
type: instagram
src: /images/gallery/sammytoms-01-thumb.jpg
thumbnail: /images/gallery/sammytoms-01-thumb.jpg
alt: "Composing music in the studio for a documentary film"
order: 1
instagramUrl: https://www.instagram.com/p/Csx3gCntnjj/
---
```

---

## Content Relationships

```
┌──────────────┐     feeds      ┌─────────────────────┐
│   works/     │ ───────────────►│ PlaylistAccordion   │
│              │                 │ (homepage sections) │
│ tracks[]     │                 │                     │
│ .audioFile   │── builds ─────►│ Track[] for Player  │
└──────────────┘                 └─────────────────────┘

┌──────────────┐    links to    ┌─────────────────────┐
│  releases/   │ ──────────────►│ /releases/[slug]    │
│              │                │ (detail page)       │
│ tracks[]     │── builds ────►│ Track[] for Player  │
│ streamingLinks│─ renders ────►│ StreamingLinks      │
└──────────────┘                └─────────────────────┘

┌──────────────┐    populates   ┌─────────────────────┐
│  gallery/    │ ──────────────►│ MediaCarousel       │
│  (sorted by  │                │ (homepage carousel) │
│   order)     │                └─────────────────────┘
└──────────────┘

┌──────────────┐    populates   ┌─────────────────────┐
│  projects/   │ ──────────────►│ ProjectGrid         │
│  (sorted by  │                │ (homepage grid)     │
│   publishDate│── opens ──────►│ ProjectModal        │
│   desc)      │                └─────────────────────┘
└──────────────┘

┌──────────────┐    feeds       ┌─────────────────────┐
│   about/     │ ──────────────►│ AboutModal          │
│              │                │ (bio + genre tags + │
│ genreTags[]  │── renders ────►│  press quotes)      │
│ pressQuotes[]│                │                     │
│ (body text)  │── reads from ─►│ hidden DOM element  │
└──────────────┘                └─────────────────────┘
```

### Key Relationships

- **`works/` → `PlaylistAccordion`:** The homepage (`index.astro`) fetches `works` entries, sorts them by a hardcoded `sectionOrder` array (`['documentary', 'film', 'library', 'trailers-themes-idents']`), and passes display data to the accordion. Audio tracks are built via `buildTrackFromContent()` and passed separately as `playableTracksMap` and `allTracks`.

- **`releases/` → Detail pages:** Each release's `id` (filename without `.md`) becomes the URL slug at `/releases/[slug]`. The release page (`[slug].astro`) looks up the entry by `id` and renders artwork, metadata, streaming links, and a playable track list.

- **`gallery/` → `MediaCarousel`:** Gallery entries are sorted by `order` (ascending) and their `data` objects are passed directly as items.

- **`projects/` → `ProjectGrid`:** Project entries are sorted by `publishDate` (descending) in the grid. Clicking a card dispatches `project-modal:open` with serialized project data.

- **`about/` → `AboutModal`:** The first entry's data (title, photo, genreTags, pressQuotes) is passed as props to `AboutModal`. The Markdown body is rendered into a hidden `<div id="about-bio-content">` that the modal reads from the DOM.

---

## File Naming Convention

- Filenames become the collection entry's `id`
- For `releases/`, the `id` is used as the URL slug (e.g., `midnight-sessions.md` → `/releases/midnight-sessions`)
- For `works/` and `projects/`, the `slug` field in frontmatter is the canonical identifier (not the filename)
- Use lowercase, hyphenated names: `my-album.md`, `documentary.md`

---

## `dateStatus` Field Pattern

Both `releases` and `projects` collections support an optional `dateStatus` string field. This field flags dates that may be placeholder values:

```yaml
dateStatus: "UNVERIFIED — likely placeholder (scaffold commit KB-004; all streaming URLs are example-placeholders; artwork is placeholder SVG; no audio files exist). Content owner: confirm or update."
```

**Usage:** Content editors use this field to track which dates need verification. It does not affect rendering or sorting — it is purely informational for content management.

---

## Adding New Content

### Adding a New Release

1. Create `src/content/releases/your-album-slug.md`
2. Add frontmatter matching the releases schema (see example above)
3. Upload album artwork to `public/images/releases/`
4. Upload audio files to Cloudflare R2 under `releases/your-album-slug/`
5. Generate waveform data: `npm run generate:waveforms`
6. The release will appear on `/releases` and have its own page at `/releases/your-album-slug`

### Adding a New Project

1. Create `src/content/projects/your-project-slug.md`
2. Add frontmatter matching the projects schema
3. Upload project image to `public/images/projects/`
4. Optionally add a YouTube video URL
5. The project will appear in the homepage `ProjectGrid`, sorted by `publishDate` (newest first)

### Adding a New Gallery Item

1. Create `src/content/gallery/your-item-slug.md` (filename is arbitrary — `order` controls position)
2. Add frontmatter matching the gallery schema
3. Set `type` to `image`, `video`, or `instagram`
4. Set `order` to the desired position (ascending)
5. For Instagram items, set `instagramUrl` and `thumbnail`
6. Upload images to `public/images/gallery/`
7. Run `npm run fetch:oembed` to fetch Instagram thumbnails (requires `INSTAGRAM_ACCESS_TOKEN`)

### Adding a New Works Section

1. Create `src/content/works/your-section-slug.md`
2. Add frontmatter matching the works schema
3. Set `slug` to a URL-safe identifier
4. Add tracks with `audioFile` paths pointing to R2 locations
5. Update the `sectionOrder` array in `src/pages/index.astro` to include the new slug in the desired position
6. Generate waveform data: `npm run generate:waveforms`
