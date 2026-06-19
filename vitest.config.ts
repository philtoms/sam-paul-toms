import { getViteConfig } from 'astro/config';

// `getViteConfig` is Astro's officially-supported bridge to vitest: it wraps the
// user config in Astro's vite plugin pipeline (reading `astro.config.mjs`) so
// `.astro` files import and compile correctly inside vitest, and the Astro
// Container API can server-render them. The `@astrojs/preact` integration in
// `astro.config.mjs` re-adds the Preact vite plugin automatically via Astro's
// config-setup hooks, so we deliberately do NOT add a manual `preact()` plugin
// here (doubling it up risks plugin conflicts).
//
// No default `test.environment` is set: per-file `// @vitest-environment`
// annotations drive the environment — `jsdom` for Preact `.tsx` component
// tests, `node` for Astro Container API render tests.
//
// Note: `getViteConfig` is statically typed against plain Vite's `UserConfig`,
// which does not include vitest's `test` property. The object is therefore cast
// to the parameter type so `astro check`/`tsc` accept it; vitest reads the `test`
// key at runtime regardless (the full suite passes through this config).
export default getViteConfig({
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/setup.ts'],
    globals: true,
  },
} as Parameters<typeof getViteConfig>[0]);
