# Task: KB-002 - Project Scaffolding — Astro + Tailwind v4 + Cloudflare

**Created:** 2026-05-19
**Size:** M

## Review Level: 2 (Plan and Code)

**Assessment:** This task creates the entire project foundation from scratch — config files, dependencies, layout, and tooling. Everything downstream (KB-003 through KB-009) depends on it, so the plan and code both need review.
**Score:** 5/8 — Blast radius: 2, Pattern novelty: 1, Security: 0, Reversibility: 2

## Mission

Initialize an Astro project in `~/dev/sam` from a blank directory. The result must be a fully installable, buildable, dev-runnable project with the directory structure, base configuration, Tailwind CSS v4 styling (via `@tailwindcss/vite` — NOT the legacy `@astrojs/tailwind` integration), TypeScript strict mode, and developer tooling (linting, formatting). This is the foundation every subsequent task builds on.

## Dependencies

- **None**

## Context to Read First

- `~/dev/sam/docs/initial-research.md` — Sections 5–6 for recommended stack details (Astro, Tailwind, Cloudflare Pages)
- `~/dev/sam/.kb/tasks/KB-003/PROMPT.md` — downstream task expects `src/components/`, View Transitions support, and `.env.example` with `R2_PUBLIC_URL`
- `~/dev/sam/.kb/tasks/KB-004/PROMPT.md` — downstream task expects `src/content/` directory and Astro content collections support

## File Scope

- `package.json` (new)
- `astro.config.mjs` (new)
- `tsconfig.json` (new)
- `src/styles/global.css` (new)
- `src/layouts/BaseLayout.astro` (new)
- `src/pages/index.astro` (new)
- `src/content/config.ts` (new — placeholder content collection schema)
- `src/components/.gitkeep` (new — placeholder so directory survives git)
- `public/favicon.svg` (new)
- `.gitignore` (new)
- `.env.example` (new)
- `.prettierrc` (new)
- `eslint.config.mjs` (new)
- `README.md` (new)

## Steps

### Step 0: Preflight

- [ ] Working directory is `~/dev/sam` and is a git repository
- [ ] No `package.json` already exists (this is a greenfield scaffold)
- [ ] Node.js ≥ 18 is available (`node -v`)

### Step 1: Initialize Project and Install Dependencies

- [ ] Run `npm init -y` to create `package.json`, then modify it with project name `sam`, type `module`, and scripts: `dev` (`astro dev`), `build` (`astro build`), `preview` (`astro preview`), `lint` (`eslint .`), `format` (`prettier --write .`)
- [ ] Install Astro 5: `astro@^5` (version 5 is the current stable line; content collections API uses `glob()` loader)
- [ ] Install Astro integrations: `@astrojs/cloudflare` (for server-side rendering on Cloudflare Pages)
- [ ] Install Tailwind CSS v4 with Vite plugin: `tailwindcss` and `@tailwindcss/vite` — do **NOT** install `@astrojs/tailwind` (that is for v3 and conflicts with v4)
- [ ] Install dev tooling: `prettier`, `prettier-plugin-astro`, `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`
- [ ] Run `npm install` and confirm `node_modules` is populated with zero errors

**Artifacts:**
- `package.json` (new)

### Step 2: Configuration Files

- [ ] Create `astro.config.mjs` with:
  - `output: 'server'` (required for Cloudflare adapter)
  - `adapter: cloudflare()` from `@astrojs/cloudflare`
  - `vite.plugins: [tailwindCss()]` importing from `@tailwindcss/vite` — this is how Tailwind v4 integrates with Vite-based projects (not an Astro integration)
  - `srcDir: './src'`
- [ ] Create `tsconfig.json` with `extends: 'astro/tsconfigs/strict'`
- [ ] Create `.env.example` with `R2_PUBLIC_URL=http://localhost:8788/r2` and a comment noting this URL is for Wrangler's local R2 emulation (used in dev; KB-008 covers production R2 setup)
- [ ] Create `.gitignore` with standard entries: `node_modules/`, `dist/`, `.astro/`, `.env`, `.DS_Store`

**Artifacts:**
- `astro.config.mjs` (new)
- `tsconfig.json` (new)
- `.env.example` (new)
- `.gitignore` (new)

### Step 3: Directory Structure and Base Styles

- [ ] Create directories: `src/pages/`, `src/layouts/`, `src/components/`, `src/styles/`, `src/content/`, `public/`
- [ ] Create `src/components/.gitkeep` so the empty directory is tracked by git (KB-003 will populate it)
- [ ] Create `src/styles/global.css` with Tailwind v4 import and theme configuration:
  ```
  @import "tailwindcss";

  @theme {
    --color-bg: #0a0a0a;
    --color-text: #f5f5f5;
    --color-accent: #8b5cf6;
  }

  html {
    background-color: var(--color-bg);
    color: var(--color-text);
  }
  ```
  This uses Tailwind v4's CSS-first configuration (`@theme` block instead of a `tailwind.config.ts` file).
- [ ] Create `src/content/config.ts` with a placeholder `releases` collection using Astro 5's content collections API:
  - Import `defineCollection` from `astro:content` and `glob` loader from `astro:content`
  - Use `glob({ pattern: '**/*.md' })` loader pointing at content files
  - Define a Zod schema with fields: `title` (z.string()), `artist` (z.string()), `releaseDate` (z.date()), `type` (z.enum(['album', 'ep', 'single'])), `artwork` (z.string()), `tracks` (z.array(...)), `streamingLinks` (z.record(z.string())) — all required so downstream KB-004 has a complete schema to build on
  - Export `collections: { releases }`

**Artifacts:**
- `src/styles/global.css` (new)
- `src/content/config.ts` (new)
- `src/components/.gitkeep` (new)
- Directory structure created

### Step 4: Base Layout and Index Page

- [ ] Create `src/layouts/BaseLayout.astro` with:
  - `<html>`, `<head>`, `<body>` structure with `lang="en"`
  - `<meta charset="utf-8">`, viewport meta, `<meta name="generator" content={Astro.generator}>`
  - `<slot />` for page content
  - Global CSS imported (`../styles/global.css`)
  - A `<title>` prop that defaults to `"Sam — Music"`
- [ ] Create `src/pages/index.astro` that uses `BaseLayout` and renders a simple landing page with a heading ("Sam") and paragraph ("Music portfolio — coming soon.") confirming the project works
- [ ] Create `public/favicon.svg` — a minimal SVG favicon (simple music note or letter "S" glyph)

**Artifacts:**
- `src/layouts/BaseLayout.astro` (new)
- `src/pages/index.astro` (new)
- `public/favicon.svg` (new)

### Step 5: Developer Tooling Configuration

- [ ] Create `.prettierrc` with: `semi: true`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'all'`, `plugins: ['prettier-plugin-astro']`, `overrides` array for `*.astro` files
- [ ] Create `eslint.config.mjs` with TypeScript parser config and recommended rules (flat config format for ESLint v9+)
- [ ] Run `npx prettier --check .` and confirm no parse errors on all files
- [ ] Run `npx eslint .` and confirm it executes without crashing (warnings OK, config errors not OK)

**Artifacts:**
- `.prettierrc` (new)
- `eslint.config.mjs` (new)

### Step 6: Build Verification

> Full quality gate — the project must build and run.

- [ ] Run `npm run dev` and confirm Astro dev server starts without errors at `localhost:4321` (then kill it)
- [ ] Run `npm run build` and confirm it produces a `dist/` directory with exit code 0
- [ ] Confirm the built output includes the index page HTML with Tailwind utility classes applied
- [ ] Run `npm run lint` — must complete without fatal errors
- [ ] Run `npm run format -- --check .` — all files must pass formatting check

### Step 7: README and Documentation

- [ ] Create `README.md` with:
  - Project title ("Sam — Music Portfolio")
  - Tech stack summary (Astro 5, Tailwind CSS v4, Cloudflare Pages, TypeScript strict)
  - Quick start: `npm install`, `npm run dev`
  - Available scripts table (`dev`, `build`, `preview`, `lint`, `format`)
  - Directory structure overview
  - Link to `docs/initial-research.md` for background context

**Artifacts:**
- `README.md` (new)

### Step 8: Final Commit and Delivery

- [ ] Verify all files in File Scope exist and contain expected content
- [ ] Commit all files with message `feat(KB-002): scaffold Astro project with Tailwind v4 and Cloudflare config`
- [ ] Out-of-scope findings created as new tasks via `task_create` tool (if any)

## Documentation Requirements

**Must Update:**
- `README.md` — project setup, scripts, directory structure, tech stack

**Check If Affected:**
- `docs/initial-research.md` — read-only reference, do not modify

## Completion Criteria

- [ ] `npm install` succeeds with zero errors
- [ ] `npm run dev` starts Astro dev server
- [ ] `npm run build` produces `dist/` with exit code 0
- [ ] `npm run lint` and `npm run format` pass
- [ ] Directory structure matches: `src/{pages,layouts,components,styles,content}/`, `public/`
- [ ] `BaseLayout.astro` renders with Tailwind styles applied
- [ ] `astro.config.mjs` configures Cloudflare adapter and Tailwind v4 via `@tailwindcss/vite`
- [ ] `tsconfig.json` enables strict TypeScript
- [ ] `.env.example` includes `R2_PUBLIC_URL` with Wrangler local dev comment
- [ ] `src/content/config.ts` has `releases` collection with Zod schema using Astro 5 `glob()` loader
- [ ] No `tailwind.config.ts` or `tailwind.config.mjs` exists (v4 uses CSS `@theme` instead)
- [ ] No `@astrojs/tailwind` in `package.json` dependencies
- [ ] README.md is complete and accurate

## Git Commit Convention

Commits at step boundaries. All commits include the task ID:

- **Step completion:** `feat(KB-002): complete Step N — description`
- **Bug fixes:** `fix(KB-002): description`
- **Tooling:** `chore(KB-002): description`

## Do NOT

- Add pages or components beyond `index.astro` and `BaseLayout.astro` (downstream tasks handle this)
- Install `@astrojs/tailwind` — it is for Tailwind v3 and conflicts with v4
- Create a `tailwind.config.ts` or `tailwind.config.mjs` — Tailwind v4 uses CSS-based `@theme` configuration
- Configure content collections beyond the `releases` placeholder schema (KB-004 extends it)
- Set up audio player, releases, or bio features (KB-003, KB-004, KB-005)
- Deploy to Cloudflare (KB-008 handles deployment)
- Install wavesurfer.js, howler.js, or any audio-related packages (KB-003)
- Add analytics, SEO components, or design system tokens beyond base colors (KB-006, KB-007, KB-009)
- Modify `docs/initial-research.md`
- Use `npm create astro@latest` — scaffold manually for full control over every file
