# Task: KB-007 - Dark Mode & Visual Design System

**Created:** 2026-05-19
**Size:** M

## Review Level: 1 (Plan Only)

**Assessment:** This task refines the visual design layer (CSS theme tokens, typography, animations) on top of the scaffolded Astro project. It does not alter application logic or data flow. Pattern novelty is low — it's CSS-first Tailwind v4 theming — and the changes are easily reversible by reverting the CSS file.
**Score:** 3/8 — Blast radius: 1, Pattern novelty: 1, Security: 0, Reversibility: 1

## Mission

Establish the complete visual design system for Sam's music portfolio: dark-mode-first color palette, typography scale using variable fonts, spacing conventions, responsive breakpoints, and micro-animations. This system provides all design tokens (CSS custom properties + Tailwind v4 `@theme` block) that every downstream task (KB-003 audio player, KB-004 release cards, KB-005 bio page, KB-006 SEO pages) consumes for consistent visual output. The aesthetic is dark, minimal, and music-focused — inspired by research findings in Section 3 of `docs/initial-research.md`.

## Dependencies

- **Task:** KB-002 (Project Scaffolding) — must be complete. This task assumes:
  - Astro 5 project exists in `~/dev/sam` with `package.json`, `astro.config.mjs`, `tsconfig.json`
  - Tailwind CSS v4 configured via `@tailwindcss/vite` (CSS-first, `@theme` block in `src/styles/global.css`)
  - `src/layouts/BaseLayout.astro` exists and is the shared page layout
  - `src/pages/index.astro` exists as the homepage
  - No `tailwind.config.ts` or `tailwind.config.mjs` exists (Tailwind v4 uses CSS `@theme` instead)
  - Initial theme colors exist in `src/styles/global.css`: `--color-bg: #0a0a0a`, `--color-text: #f5f5f5`, `--color-accent: #8b5cf6`

## Context to Read First

- `src/styles/global.css` — existing Tailwind v4 setup with `@import "tailwindcss"` and initial `@theme` block; this file is the primary target for expansion
- `src/layouts/BaseLayout.astro` — current layout structure; will receive typography and body-level design token updates
- `src/pages/index.astro` — homepage; will be updated to showcase the design system
- `astro.config.mjs` — current Vite plugin and integration config (no changes needed, but verify Tailwind v4 setup)
- `docs/initial-research.md` — Section 3 (design trends: dark mode, minimal typography, large album art, micro-animations)
- `.kb/tasks/KB-003/PROMPT.md` — audio player references `--color-bg`, `--color-text`, `--color-accent` from the theme
- `.kb/tasks/KB-004/PROMPT.md` — release cards use `bg-white/5`, hover scale, accent colors
- `.kb/tasks/KB-005/PROMPT.md` — bio page uses accent hover effects, `text-white/80`, `bg-white/10`

## File Scope

- `src/styles/global.css` (modified — expand `@theme` block with full design tokens, add keyframes, add base element styles)
- `src/layouts/BaseLayout.astro` (modified — add font loading, body-level typography classes, smooth scrolling)
- `src/pages/index.astro` (modified — update to showcase the design system with a visual demo section)
- `public/fonts/` (new — self-hosted variable font files or reference CDN URLs in layout)
- `tests/design-system/tokens.test.ts` (new — verify CSS custom properties and theme values render correctly)

## Steps

### Step 0: Preflight

- [ ] `~/dev/sam` is a git repository with KB-002 completed
- [ ] `src/styles/global.css` exists with `@import "tailwindcss"` and initial `@theme` block
- [ ] `src/layouts/BaseLayout.astro` exists
- [ ] `src/pages/index.astro` exists
- [ ] `npm run build` succeeds with zero errors
- [ ] No `tailwind.config.ts` or `tailwind.config.mjs` exists

### Step 1: Define Complete Color Palette

- [ ] Expand the `@theme` block in `src/styles/global.css` with a comprehensive dark-mode color palette:
  ```css
  @theme {
    /* Background layers — near-black with subtle warmth */
    --color-bg: #0a0a0a;          /* Page background */
    --color-bg-elevated: #141414;  /* Cards, panels, elevated surfaces */
    --color-bg-overlay: #1a1a1a;   /* Overlays, modals, dropdowns */

    /* Text hierarchy */
    --color-text: #f5f5f5;         /* Primary text */
    --color-text-secondary: #a3a3a3; /* Muted/secondary text */
    --color-text-tertiary: #737373;  /* Disabled/hint text */

    /* Accent — purple-violet, music-forward */
    --color-accent: #8b5cf6;       /* Primary accent */
    --color-accent-hover: #a78bfa; /* Lighter accent for hover states */
    --color-accent-muted: #8b5cf6; /* For Tailwind opacity utility usage (e.g., bg-accent/20) */

    /* Semantic colors */
    --color-success: #22c55e;
    --color-error: #ef4444;
    --color-warning: #f59e0b;

    /* Borders and dividers */
    --color-border: #262626;       /* Default border */
    --color-border-subtle: #1f1f1f; /* Subtle separators */

    /* Player-specific */
    --color-player-bg: rgba(10, 10, 10, 0.95);
    --color-player-border: rgba(255, 255, 255, 0.1);

    /* Typography scale */
    --font-display: "InterVariable", "Inter", system-ui, sans-serif;
    --font-body: "InterVariable", "Inter", system-ui, sans-serif;

    /* Font sizes (rem-based scale) */
    --text-xs: 0.75rem;      /* 12px */
    --text-sm: 0.875rem;     /* 14px */
    --text-base: 1rem;       /* 16px */
    --text-lg: 1.125rem;     /* 18px */
    --text-xl: 1.25rem;      /* 20px */
    --text-2xl: 1.5rem;      /* 24px */
    --text-3xl: 1.875rem;    /* 30px */
    --text-4xl: 2.25rem;     /* 36px */
    --text-5xl: 3rem;        /* 48px */
    --text-6xl: 3.75rem;     /* 60px */

    /* Spacing scale (consistent with Tailwind defaults, explicitly defined) */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-10: 2.5rem;
    --space-12: 3rem;
    --space-16: 4rem;
    --space-20: 5rem;
    --space-24: 6rem;

    /* Border radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-full: 9999px;

    /* Shadows (subtle, for dark mode) */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.6);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.7);

    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-base: 200ms ease;
    --transition-slow: 300ms ease;

    /* Z-index scale */
    --z-player: 50;
    --z-overlay: 40;
    --z-dropdown: 30;
    --z-base: 1;

    /* Breakpoints (informational — Tailwind v4 already handles responsive via sm/md/lg/xl/2xl) */
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    --breakpoint-2xl: 1536px;
  }
  ```
- [ ] All existing theme variables (`--color-bg`, `--color-text`, `--color-accent`) maintain their original values so downstream tasks (KB-003, KB-004, KB-005) that already reference them are not broken
- [ ] Verify `npm run build` still passes after theme expansion

**Artifacts:**
- `src/styles/global.css` (modified)

### Step 2: Add Animation Keyframes and Utility Classes

- [ ] Add CSS `@keyframes` blocks to `src/styles/global.css` (after the `@theme` block) for micro-animations:
  ```css
  /* Album art hover zoom */
  @keyframes artwork-zoom {
    from { transform: scale(1); }
    to { transform: scale(1.05); }
  }

  /* Play button morph — subtle pulse */
  @keyframes play-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }

  /* Fade in from below (for page sections) */
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Subtle shimmer for loading states */
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  /* Spin (for loading indicators) */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  ```
- [ ] Add Tailwind v4 custom animation utilities via `@theme` block (extend with `--animate-*` tokens):
  ```css
  /* Inside @theme block, add: */
  --animate-artwork-zoom: artwork-zoom 0.3s ease forwards;
  --animate-play-pulse: play-pulse 1.5s ease-in-out infinite;
  --animate-fade-in-up: fade-in-up 0.5s ease forwards;
  --animate-shimmer: shimmer 2s linear infinite;
  --animate-spin: spin 1s linear infinite;
  ```
- [ ] Add base element styles in `src/styles/global.css` (after keyframes):
  ```css
  /* Base element styles */
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    line-height: 1.6;
    min-height: 100dvh;
  }

  /* Focus visible styles — accessible keyboard navigation */
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* Selection highlight */
  ::selection {
    background-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
  }

  /* Scrollbar styling (WebKit) */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--color-bg);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: var(--radius-full);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-tertiary);
  }

  /* Image defaults */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Link defaults */
  a {
    color: inherit;
    text-decoration: none;
  }
  a:hover {
    color: var(--color-accent-hover);
  }
  ```
- [ ] Verify `npm run build` passes

**Artifacts:**
- `src/styles/global.css` (modified)

### Step 3: Typography Setup with Variable Fonts

- [ ] Choose and integrate **Inter** as the single variable font (serves both display and body roles — it's a high-quality variable font with weight axis from 100–900, matching the "minimal — one display font + one body font" requirement):
  - Use Google Fonts CDN link in `BaseLayout.astro` `<head>` for the variable font (no self-hosting needed for v1; avoids font file licensing complexity):
    ```html
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
    ```
  - This loads Inter variable font with the full weight range (100–900), enabling thin display headings and regular body text from a single font file
- [ ] Update `src/layouts/BaseLayout.astro`:
  - Add the Google Fonts `<link>` elements to `<head>` (before the global CSS import)
  - Add the font preloading `<link>` elements
  - Add base body classes: `class="bg-bg text-text antialiased"`
  - Ensure `<html>` has `lang="en"` (already present from KB-002, verify)
  - Add `min-h-screen` to the body or a wrapper div
- [ ] Update the `--font-display` and `--font-body` values in the `@theme` block to match:
  ```css
  --font-display: "Inter", system-ui, -apple-system, sans-serif;
  --font-body: "Inter", system-ui, -apple-system, sans-serif;
  ```
- [ ] Create `public/fonts/` directory (leave empty — placeholder for future self-hosted fonts if needed; the CDN approach is used for v1)
- [ ] Verify `npm run build` passes and the font loads correctly in `npm run dev`

**Artifacts:**
- `src/layouts/BaseLayout.astro` (modified)
- `src/styles/global.css` (modified — font family values)
- `public/fonts/` (new directory, empty)

### Step 4: Create Reusable Utility CSS Classes

- [ ] Add a section of reusable utility classes to `src/styles/global.css` for patterns that multiple components share:
  ```css
  /* === Reusable Component Patterns === */

  /* Card base — used by ReleaseCard, PressQuotes cards, etc. */
  .card {
    background-color: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    transition: transform var(--transition-base), box-shadow var(--transition-base);
  }
  .card:hover {
    transform: scale(1.02);
    box-shadow: var(--shadow-lg);
  }

  /* Album art container — maintains aspect ratio and overflow hidden for zoom */
  .artwork-container {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-lg);
    aspect-ratio: 1 / 1;
  }
  .artwork-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }
  .artwork-container:hover img {
    transform: scale(1.05);
  }

  /* Pill/badge — used by GenreTags, type badges */
  .pill {
    display: inline-flex;
    align-items: center;
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    background-color: color-mix(in srgb, var(--color-text) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--color-text) 20%, transparent);
    transition: background-color var(--transition-fast), border-color var(--transition-fast);
  }
  .pill:hover {
    background-color: color-mix(in srgb, var(--color-accent) 20%, transparent);
    border-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
  }

  /* Section spacing — consistent vertical rhythm */
  .section {
    padding-top: var(--space-16);
    padding-bottom: var(--space-16);
  }

  /* Container — max-width with horizontal padding */
  .container {
    width: 100%;
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }
  @media (min-width: 768px) {
    .container {
      padding-left: var(--space-6);
      padding-right: var(--space-6);
    }
  }
  @media (min-width: 1024px) {
    .container {
      padding-left: var(--space-8);
      padding-right: var(--space-8);
    }
  }

  /* Heading styles */
  .heading-1 {
    font-family: var(--font-display);
    font-size: var(--text-4xl);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
  @media (min-width: 768px) {
    .heading-1 {
      font-size: var(--text-5xl);
    }
  }

  .heading-2 {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: var(--color-text);
  }

  .heading-3 {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-text);
  }

  /* Truncated text — single line */
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  ```
- [ ] These classes use the design tokens from the `@theme` block, ensuring consistency
- [ ] Verify `npm run build` passes

**Artifacts:**
- `src/styles/global.css` (modified)

### Step 5: Update Homepage to Showcase Design System

- [ ] Update `src/pages/index.astro` to serve as a living showcase of the design system (this page will be replaced later but validates that all tokens work):
  - Use `BaseLayout` with title "Sam — Music"
  - Render a visual demo page with sections that exercise every design token category:
    1. **Hero section** with `heading-1` class displaying "Sam" and a subtitle with `text-text-secondary`
    2. **Color swatches** — a row of small colored divs showing: `bg-bg`, `bg-bg-elevated`, `bg-bg-overlay`, `bg-accent`, `bg-success`, `bg-error`, `bg-warning`
    3. **Typography scale** — show each heading level (h1–h3) and body text with `text-text`, `text-text-secondary`, `text-text-tertiary`
    4. **Card example** — a `card` class div with some content, demonstrating hover effect
    5. **Artwork container** — an `artwork-container` div with a placeholder image (use the favicon SVG or a simple colored div), demonstrating hover zoom
    6. **Pill examples** — 3–4 `pill` elements with sample text (e.g., "Electronic", "Ambient", "Indie")
    7. **Animation examples** — a small div with `animate-fade-in-up` demonstrating the animation
  - Each section uses the `section` and `container` classes for spacing
  - Keep it minimal — this is a design token validation page, not a polished landing page
- [ ] Verify the page renders correctly at `localhost:4321` with all tokens applied and animations working

**Artifacts:**
- `src/pages/index.astro` (modified)

### Step 6: Testing & Verification

> ZERO test failures allowed. Full test suite as quality gate.

- [ ] Set up test infrastructure if not already present:
  - If `vitest.config.ts` already exists (from KB-003 or KB-004), reuse it
  - If not, install `vitest` and `jsdom`, create `vitest.config.ts` with `test.environment: 'jsdom'` and `test.globals: true`, and add `"test": "vitest run"` script to `package.json`
- [ ] Create `tests/design-system/tokens.test.ts`:
  - Read `src/styles/global.css` as a string
  - **Color palette tests:** Assert the file contains every color variable (`--color-bg`, `--color-bg-elevated`, `--color-bg-overlay`, `--color-text`, `--color-text-secondary`, `--color-text-tertiary`, `--color-accent`, `--color-accent-hover`, `--color-success`, `--color-error`, `--color-warning`, `--color-border`, `--color-border-subtle`)
  - **Typography tests:** Assert `--font-display` and `--font-body` are defined; assert the full font size scale is present (`--text-xs` through `--text-6xl`)
  - **Spacing tests:** Assert the spacing scale is present (`--space-1` through `--space-24`)
  - **Animation tests:** Assert all keyframe definitions exist (`artwork-zoom`, `play-pulse`, `fade-in-up`, `shimmer`, `spin`)
  - **Utility class tests:** Assert all reusable classes are defined (`.card`, `.artwork-container`, `.pill`, `.section`, `.container`, `.heading-1`, `.heading-2`, `.heading-3`)
  - **Original token preservation:** Assert `--color-bg: #0a0a0a`, `--color-text: #f5f5f5`, `--color-accent: #8b5cf6` — the exact original values from KB-002 must be unchanged
- [ ] Run `npm run build` — must succeed with zero errors
- [ ] Run `npm run test` (or `npx vitest run`) — all tests pass
- [ ] Manual visual verification in browser: `npm run dev` → confirm dark background, Inter font loads, accent color renders, card hover effect works, artwork zoom works, pills have hover state, page is responsive (resize browser)

**Artifacts:**
- `tests/design-system/tokens.test.ts` (new)
- `vitest.config.ts` (new, if not already present)

### Step 7: Documentation & Delivery

- [ ] Update `README.md` — add "Design System" section documenting:
  - Color palette: list all color tokens with their purpose (bg levels, text hierarchy, accent, semantic, borders)
  - Typography: font choice (Inter variable), heading classes (`.heading-1`, `.heading-2`, `.heading-3`), text size scale
  - Spacing: the `--space-*` scale and when to use each level
  - Animations: available keyframes and their utility classes (`.animate-artwork-zoom`, etc.)
  - Reusable classes: `.card`, `.artwork-container`, `.pill`, `.section`, `.container`
  - How to use design tokens: reference `var(--color-*)` for custom CSS, use Tailwind utility classes (`bg-accent`, `text-text-secondary`) for inline styling
  - Responsive approach: mobile-first, Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- [ ] Verify all files in File Scope exist with correct content
- [ ] Commit with message: `feat(KB-007): establish visual design system with dark mode, typography, and animations`
- [ ] Out-of-scope findings created as new tasks via `task_create` tool (if any)

## Documentation Requirements

**Must Update:**
- `README.md` — add Design System section: color palette, typography scale, spacing, animations, reusable CSS classes, responsive approach

**Check If Affected:**
- `src/styles/global.css` — this file is the primary deliverable, not just documentation
- `src/layouts/BaseLayout.astro` — modified for font loading and body classes

## Completion Criteria

- [ ] `src/styles/global.css` contains a complete `@theme` block with all design tokens: colors (bg, text, accent, semantic, borders), font families, font sizes, spacing scale, border radii, shadows, transitions, z-index scale, breakpoints
- [ ] CSS custom properties for the full color palette exist and the original KB-002 values (`--color-bg: #0a0a0a`, `--color-text: #f5f5f5`, `--color-accent: #8b5cf6`) are unchanged
- [ ] Five animation keyframes defined: `artwork-zoom`, `play-pulse`, `fade-in-up`, `shimmer`, `spin`
- [ ] Base element styles set: smooth scrolling, antialiased text, dark body background, focus-visible outline, selection highlight, custom scrollbar, image/link defaults
- [ ] Inter variable font loads via Google Fonts CDN in `BaseLayout.astro`
- [ ] Reusable CSS classes exist: `.card`, `.artwork-container`, `.pill`, `.section`, `.container`, `.heading-1`, `.heading-2`, `.heading-3`
- [ ] `BaseLayout.astro` has font preconnect links, Google Fonts stylesheet, and body classes (`bg-bg text-text antialiased`)
- [ ] `src/pages/index.astro` showcases all design token categories
- [ ] `npm run build` succeeds with zero errors
- [ ] All tests pass (`npm run test`)
- [ ] No `tailwind.config.ts` or `tailwind.config.mjs` exists
- [ ] README.md documents the design system

## Git Commit Convention

Commits at step boundaries. All commits include the task ID:

- **Step completion:** `feat(KB-007): complete Step N — description`
- **Bug fixes:** `fix(KB-007): description`
- **Tests:** `test(KB-007): description`

## Do NOT

- Create a `tailwind.config.ts` or `tailwind.config.mjs` — Tailwind v4 uses CSS-first `@theme` configuration
- Install `@astrojs/tailwind` — it is for Tailwind v3 and conflicts with v4
- Add a light mode theme or color-scheme toggle (v1 is dark-mode-only; a toggle can be added in a future task)
- Build actual page content beyond the design system showcase (KB-004, KB-005 handle real pages)
- Create the audio player, release cards, or bio components (KB-003, KB-004, KB-005)
- Add SEO meta tags or structured data (KB-006)
- Set up deployment or R2 configuration (KB-008)
- Add analytics tracking (KB-009)
- Modify `docs/initial-research.md` or `docs/implementation-plan.md`
- Install additional npm packages beyond test tooling (the design system is pure CSS)
- Self-host font files in `public/fonts/` (CDN approach is used for v1; self-hosting can be a future optimization)
- Change the original KB-002 theme color values (`--color-bg`, `--color-text`, `--color-accent`)
