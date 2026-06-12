# Template Specification

**Last updated:** 2026-06-12

This `/specs` directory contains a complete set of generalized specification documents for the music portfolio template. These specs describe the design system, architecture, content model, component API, audio player, deployment process, configuration surface, and development workflow in an **artist-agnostic** way — so a new site can be forked from this template by swapping content, environment variables, and assets without touching the code structure.

## How to Use These Specs

1. Start with [01-architecture.md](./01-architecture.md) to understand the overall system.
2. Follow the [New Site Checklist](./07-configuration.md#new-site-checklist) in the configuration spec to fork this template for a new artist.
3. Refer to individual specs as needed when modifying or extending a specific area.

## Spec Index

| # | Document | Purpose |
|---|----------|---------|
| 01 | [Architecture](./01-architecture.md) | Tech stack, project structure, islands architecture, SSR mode, data flow |
| 02 | [Design System](./02-design-system.md) | CSS custom properties, Tailwind v4 config, reusable classes, color swatches |
| 03 | [Content Model](./03-content-model.md) | Content collections, Zod schemas, frontmatter examples, content relationships |
| 04 | [Components](./04-components.md) | Full component catalog, props interfaces, modal pattern, custom events |
| 05 | [Audio Player](./05-audio-player.md) | Player architecture, store/engine/renderer, event API, waveform generation |
| 06 | [Deployment](./06-deployment.md) | Cloudflare Pages + R2, environment variables, build pipeline, cost structure |
| 07 | [Configuration](./07-configuration.md) | Template customization, env vars, new site checklist |
| 08 | [Development](./08-development.md) | Local setup, npm scripts, helper scripts, linting/formatting |
| 09 | [Testing](./09-testing.md) | Test framework, directory structure, test categories, commands |
| 10 | [SEO](./10-seo.md) | SEOHead component, structured data, sitemap, Open Graph, Twitter Cards |
