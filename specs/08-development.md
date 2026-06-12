# 08 — Development

**Last updated:** 2026-06-12

**Purpose:** Documents prerequisites, local dev setup, npm scripts, helper scripts, and linting/formatting configuration.

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | ≥ 18 | Required by Astro 5 and Cloudflare adapter |
| npm | bundled with Node | Package manager |
| ffmpeg | any recent version | Required for audio-related scripts (`generate-waveforms`, `generate-sample-audio`, `wav2mp3`) |

Install ffmpeg:
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg
```

---

## Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your values (R2_PUBLIC_URL, etc.)

# 3. Generate sample audio for local development
npm run generate:sample-audio
# Creates synthetic MP3s in public/audio-samples/

# 4. Set R2_PUBLIC_URL for local audio
# In .env, set: R2_PUBLIC_URL=http://localhost:4321/audio-samples

# 5. Start dev server
npm run dev
# Server starts at http://localhost:4321
```

---

## Local Audio Development

Audio files are served from Cloudflare R2 in production, not from the Astro app. For local development, there are two approaches:

### Option 1: Synthetic Sample Audio (Recommended)

```bash
# Generate for releases (default)
npm run generate:sample-audio

# Generate for works (separate invocation required)
node scripts/generate-sample-audio.cjs src/content/works
```

- By default, reads only `src/content/releases/*.md`. **Works content requires a separate invocation** (see command above).
- Generates synthetic MP3 files of the correct duration using ffmpeg sine wave sources
- Each track gets unique frequencies (100–400 Hz range) for varied waveforms
- Files are written to `public/audio-samples/` maintaining the directory structure
- Idempotent: skips files whose duration already matches

Set in `.env`:
```
R2_PUBLIC_URL=http://localhost:4321/audio-samples
```

### Option 2: Wrangler R2 Emulation

Use Wrangler's built-in R2 emulation to serve actual audio files locally:

```bash
npx wrangler pages dev --r2=bucket-name
```

Set in `.env`:
```
R2_PUBLIC_URL=http://localhost:4321/r2
```

This requires actual audio files in the R2 bucket.

### Cleaning Up Build Artifacts

The `clean-dist-audio.mjs` script runs as part of `npm run build` to remove `public/audio-samples` from the build output. This prevents ~1 GB of sample audio from being deployed to Cloudflare Pages.

---

## npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `astro dev` | Start development server at `:4321` with hot reload |
| `build` | `node scripts/fetch-instagram-oembed.mjs && astro build && node scripts/clean-dist-audio.mjs` | Production build (fetch thumbnails → build → clean audio) |
| `fetch:oembed` | `node scripts/fetch-instagram-oembed.mjs` | Fetch Instagram thumbnails only |
| `preview` | `astro preview` | Preview production build locally |
| `test` | `vitest run` | Run tests once |
| `test:watch` | `vitest` | Run tests in watch mode |
| `lint` | `eslint .` | Lint all JS/TS files |
| `format` | `prettier --write .` | Format all files with Prettier |
| `generate:waveforms` | `R2_PUBLIC_URL=${R2_PUBLIC_URL:-public/audio-samples} node scripts/generate-waveforms.cjs` | Generate waveform peak JSON from audio files |
| `generate:sample-audio` | `node scripts/generate-sample-audio.cjs` | Generate synthetic MP3s for local dev |
| `wav2mp3` | `node scripts/wav2mp3.cjs` | Convert WAV files to MP3 |
| `clean:worktrees` | `git worktree list --porcelain \| grep '^worktree ' \| grep -v $(pwd) \| ...` | Remove all non-current git worktrees and delete `kb/*` branches (development utility for task board workflow) |

---

## Helper Scripts

### `scripts/generate-sample-audio.cjs`

**Purpose:** Creates synthetic MP3 files for local audio development.

**How it works:**
1. Reads content files via `gray-matter` from a single directory (default: `src/content/releases`)
2. Extracts `audioFile` paths and `duration` strings from frontmatter
3. Generates MP3 files using ffmpeg's sine wave source with per-track frequencies
4. Writes to `public/audio-samples/` maintaining directory structure
5. Skips files that already exist with matching duration (idempotent)

**Usage:**
```bash
npm run generate:sample-audio
# or with custom paths:
node scripts/generate-sample-audio.cjs [content-dir] [output-dir]
```

### `scripts/generate-waveforms.cjs`

**Purpose:** Pre-computes waveform peak data as JSON for the SVG waveform renderer.

**How it works:**
1. Reads content files from `src/content/works/` and `src/content/releases/`
2. Extracts `audioFile` paths from frontmatter
3. Fetches audio from `R2_PUBLIC_URL` (or local `public/audio-samples/`)
4. Decodes audio via ffmpeg to get raw PCM samples
5. Computes ~200 normalized peak values (0–1 range)
6. Writes JSON to `public/waveforms/{relative-path}.json`

**Output format:**
```json
{ "peaks": [0.12, 0.45, 0.78, ...], "duration": 222 }
```

**Usage:**
```bash
npm run generate:waveforms
# R2_PUBLIC_URL defaults to public/audio-samples if not set
```

### `scripts/fetch-instagram-oembed.mjs`

**Purpose:** Fetches Instagram thumbnail URLs at build time for gallery items.

**How it works:**
1. Reads gallery markdown files from `src/content/gallery/`
2. Finds items with `type: instagram` and an `instagramUrl`
3. Calls Instagram oEmbed API with `INSTAGRAM_ACCESS_TOKEN`
4. Writes the thumbnail URL back into the frontmatter's `thumbnail` field
5. Optionally caches responses in `INSTAGRAM_OEMBED_CACHE_DIR` (7-day expiry)

**Usage:**
```bash
npm run fetch:oembed
# Requires INSTAGRAM_ACCESS_TOKEN in environment
```

### `scripts/clean-dist-audio.mjs`

**Purpose:** Removes `dist/audio-samples/` after build to prevent deploying sample audio.

**How it works:** Deletes `dist/audio-samples` directory recursively. Runs automatically as the final step in `npm run build`.

### `scripts/wav2mp3.cjs`

**Purpose:** Converts WAV files to MP3 format using ffmpeg.

**How it works:**
1. Accepts a single `.wav` file or directory path
2. Recursively finds all `.wav` files
3. Converts each using ffmpeg (libmp3lame codec)
4. Writes `.mp3` files alongside originals
5. Skips files where `.mp3` already exists and is newer (incremental)

**Usage:**
```bash
npm run wav2mp3 -- path/to/wav/files/
```

### `scripts/setup-dev-audio.sh` *(Legacy)*

**Status:** Superseded by `generate-sample-audio.cjs`

Generates 3-second silent placeholder MP3 files. The newer `generate-sample-audio.cjs` is preferred because it creates audio of the correct duration with actual audio content for realistic waveforms.

### `scripts/convert-polaroid-frames.py` *(Utility)*

**Status:** One-off asset conversion utility

Python script used to convert/process polaroid frame images for the `MediaCarousel` component. Not part of the regular build pipeline.

### `scripts/generate-waveforms.ts` *(Unused)*

**Status:** TypeScript source file — the actual runtime uses the `.cjs` version

This file exists as a TypeScript source but the build uses `generate-waveforms.cjs` (CommonJS).

---

## Linting and Formatting

### ESLint

Configuration in `eslint.config.mjs`:

- **Parser:** `@typescript-eslint/parser`
- **Plugin:** `@typescript-eslint/eslint-plugin` with recommended rules
- **File scope:** `**/*.{ts,tsx,js,jsx}`
- **Ignored:** `dist/`, `.astro/`, `node_modules/`

```bash
npm run lint    # Check all files
```

### Prettier

Configuration in `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

Key settings:
- Semicolons required
- Single quotes for JS/TS strings
- 2-space indentation
- Trailing commas on all multi-line structures
- `prettier-plugin-astro` provides `.astro` file formatting

```bash
npm run format  # Format all files in place
```
