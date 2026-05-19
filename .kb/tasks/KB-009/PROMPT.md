# Task: KB-009 - Analytics (Umami)

**Created:** 2026-05-19
**Size:** S

## Review Level: 1 (Plan Only)

**Assessment:** Small, well-scoped integration task — adds a conditional script tag to an existing layout and updates an env file. No complex logic or security concerns; plan review is sufficient.
**Score:** 2/8 — Blast radius: 0, Pattern novelty: 0, Security: 1, Reversibility: 1

## Mission

Integrate Umami analytics tracking into the Astro site so that page views and visitor behavior are tracked when the site runs in production. The script must only render when the required environment variables (`UMAMI_WEBSITE_ID` and `UMAMI_SRC`) are set, ensuring no broken requests during local development. Additionally, provide self-hosting documentation so the project owner can deploy Umami via Docker on their Linux server.

## Dependencies

- **Task:** KB-002 (project scaffolding) — must deliver `src/layouts/BaseLayout.astro` and `.env.example` before this task starts

## Context to Read First

- `src/layouts/BaseLayout.astro` — the file this task modifies to inject the Umami script
- `.env.example` — the file this task updates with Umami env vars
- `docs/initial-research.md` — Section 2, Nice-to-Have #13 for Umami rationale; Section 6 for recommended stack

## File Scope

- `src/layouts/BaseLayout.astro` (modified — add Umami script tag)
- `.env.example` (modified — add Umami env vars)
- `docs/analytics-setup.md` (new — Umami self-hosting guide)

## Steps

### Step 0: Preflight

- [ ] `src/layouts/BaseLayout.astro` exists (KB-002 delivered)
- [ ] `.env.example` exists (KB-002 delivered)
- [ ] `npm run build` passes with zero errors (project is healthy)

### Step 1: Add Umami Script to Base Layout

- [ ] Read `src/layouts/BaseLayout.astro` to understand its current `<head>` structure
- [ ] Add Umami tracking script block inside `<head>`, conditionally rendered only when both `UMAMI_WEBSITE_ID` and `UMAMI_SRC` environment variables are present:
  ```astro
  ---
  const umamiWebsiteId = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;
  const umamiSrc = import.meta.env.PUBLIC_UMAMI_SRC;
  const umamiEnabled = umamiWebsiteId && umamiSrc;
  ---
  {umamiEnabled && (
    <script
      async
      src={umamiSrc}
      data-website-id={umamiWebsiteId}
    ></script>
  )}
  ```
  **Important:** Use `PUBLIC_` prefixed env vars (`PUBLIC_UMAMI_WEBSITE_ID`, `PUBLIC_UMAMI_SRC`) because Astro only exposes `PUBLIC_*` environment variables to client-side code by default. The `import.meta.env` pattern is Astro's standard way to access env vars.
- [ ] Place the script block after existing meta tags but before the closing `</head>` tag
- [ ] Run `npm run build` to verify the layout still compiles without errors

**Artifacts:**
- `src/layouts/BaseLayout.astro` (modified)

### Step 2: Update Environment Configuration

- [ ] Append the following to `.env.example` (preserving existing content like `R2_PUBLIC_URL`):
  ```env
  # Umami Analytics (leave blank to disable tracking in development)
  PUBLIC_UMAMI_WEBSITE_ID=
  PUBLIC_UMAMI_SRC=
  ```
- [ ] Add a comment above the blank values explaining that `PUBLIC_UMAMI_SRC` is the full URL to the Umami tracking script (e.g., `https://analytics.example.com/script.js`) and `PUBLIC_UMAMI_WEBSITE_ID` is the UUID from the Umami dashboard
- [ ] Verify `.env.example` has no duplicate keys from the existing file

**Artifacts:**
- `.env.example` (modified)

### Step 3: Create Analytics Setup Documentation

- [ ] Create `docs/analytics-setup.md` with the following sections:
  1. **Overview** — Brief description of Umami (self-hosted, privacy-friendly, open-source analytics) and why it was chosen (per research Section 6)
  2. **Prerequisites** — Docker and Docker Compose installed on the Linux server
  3. **Docker Compose Setup** — Complete `docker-compose.yml` for Umami v2 using:
     - `ghcr.io/umami-software/umami:postgresql-latest` image
     - PostgreSQL 15 database with a named volume for persistence
     - `UMAMI_APP_SECRET` environment variable (instruct user to generate with `openssl rand -base64 32`)
     - `DATABASE_URL` connection string pointing to the PostgreSQL container
     - Port mapping (default `3000:3000`)
     - Restart policy `unless-stopped`
     - Health checks for both Umami and PostgreSQL
  4. **Configuration** — Steps to:
     - Copy the compose file to the server
     - Generate and set `UMAMI_APP_SECRET`
     - Run `docker compose up -d`
     - Access the dashboard at `http://your-server:3000`
     - Log in with default credentials (admin/umami) and change the password immediately
     - Add a new website in the dashboard to get the Website ID
  5. **Site Integration** — Reference the env vars (`PUBLIC_UMAMI_WEBSITE_ID` and `PUBLIC_UMAMI_SRC`) and explain how to set them in the Astro project and in the Cloudflare Pages deployment environment (for KB-008)
  6. **Production Deployment Tips** — Recommended reverse proxy setup (Caddy or Nginx) with HTTPS, firewall rules (expose only 80/443), and PostgreSQL backup strategy (`pg_dump` cron)
  7. **Troubleshooting** — Common issues: script not loading (check env vars), no data appearing (check Website ID and CORS), database connection failures (check `DATABASE_URL`)

**Artifacts:**
- `docs/analytics-setup.md` (new)

### Step 4: Testing & Verification

> ZERO test failures allowed. Full test suite as quality gate.

- [ ] Run `npm run build` — must succeed with exit code 0
- [ ] Run `npm run dev` and verify the page loads without console errors; confirm no Umami script is rendered (env vars not set)
- [ ] Set the env vars temporarily (e.g., `PUBLIC_UMAMI_WEBSITE_ID=test-id PUBLIC_UMAMI_SRC=https://example.com/script.js npm run dev`) and verify the Umami `<script>` tag appears in the rendered HTML `<head>` with correct `data-website-id` and `src` attributes
- [ ] Run `npm run build` with the test env vars and inspect the built HTML in `dist/` to confirm the script tag is present
- [ ] Run `npm run lint` — must pass with zero errors

### Step 5: Documentation & Delivery

- [ ] Verify `docs/analytics-setup.md` is complete and accurate
- [ ] Verify `.env.example` contains both `PUBLIC_UMAMI_WEBSITE_ID` and `PUBLIC_UMAMI_SRC` entries
- [ ] Verify `BaseLayout.astro` conditionally renders the Umami script only when env vars are set
- [ ] Out-of-scope findings created as new tasks via `task_create` tool (if any)

## Documentation Requirements

**Must Update:**
- `docs/analytics-setup.md` — new file with full Umami self-hosting guide

**Check If Affected:**
- `README.md` — no changes needed (analytics setup is documented in its own file)
- `.env.example` — updated with Umami env vars

## Completion Criteria

- [ ] `src/layouts/BaseLayout.astro` includes a conditional Umami `<script>` tag in `<head>` that only renders when both `PUBLIC_UMAMI_WEBSITE_ID` and `PUBLIC_UMAMI_SRC` are set
- [ ] `.env.example` includes `PUBLIC_UMAMI_WEBSITE_ID` and `PUBLIC_UMAMI_SRC` with explanatory comments
- [ ] `docs/analytics-setup.md` provides complete Docker Compose setup instructions for self-hosting Umami
- [ ] `npm run build` succeeds with and without Umami env vars set
- [ ] No Umami script renders when env vars are absent
- [ ] Umami script renders correctly when env vars are present
- [ ] All existing tests still pass

## Git Commit Convention

Commits at step boundaries. All commits include the task ID:

- **Step completion:** `feat(KB-009): complete Step N — description`
- **Bug fixes:** `fix(KB-009): description`
- **Docs:** `docs(KB-009): description`

## Do NOT

- Add analytics beyond the Umami script tag (no event tracking, custom events, etc.)
- Modify files outside the File Scope without good reason
- Hard-code analytics URLs or IDs — everything must come from environment variables
- Use non-`PUBLIC_` prefixed env vars (Astro won't expose them client-side)
- Set up actual Umami hosting (only document how to do it)
- Add any third-party analytics scripts (Google Analytics, Plausible, etc.)
- Modify pages or components other than `BaseLayout.astro`
- Commit without the task ID prefix
