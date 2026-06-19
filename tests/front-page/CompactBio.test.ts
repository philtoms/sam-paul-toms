// @vitest-environment node
/**
 * CompactBio component tests (behavioural).
 *
 * These tests render the `.astro` component via the Astro Container API
 * (`renderAstro`), passing both a typed prop (`summary`) and a default slot, and
 * assert on the real, parsed DOM. This is the second exemplar proving the
 * container-API pattern works for a prop + slot component.
 *
 * No `readFileSync` / source-substring assertions remain in this file.
 */
import { describe, it, expect } from 'vitest';
import { renderAstro } from '../helpers/renderAstro';
import CompactBio from '../../src/components/CompactBio.astro';

describe('CompactBio rendering', () => {
  async function renderCompactBio(summary = 'A short bio.') {
    return renderAstro(CompactBio, {
      props: { summary },
      slots: { default: '<p data-testid="child">child content</p>' },
    });
  }

  it('renders the summary text from the prop', async () => {
    const { document } = await renderCompactBio('A short bio.');
    expect(document.querySelector('p')?.textContent).toContain('A short bio.');
  });

  it('renders the about-modal-btn button', async () => {
    const { document } = await renderCompactBio();
    expect(document.querySelector('#about-modal-btn')).not.toBeNull();
  });

  it('renders a "Read more" button', async () => {
    const { document } = await renderCompactBio();
    const btn = document.querySelector('#about-modal-btn');
    expect(btn?.textContent).toContain('Read more');
  });

  it('renders child content via the default slot', async () => {
    const { document } = await renderCompactBio();
    expect(document.querySelector('[data-testid="child"]')).not.toBeNull();
  });

  it('renders the bio paragraph with text-lg (and not text-base)', async () => {
    const { document } = await renderCompactBio();
    const bio = document.querySelector('p');
    expect(bio).not.toBeNull();
    expect(bio!.className).toContain('text-lg');
    expect(bio!.className).not.toContain('text-base');
  });
});
