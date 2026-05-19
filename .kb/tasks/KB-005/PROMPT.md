# Task: KB-005 - Artist Bio / About Page

**Created:** 2026-05-19
**Size:** M

## Review Level: 1 (Plan Only)

**Assessment:** This task builds pages and components on top of the scaffolded Astro project. The content schema, page layout, and component interfaces are well-defined upfront. Risk is low — it's rendering read-only data from a content collection plus a static contact form.
**Score:** 3/8 — Blast radius: 1, Pattern novelty: 1, Security: 0, Reversibility: 1

## Mission

Build an About/Bio page showcasing Sam's artist identity: a hero photo alongside bio text, genre tag badges, press quotes displayed in a grid, and a contact form. The page uses Astro content collections for the bio content (enabling easy updates via Markdown) and follows the dark-mode-first design aesthetic established by KB-002. This is the primary personal connection point for visitors — fans, press, and booking agents.

## Dependencies

- **Task:** KB-002 (Project Scaffolding) — must be complete. This task assumes:
  - Astro 5 project exists in `~/dev/sam` with `package.json`, `astro.config.mjs`, `tsconfig.json`
  - Tailwind CSS v4 configured via `@tailwindcss/vite` (CSS-first, `@theme` block in `src/styles/global.css`)
  - `src/layouts/BaseLayout.astro` exists and is the shared page layout
  - `src/components/` and `src/content/` directories exist
  - Dark theme colors defined: `--color-bg: #0a0a0a`, `--color-text: #f5f5f5`, `--color-accent: #8b5cf6`

## Context to Read First

- `src/layouts/BaseLayout.astro` — layout to wrap the about page
- `src/styles/global.css` — Tailwind v4 theme variables to reuse (`--color-bg`, `--color-text`, `--color-accent`)
- `src/content/config.ts` — existing content collections; the `about` collection will be added here
- `astro.config.mjs` — project configuration (Astro 5, `output: 'server'`)
- `docs/initial-research.md` — Section 3 (design trends: dark mode, minimal typography, radical minimalism)

## File Scope

- `src/content/config.ts` (modified — add `about` collection schema)
- `src/content/about/bio.md` (new — bio content with frontmatter)
- `src/pages/about.astro` (new — main about page)
- `src/components/BioSection.astro` (new — photo + bio text layout)
- `src/components/GenreTags.astro` (new — genre badge/pill components)
- `src/components/PressQuotes.astro` (new — press quote display grid)
- `src/components/ContactForm.astro` (new — contact form with client-side validation)
- `public/images/bio/` (new — placeholder photo)
- `vitest.config.ts` (new — if not already created by another task)
- `tests/about/` (new — test files)

## Steps

### Step 0: Preflight

- [ ] KB-002 is complete: `package.json`, `astro.config.mjs`, `src/layouts/BaseLayout.astro`, `src/content/config.ts` all exist
- [ ] `npm run dev` starts without errors
- [ ] `src/content/` directory exists

### Step 1: Add About Content Collection Schema

- [ ] Modify `src/content/config.ts` to add an `about` collection alongside the existing `releases` collection. Use Astro 5's `glob()` loader:
  ```ts
  // Loader: glob({ pattern: '**/*.md', base: './src/content/about' })
  // Schema fields:
  //   title: z.string() — page heading (e.g. "About Sam")
  //   photo: z.string() — path to bio photo (relative to /images/ or full URL)
  //   photoAlt: z.string() — alt text for the photo
  //   genreTags: z.array(z.string()) — e.g. ["Electronic", "Ambient", "Indie"]
  //   pressQuotes: z.array(z.object({
  //     text: z.string() — the quote text
  //     source: z.string() — publication or reviewer name
  //     url: z.string().url().optional() — link to original article
  //   }))
  //   contactEmail: z.string().optional() — placeholder for content-author reference only.
  //     Actual email handling will be configured via a CONTACT_EMAIL environment variable
  //     or server-side config in a future task. Do NOT store real email addresses here
  //     since this file lives in a public git repo.
  ```
- [ ] The Markdown body of each about entry contains the bio text itself (rendered as HTML via Astro's `<Content />` component)
- [ ] Run `npx astro check` to confirm the schema has no type errors

**Artifacts:**
- `src/content/config.ts` (modified)

### Step 2: Create Sample Bio Content and Placeholder Assets

- [ ] Create `src/content/about/bio.md` with realistic fictional frontmatter:
  - `title: "About Sam"`
  - `photo: "/images/bio/sam-portrait.svg"` (placeholder)
  - `photoAlt: "Sam performing live"`
  - `genreTags: ["Electronic", "Ambient", "Indie", "Experimental"]`
  - `pressQuotes`: 3–4 sample quotes with source names and optional URLs
  - `contactEmail` omitted (or set to a clearly fake value like `"hello@example.com"`)
  - Body: 2–3 paragraphs of realistic artist bio text (musical background, influences, current work)
- [ ] Create `public/images/bio/` directory with a placeholder portrait image. Use a 600×800 SVG placeholder (solid dark background with "Sam" text or an abstract shape) named `sam-portrait.svg`.
- [ ] Run `npx astro check` to confirm the content file validates against the schema

**Artifacts:**
- `src/content/about/bio.md` (new)
- `public/images/bio/sam-portrait.svg` (new)

### Step 3: Build GenreTags Component

- [ ] Create `src/components/GenreTags.astro`:
  - Props: `tags: string[]`
  - Renders a horizontal flex-wrap list of badge/pill elements
  - Each pill: `rounded-full`, `bg-white/10` background, `text-sm`, `px-3 py-1`, subtle border `border-white/20`
  - Hover effect: background transitions to `bg-accent/20` and border to `border-accent/40` (Tailwind v4 automatically creates `accent` as a usable color from the `--color-accent` theme variable defined in `@theme`)
  - If `tags` array is empty, render nothing
- [ ] TypeScript props via `Astro.props` with proper type annotation
- [ ] Note: final styling values may be adjusted by KB-007 (Design System)

**Artifacts:**
- `src/components/GenreTags.astro` (new)

### Step 4: Build PressQuotes Component

- [ ] Create `src/components/PressQuotes.astro`:
  - Props: `quotes: Array<{ text: string; source: string; url?: string }>`
  - Renders a responsive grid: 1 col mobile, 2 cols `md:`, 3 cols `lg:`
  - Each quote rendered as a semantic `<figure>` containing a `<blockquote>` and `<figcaption>` with `<cite>`:
    - Large decorative opening quotation mark with `aria-hidden="true"` (so screen readers don't announce it as punctuation), styled with `text-accent`, `text-4xl`, `opacity-60`, positioned above the quote text
    - Quote text in `text-white/90`, `text-lg`, `italic` inside `<blockquote>`
    - Source attribution inside `<figcaption>`: `— <cite>Source Name</cite>` in `text-white/50`, `text-sm`
    - If `url` is provided, wrap the `<cite>` content in an `<a>` tag with `hover:text-accent` transition
  - Card container: `bg-white/5`, `rounded-lg`, `p-6`, subtle `border border-white/10`
  - If `quotes` array is empty, render nothing
- [ ] Note: final styling values may be adjusted by KB-007 (Design System)

**Artifacts:**
- `src/components/PressQuotes.astro` (new)

### Step 5: Build BioSection Component

- [ ] Create `src/components/BioSection.astro`:
  - Props: `photo: string`, `photoAlt: string`, `title: string`
  - Slot for bio text content (the rendered Markdown body)
  - Layout: two-column on `md:` and larger (photo left, text right), stacked on mobile (photo on top, text below)
  - Photo container: `md:w-2/5`, image rendered with `rounded-lg`, `object-cover`, max height constrained (`max-h-[500px]` or similar), subtle shadow (`shadow-2xl`)
  - Text container: `md:w-3/5`, `<h1>` with the title, then the slotted bio content with proper prose styling (`text-white/80`, `leading-relaxed`)
  - Mobile: photo takes full width, text below with `mt-8` spacing
- [ ] Note: final styling values may be adjusted by KB-007 (Design System)

**Artifacts:**
- `src/components/BioSection.astro` (new)

### Step 6: Build ContactForm Component

- [ ] Create `src/components/ContactForm.astro`:
  - No server-side action in this task — the form is a static HTML form with client-side validation only. The actual submission handler (Cloudflare Worker, Formspree, Resend, etc.) will be wired up in a future task.
  - Form fields:
    - Name (`<input type="text" required>`)
    - Email (`<input type="email" required>`)
    - Message (`<textarea rows="5" required>`)
  - Styling: inputs with `bg-white/10`, `border border-white/20`, `rounded-lg`, `px-4 py-3`, `text-white`, `placeholder:text-white/30`. Focus state: `focus:border-accent`, `focus:ring-1 focus:ring-accent`, `outline-none`
  - Submit button: `bg-accent`, `text-white`, `rounded-lg`, `px-6 py-3`, `font-medium`, hover: `brightness-110`, transition
  - Client-side validation via a small inline `<script>`:
    - On `submit` event, validate all fields are non-empty and email looks valid (basic regex)
    - Show inline error messages below each invalid field (red text, `text-red-400 text-sm`)
    - If valid, show a success message ("Message sent! We'll get back to you soon.") and reset the form
    - Since there's no backend yet, just simulate a successful submission (show success state, reset after 3 seconds)
  - Accessible: all inputs have associated `<label>` elements, form has `aria-label="Contact form"`
- [ ] Note: final styling values may be adjusted by KB-007 (Design System)

**Artifacts:**
- `src/components/ContactForm.astro` (new)

### Step 7: Assemble About Page

- [ ] Create `src/pages/about.astro`:
  - Import the `about` content collection entry via `getCollection('about')` and take the first entry (there should be only one: `bio.md`)
  - Import all four components: `BioSection`, `GenreTags`, `PressQuotes`, `ContactForm`
  - Wrap everything in `BaseLayout` with `<title>Sam — About</title>`
  - Page structure (top to bottom):
    1. **Bio Section:** `<BioSection>` with photo, alt, title props and the rendered Markdown body in the default slot (use `<Content />` component from Astro's content collections)
    2. **Genre Tags:** `<GenreTags>` with the `genreTags` array from frontmatter, rendered below the bio section with `mt-8`
    3. **Press Quotes:** `<h2>Press</h2>` heading followed by `<PressQuotes>` with the `pressQuotes` array, rendered in a `mt-16` section
    4. **Contact Form:** `<h2>Get In Touch</h2>` heading followed by `<ContactForm>`, rendered in a `mt-16` section with `max-w-2xl mx-auto` to center the form
  - Generous vertical spacing between sections (`mt-16` or `mt-20`)
  - Section headings: `<h2>` styled with `text-2xl font-bold text-white`, `mb-8`
- [ ] Add `export const prerender = true;` at the top of `src/pages/about.astro`. The project uses `output: 'server'` with the Cloudflare adapter (which produces a server bundle, not static HTML), but the about page is entirely static content with no server-side logic. Prerendering opts this page into static generation at build time, producing `dist/about/index.html` that the tests in Step 8 can assert against.
- [ ] Verify `/about` renders with all sections visible and correctly styled

**Artifacts:**
- `src/pages/about.astro` (new)

### Step 8: Testing & Verification

> ZERO test failures allowed. Full test suite as quality gate.

- [ ] Set up test infrastructure if not already present:
  - If `vitest.config.ts` already exists (from KB-003 or KB-004), reuse it
  - If not, install `vitest` and `jsdom`, create `vitest.config.ts` with `test.environment: 'jsdom'` and `test.globals: true`, and add `"test": "vitest run"` script to `package.json`
- [ ] Testing approach for Astro `.astro` components: **page-level integration tests**. Since Astro components compile through Astro's build pipeline and cannot be imported/rendered directly in JSDOM, tests operate against the built HTML output. The about page uses `export const prerender = true` (added in Step 7), so `npm run build` will produce `dist/about/index.html` as a static file. Tests parse this HTML to make assertions.
- [ ] Create `tests/about/content.test.ts`:
  - Test that the `about/bio.md` content file parses correctly: read the Markdown file, parse its frontmatter (any approach is fine — `gray-matter`, a simple YAML parser, or manual string splitting on `---` delimiters; installing a small parsing utility for content tests is allowed under the test-package exception in Do NOT)
  - Test that genreTags contains only strings, pressQuotes entries have text and source
  - Test that all pressQuotes URLs (if present) are valid URL strings
- [ ] Create `tests/about/page-render.test.ts`:
  - After a successful `npm run build`, read and parse `dist/about/index.html`
  - Assert the page contains an `<h1>` element (bio section heading)
  - Assert the page contains genre-related text matching the frontmatter genreTags
  - Assert the page contains `<blockquote>` elements (press quotes section)
  - Assert the page contains a `<form>` element with `aria-label="Contact form"`
  - Assert the page contains `<input type="text">`, `<input type="email">`, and `<textarea>` (contact form fields)
  - Assert the page contains a bio photo `<img>` element with the correct alt text
- [ ] Run `npm run build` — must succeed with exit code 0
- [ ] Run `npm run test` — all tests pass

**Artifacts:**
- `vitest.config.ts` (new, if not already present)
- `tests/about/content.test.ts` (new)
- `tests/about/page-render.test.ts` (new)

### Step 9: Documentation & Delivery

- [ ] Update `README.md` — add "About Page" section documenting the `about` content collection: frontmatter fields, how to update the bio, how to add/remove genre tags and press quotes, and a note that the contact form is frontend-only (no backend yet; actual submission handling is a future task)
- [ ] Verify all files in File Scope exist with correct content
- [ ] Commit with message: `feat(KB-005): add artist bio/about page with contact form`
- [ ] Out-of-scope findings created as new tasks via `task_create` tool (if any)

## Documentation Requirements

**Must Update:**
- `README.md` — add About Page section describing the `about` content collection, how to edit the bio, and the contact form's current status (frontend-only, no backend)

**Check If Affected:**
- `src/content/config.ts` — this file is directly modified to add the `about` collection

## Completion Criteria

- [ ] `src/content/config.ts` has an `about` collection schema with fields: title, photo, photoAlt, genreTags, pressQuotes, contactEmail
- [ ] `src/content/about/bio.md` exists with realistic sample content validating against the schema
- [ ] `/about` page renders with all sections: bio photo + text, genre tags, press quotes, contact form
- [ ] `BioSection` displays photo and bio text side-by-side on `md:` screens, stacked on mobile
- [ ] `GenreTags` renders genre badges as styled pills with hover effects
- [ ] `PressQuotes` renders quotes in a responsive grid (1/2/3 cols) with semantic `<blockquote>` + `<figcaption>` + `<cite>` markup
- [ ] `ContactForm` renders with name, email, message fields and client-side validation
- [ ] All components use TypeScript props with proper type annotations
- [ ] `npm run build` succeeds
- [ ] All tests pass (`npm run test`)
- [ ] README.md documents the about content collection

## Git Commit Convention

Commits at step boundaries. All commits include the task ID:

- **Step completion:** `feat(KB-005): complete Step N — description`
- **Bug fixes:** `fix(KB-005): description`
- **Tests:** `test(KB-005): description`

## Do NOT

- Implement server-side contact form submission (Cloudflare Worker / Formspree / Resend wiring is a future task)
- Build the audio player or integrate wavesurfer.js/howler.js (KB-003)
- Create release listing pages (KB-004)
- Add SEO meta tags, Open Graph, or JSON-LD structured data (KB-006)
- Modify the design system or global theme colors (KB-007)
- Set up Cloudflare deployment or R2 configuration (KB-008)
- Add analytics tracking (KB-009)
- Install packages unrelated to testing (test packages like `vitest` and `jsdom` are allowed if needed)
- Modify `docs/initial-research.md` or `docs/implementation-plan.md`
- Add CMS integration or admin UI
- Use React or Preact for components (pure Astro components are sufficient for this page)
