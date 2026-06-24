# 02 — Design System

**Last updated:** 2026-06-12

**Purpose:** Documents the complete CSS design token system, Tailwind v4 configuration, accent color override mechanism, and reusable component classes.

---

## Overview

The design system is defined entirely in `src/styles/global.css` using CSS custom properties within a Tailwind v4 `@theme` block. There is no `tailwind.config.js` — all configuration is CSS-first. The system uses a dark-first color palette with a runtime-overridable accent color.

---

## Tailwind v4 Configuration

Tailwind v4 is configured via CSS-first approach:

```css
@import 'tailwindcss';

@theme {
  /* All design tokens defined here as CSS custom properties */
}
```

- **No `tailwind.config.js`** — the `@theme` block in `global.css` is the single source of truth
- The `@tailwindcss/vite` plugin is registered in `astro.config.mjs` as a Vite plugin
- Tailwind utility classes are available in all `.astro` and `.tsx` files
- Custom properties defined in `@theme` are accessible both as Tailwind utilities (e.g., `bg-bg`, `text-accent`) and as plain CSS variables (e.g., `var(--color-accent)`)

---

## Design Tokens

### Background Colors

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-bg` | `#0a0a0a` | Page background |
| `--color-bg-elevated` | `#141414` | Cards, panels, elevated surfaces |
| `--color-bg-overlay` | `#1a1a1a` | Overlays, modals, dropdowns |

### Text Hierarchy

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-text` | `#f5f5f5` | Primary text |
| `--color-text-secondary` | `#a3a3a3` | Muted/secondary text |
| `--color-text-tertiary` | `#737373` | Disabled/hint text |

### Accent Colors

| Variable | Default Hex | Usage |
|----------|------------|-------|
| `--color-accent` | `#eab308` | Primary accent (overridden at runtime by `PUBLIC_ACCENT_COLOR`) |
| `--color-accent-hover` | `#facc15` | Accent hover state (computed via `color-mix()`) |
| `--color-accent-muted` | `#eab308` | Muted accent (set to same as accent at runtime) |

**Runtime override:** See [Accent Color Override](#accent-color-override) below.

### Semantic Colors

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-success` | `#22c55e` | Success states |
| `--color-error` | `#ef4444` | Error states |
| `--color-warning` | `#f59e0b` | Warning states |

### Borders and Dividers

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-border` | `#262626` | Default borders |
| `--color-border-subtle` | `#1f1f1f` | Subtle separators |

### Player-Specific Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-player-bg` | `#2a2a2a` | Audio player bar background |
| `--color-player-border` | `rgba(255, 255, 255, 0.08)` | Audio player border |

### Typography Scale

| Variable | Size | Pixels |
|----------|------|--------|
| `--text-xs` | `0.75rem` | 12px |
| `--text-sm` | `0.875rem` | 14px |
| `--text-base` | `1rem` | 16px |
| `--text-lg` | `1.125rem` | 18px |
| `--text-xl` | `1.25rem` | 20px |
| `--text-2xl` | `1.5rem` | 24px |
| `--text-3xl` | `1.875rem` | 30px |
| `--text-4xl` | `2.25rem` | 36px |
| `--text-5xl` | `3rem` | 48px |
| `--text-6xl` | `3.75rem` | 60px |

**Font families:**

| Variable | Stack | Usage |
|----------|-------|-------|
| `--font-display` | `'Inter', system-ui, -apple-system, sans-serif` | Headings |
| `--font-body` | `'Inter', system-ui, -apple-system, sans-serif` | Body text |

### Spacing Scale

| Variable | Size |
|----------|------|
| `--space-1` | `0.25rem` |
| `--space-2` | `0.5rem` |
| `--space-3` | `0.75rem` |
| `--space-4` | `1rem` |
| `--space-5` | `1.25rem` |
| `--space-6` | `1.5rem` |
| `--space-8` | `2rem` |
| `--space-10` | `2.5rem` |
| `--space-12` | `3rem` |
| `--space-16` | `4rem` |
| `--space-20` | `5rem` |
| `--space-24` | `6rem` |

### Border Radius

| Variable | Size |
|----------|------|
| `--radius-sm` | `0.25rem` |
| `--radius-md` | `0.375rem` |
| `--radius-lg` | `0.5rem` |
| `--radius-xl` | `0.75rem` |
| `--radius-2xl` | `1rem` |
| `--radius-full` | `9999px` |

### Shadows

All shadows are designed for dark mode (dark backgrounds).

| Variable | Value |
|----------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.4)` |
| `--shadow-md` | `0 4px 6px rgba(0, 0, 0, 0.5)` |
| `--shadow-lg` | `0 10px 15px rgba(0, 0, 0, 0.6)` |
| `--shadow-xl` | `0 20px 25px rgba(0, 0, 0, 0.7)` |

### Transitions

| Variable | Value | Usage |
|----------|-------|-------|
| `--transition-fast` | `150ms ease` | Hover color changes |
| `--transition-base` | `200ms ease` | Card transforms, component transitions |
| `--transition-slow` | `300ms ease` | Image zooms, artwork hover |

### Z-Index Scale

| Variable | Value | Usage |
|----------|-------|-------|
| `--z-player` | `50` | Fixed audio player bar |
| `--z-overlay` | `40` | Modal backdrops |
| `--z-dropdown` | `30` | Dropdown menus |
| `--z-base` | `1` | Default stacking |

### Breakpoints

These are informational — Tailwind v4 handles responsive breakpoints via `sm:`, `md:`, `lg:`, `xl:`, `2xl:` prefixes.

| Variable | Value |
|----------|-------|
| `--breakpoint-sm` | `640px` |
| `--breakpoint-md` | `768px` |
| `--breakpoint-lg` | `1024px` |
| `--breakpoint-xl` | `1280px` |
| `--breakpoint-2xl` | `1536px` |

### Animations

| Variable | Keyframe | Duration | Usage |
|----------|----------|----------|-------|
| `--animate-artwork-zoom` | `artwork-zoom` | 0.3s ease | Album art hover zoom (scale 1 → 1.05) |
| `--animate-play-pulse` | `play-pulse` | 1.5s ease-in-out infinite | Play button pulse (scale 1 → 1.08 → 1) |
| `--animate-fade-in-up` | `fade-in-up` | 0.5s ease | Page section entrance (opacity 0→1, translateY 16px→0) |
| `--animate-shimmer` | `shimmer` | 2s linear infinite | Loading state shimmer |
| `--animate-spin` | `spin` | 1s linear infinite | Loading spinner (rotate 0→360deg) |

---

## Accent Color Override

The accent color is configurable per-site via the `PUBLIC_ACCENT_COLOR` environment variable. The override mechanism is implemented in `BaseLayout.astro`:

```astro
---
const accentColor = import.meta.env.PUBLIC_ACCENT_COLOR || '#eab308';
---
<html lang="en" style={`--color-accent: ${accentColor}; --color-accent-hover: color-mix(in srgb, var(--color-accent) 80%, white); --color-accent-muted: var(--color-accent);`}>
```

**How it works:**

1. `PUBLIC_ACCENT_COLOR` env var provides the hex value (e.g., `#852929`)
2. The `<html>` element's inline style sets three custom properties:
   - `--color-accent` → the raw env var value
   - `--color-accent-hover` → computed via `color-mix(in srgb, var(--color-accent) 80%, white)` (80% accent + 20% white for a lighter hover)
   - `--color-accent-muted` → same as accent color
3. All CSS and Tailwind utilities that reference `var(--color-accent)` automatically pick up the new value

**For JavaScript consumers** (canvas/SVG renderers that can't read CSS variables), `src/scripts/accent-color.ts` provides:
- `getAccentColor()` — reads `--color-accent` from computed styles, falls back to `#eab308`
- `getAccentHoverColor()` — reads `--color-accent-hover` from computed styles, falls back to `#facc15`

---

## Reusable Component Classes

### `.card`

Elevated card container with hover transform.

```css
.card {
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  /* hover: scale(1.02), shadow-lg */
}
```

**Used by:** `ReleaseCard.astro`, `ProjectGrid.astro` project cards

### `.artwork-container`

Maintains aspect-ratio 1:1 for album artwork with hover zoom.

```css
.artwork-container {
  overflow: hidden;
  border-radius: var(--radius-lg);
  aspect-ratio: 1 / 1;
  /* img: scale(1.05) on hover */
}
```

**Used by:** `ReleaseCard.astro`, `ProjectGrid.astro`

### `.pill`

Inline badge/tag with rounded-full shape.

```css
.pill {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  /* hover: accent background/border */
}
```

**Used by:** type badges

### `.section`

Consistent vertical rhythm for page sections.

```css
.section {
  padding-top: var(--space-16);
  padding-bottom: var(--space-16);
}
/* max-width: 430px → padding: var(--space-8) */
```

**Used by:** `index.astro` homepage sections

### `.container`

Max-width container with responsive horizontal padding.

```css
.container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  /* Responsive padding: space-4 → space-6 → space-8 */
}
```

### `.heading-1`, `.heading-2`, `.heading-3`

Typography heading styles with responsive sizing for `.heading-1`.

| Class | Size | Weight | Letter Spacing |
|-------|------|--------|---------------|
| `.heading-1` | `--text-4xl` (md: `--text-5xl`) | 800 | `-0.02em` |
| `.heading-2` | `--text-2xl` | 700 | `-0.01em` |
| `.heading-3` | `--text-xl` | 600 | — |

### `.truncate`

Single-line text truncation with ellipsis.

### `.hero-top-fade`, `.hero-bottom-fade`

Gradient overlays for the hero banner that blend into the page background (`--color-bg`).

- **`.hero-top-fade`** — top-to-transparent gradient (27% height)
- **`.hero-bottom-fade`** — transparent-to-bottom gradient (27% height)

**Used by:** `HeroBanner.astro`

---

## Base Element Styles

| Element | Styles |
|---------|--------|
| `html` | Smooth scroll, stable scrollbar gutter, antialiased font rendering, `--color-bg` background |
| `body` | `--color-bg` background, `--font-body`, `line-height: 1.6`, `min-height: 100dvh` |
| `:focus-visible` | `outline: 2px solid var(--color-accent)`, `outline-offset: 2px` |
| `::selection` | `background: color-mix(in srgb, var(--color-accent) 30%, transparent)` |
| `a` | `color: inherit`, no underline; hover: `color: var(--color-text)` |
| Scrollbar (WebKit) | 8px width, `--color-bg` track, `--color-border` thumb, full radius |

---

## Color Swatch Reference

Complete swatch table for visual reference:

| Variable | Hex / Value | Swatch | Context |
|----------|-------------|--------|---------|
| `--color-bg` | `#0a0a0a` | ■ Near-black | Page background |
| `--color-bg-elevated` | `#141414` | ■ Dark gray | Cards, panels |
| `--color-bg-overlay` | `#1a1a1a` | ■ Dark gray | Modals, overlays |
| `--color-text` | `#f5f5f5` | ■ Off-white | Primary text |
| `--color-text-secondary` | `#a3a3a3` | ■ Gray | Secondary text |
| `--color-text-tertiary` | `#737373` | ■ Dark gray | Hint text |
| `--color-accent` | `#eab308` (default) | ■ Yellow | Accent/brand |
| `--color-accent-hover` | `#facc15` (default) | ■ Light yellow | Accent hover |
| `--color-success` | `#22c55e` | ■ Green | Success |
| `--color-error` | `#ef4444` | ■ Red | Error |
| `--color-warning` | `#f59e0b` | ■ Amber | Warning |
| `--color-border` | `#262626` | ■ Dark gray | Borders |
| `--color-border-subtle` | `#1f1f1f` | ■ Near-black | Subtle borders |
| `--color-player-bg` | `#2a2a2a` | ■ Medium gray | Player bar |
| `--color-player-border` | `rgba(255,255,255,0.08)` | — | Player border |
