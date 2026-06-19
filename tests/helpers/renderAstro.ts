// @vitest-environment node
/**
 * renderAstro — reusable helper for behavioural Astro component tests.
 *
 * Renders an `.astro` component via the Astro Container API
 * (`experimental_AstroContainer` from `astro/container`) to an HTML string,
 * then parses that string with the `jsdom` package so tests can assert on the
 * resulting DOM using `getAttribute('src')`, `className`, `querySelector`, etc.
 *
 * IMPORTANT — environment:
 * The `// @vitest-environment node` annotation at the top of this file (and of
 * every test that imports this helper) is load-bearing. The Astro Container API
 * must NOT run under a jsdom *test environment*: that combination triggers an
 * esbuild `TextEncoder`/`Uint8Array` invariant (see KB-136). The `jsdom`
 * *package* is safe to `import` here — it is used purely to parse the already-
 * rendered HTML string, not to host the test runtime.
 *
 * The `experimental_AstroContainer` instance is created once at module scope
 * (memoised promise) and shared across all calls in the same vitest worker.
 * `renderToString` is effectively stateless across calls for component-level
 * rendering, so a singleton is both safe and fast.
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
// jsdom v29 ships no bundled type declarations and `@types/jsdom` is not
// installed (it is a devDependency used only to parse rendered HTML here).
// Suppress the implicit-any error at the import; runtime usage is well-defined.
// @ts-expect-error no declaration file for module 'jsdom' (jsdom v29 ships none)
import { JSDOM } from 'jsdom';

// Built once per worker.
const containerPromise = AstroContainer.create();

// Index the *instance* type of the container class (not `typeof AstroContainer`,
// which is the constructor/static side). `renderToString` is an instance method.
type Component = Parameters<AstroContainer['renderToString']>[0];

type RenderOptions = {
  props?: Record<string, unknown>;
  slots?: Record<string, string>;
  partial?: boolean;
};

type RenderResult = {
  html: string;
  document: Document;
  // The instance type of `experimental_AstroContainer`.
  container: AstroContainer;
};

export async function renderAstro(
  Component: Component,
  options: RenderOptions = {},
): Promise<RenderResult> {
  const container = await containerPromise;
  const html = await container.renderToString(Component, options);
  const { window } = new JSDOM(html);
  return { html, document: window.document, container };
}
