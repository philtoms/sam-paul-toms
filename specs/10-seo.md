# 10 — SEO

**Last updated:** 2026-06-12

**Purpose:** Documents the SEO system — `SEOHead.astro` component, structured data helpers, sitemap integration, Open Graph/Twitter Cards, and how to add SEO to new pages.

---

## SEOHead Component (`src/components/SEOHead.astro`)

The central SEO component rendered in `<head>` by `BaseLayout.astro`. It accepts SEO configuration via props and generates all required meta tags.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ | — | Page title (`<title>` tag) |
| `description` | `string` | ✅ | — | Meta description |
| `image` | `string` | ❌ | — | OG/Twitter image path (resolved to absolute URL via `resolveAbsoluteUrl()`) |
| `canonicalUrl` | `string` | ❌ | `Astro.url.href` | Canonical URL (`<link rel="canonical">`) |
| `type` | `'website' \| 'music.song' \| 'music.album' \| 'music.playlist'` | ❌ | `'website'` | Open Graph type |
| `structuredData` | `object \| object[]` | ❌ | — | JSON-LD structured data (single or multiple schemas) |
| `noindex` | `boolean` | ❌ | `false` | If true, adds `<meta name="robots" content="noindex, nofollow">` |

### Generated Tags

**Title:**
```html
<title>{title}</title>
```

**Meta description:**
```html
<meta name="description" content="{description}" />
```

**Canonical URL:**
```html
<link rel="canonical" href="{canonicalUrl}" />
```

**Open Graph:**
```html
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{description}" />
<meta property="og:url" content="{canonicalUrl}" />
<meta property="og:type" content="{type}" />
<meta property="og:site_name" content="Sam Paul Toms" />
<!-- If image provided: -->
<meta property="og:image" content="{absoluteImage}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

**Twitter Card:**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title}" />
<meta name="twitter:description" content="{description}" />
<!-- If image provided: -->
<meta name="twitter:image" content="{absoluteImage}" />
```

**Structured Data (JSON-LD):**
```html
<script type="application/ld+json">{JSON.stringify(structuredData)}</script>
<!-- Supports single object or array of objects -->
```

**Noindex:**
```html
<!-- If noindex is true: -->
<meta name="robots" content="noindex, nofollow" />
```

### Hardcoded Values

> **Template-ization note:** The `og:site_name` is hardcoded as `"Sam Paul Toms"` in both `SEOHead.astro` (line 30) and `seo-helpers.ts` (line 64). This must be updated when forking the template. See [07-configuration.md](./07-configuration.md#known-hardcodes) for the full list.

---

## Structured Data Helpers (`src/scripts/structured-data.ts`)

### `durationToISO8601(duration: string): string`

Converts a duration string in `M:SS` or `MM:SS` format to ISO 8601 duration.

```typescript
durationToISO8601('4:12')  // → 'PT4M12S'
durationToISO8601('1:05')  // → 'PT1M5S'
```

### `resolveAbsoluteUrl(path: string, siteUrl: string): string`

Resolves a relative path to an absolute URL using the site's base URL. Returns paths already starting with `http` as-is.

```typescript
resolveAbsoluteUrl('/images/art.svg', 'https://example.com/')
// → 'https://example.com/images/art.svg'
```

### `generateMusicAlbumSchema(release: ReleaseData, siteUrl: string): object`

Generates a Schema.org `MusicAlbum` JSON-LD object for a release.

**Input type:**
```typescript
interface ReleaseData {
  title: string;
  artist: string;
  releaseDate: Date;
  type: 'album' | 'ep' | 'single';
  artwork: string;
  description?: string;
  tracks: TrackData[];
}
```

**Output schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "MusicAlbum",
  "name": "...",
  "byArtist": { "@type": "MusicGroup", "name": "..." },
  "datePublished": "2025-11-15",
  "image": "https://...",
  "albumReleaseType": "https://schema.org/AlbumRelease",
  "numTracks": 6,
  "track": [
    { "@type": "MusicRecording", "name": "...", "duration": "PT4M12S" }
  ]
}
```

**Release type mapping:**

| Type | Schema.org URI |
|------|---------------|
| `album` | `https://schema.org/AlbumRelease` |
| `ep` | `https://schema.org/EPRelease` |
| `single` | `https://schema.org/SingleRelease` |

### `generateMusicRecordingSchema(track, release, siteUrl, slug): object`

Generates a Schema.org `MusicRecording` JSON-LD object for an individual track.

```json
{
  "@context": "https://schema.org",
  "@type": "MusicRecording",
  "name": "...",
  "byArtist": { "@type": "MusicGroup", "name": "..." },
  "duration": "PT4M12S",
  "inAlbum": { "@type": "MusicAlbum", "name": "..." },
  "url": "https://.../releases/slug",
  "image": "https://..."
}
```

---

## SEO Helpers (`src/scripts/seo-helpers.ts`)

Pure TypeScript helpers for generating SEO tag descriptors. Used by `SEOHead.astro` and tested independently.

### `SEOProps` Interface

```typescript
interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  type?: 'website' | 'music.song' | 'music.album' | 'music.playlist';
  structuredData?: object | object[];
  noindex?: boolean;
  siteUrl?: string;
}
```

### `generateSEOTags(props: SEOProps)`

Returns an array of tag descriptors:

```typescript
Array<{
  type: 'title' | 'meta' | 'link' | 'script';
  attrs?: Record<string, string>;
  content?: string;
}>
```

Each descriptor represents a single HTML tag (title, meta, link, or script). This function is the testable pure-TS version of what `SEOHead.astro` renders.

---

## Sitemap Integration

### `@astrojs/sitemap`

Configured as an integration in `astro.config.mjs`:

```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://sampaultoms.com',
  integrations: [preact(), sitemap()],
});
```

### Generated Files

During `astro build`, the sitemap integration generates:

- `sitemap-index.xml` — Sitemap index file
- `sitemap-0.xml` — Actual sitemap with all page URLs

### Configuration

The `site` property in `astro.config.mjs` sets the canonical base URL for all sitemap entries. This must match the production domain.

---

## robots.txt

Located at `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://sampaultoms.com/sitemap-index.xml
```

**Important:** The sitemap URL must be updated to match the production domain when forking the template.

---

## Open Graph and Twitter Card Generation

All OG and Twitter Card tags are generated by `SEOHead.astro`:

### OG Tags

| Tag | Content |
|-----|---------|
| `og:title` | Page title |
| `og:description` | Meta description |
| `og:url` | Canonical URL |
| `og:type` | `website`, `music.song`, `music.album`, or `music.playlist` |
| `og:site_name` | Artist name (currently hardcoded — see [Known Hardcodes](./07-configuration.md#known-hardcodes)) |
| `og:image` | Absolute image URL (1200×630) |
| `og:image:width` | `1200` |
| `og:image:height` | `630` |

### Twitter Card Tags

| Tag | Content |
|-----|---------|
| `twitter:card` | `summary_large_image` |
| `twitter:title` | Page title |
| `twitter:description` | Meta description |
| `twitter:image` | Absolute image URL |

---

## Adding SEO to New Pages

### Pattern

SEO props flow through the layout chain:

```
Page → BaseLayout.astro → SEOHead.astro
```

1. **Page passes SEO props to the layout:**

```astro
---
// src/pages/your-page.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Page Title — Artist Name"
  description="Page meta description."
  image="/images/og-image.jpg"
  type="website"
>
  <!-- page content -->
</BaseLayout>
```

2. **BaseLayout forwards props to SEOHead:**

`BaseLayout.astro` passes `title`, `description`, `image`, `canonicalUrl`, `type`, `structuredData`, and `noindex` to `<SEOHead>`.

3. **For nested layouts (like ReleasesLayout):**

```
Page → ReleasesLayout → BaseLayout → SEOHead
```

`ReleasesLayout.astro` accepts the same SEO props and forwards them to `BaseLayout`.

### Structured Data on Release Pages

Release detail pages (`src/pages/releases/[slug].astro`) include album-level structured data:

```typescript
const albumSchema = generateMusicAlbumSchema(release.data, siteUrl);
```

Passed to the layout:
```astro
<ReleasesLayout
  title={`Artist — ${title}`}
  description={metaDescription}
  image={artwork}
  type={ogType}
  structuredData={albumSchema}
>
```

The `ogType` is determined by release type:
```typescript
const ogType = type === 'single' ? 'music.song' : 'music.album';
```
