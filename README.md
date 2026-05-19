# Sam — Music Portfolio

A music portfolio website for Sam, built with modern web technologies. Dark-themed, responsive, and designed to showcase music releases with an integrated audio player.

## Tech Stack

- **[Astro 5](https://astro.build)** — Static site framework with islands architecture
- **[Tailwind CSS v4](https://tailwindcss.com)** — Utility-first CSS with CSS-first configuration (`@theme` block)
- **[Cloudflare Pages](https://pages.cloudflare.com)** — Deployment platform with server-side rendering
- **TypeScript (strict)** — Type-safe development

## Quick Start

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`.

## Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start Astro dev server           |
| `npm run build`   | Build for production             |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run ESLint on source files       |
| `npm run format`  | Format all files with Prettier   |

## Directory Structure

```
sam/
├── public/             # Static assets (favicon, images)
├── src/
│   ├── components/     # Reusable UI components
│   ├── content/        # Astro content collections
│   │   └── releases/   # Release markdown files
│   ├── layouts/        # Page layouts
│   ├── pages/          # File-based routing
│   └── styles/         # Global CSS (Tailwind v4)
├── astro.config.mjs    # Astro + Cloudflare + Tailwind config
├── tsconfig.json       # TypeScript strict mode
└── .env.example        # Environment variable template
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `R2_PUBLIC_URL` — Base URL for Cloudflare R2 object storage (audio files, artwork)

## Background

See [`docs/initial-research.md`](docs/initial-research.md) for the full research report on platform comparison, design trends, and technology choices.
