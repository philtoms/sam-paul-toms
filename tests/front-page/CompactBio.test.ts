/**
 * CompactBio component tests.
 *
 * Validates the CompactBio component's structure and props by checking
 * the component template. Integration tests (against the rendered page)
 * are covered by the homepage test suite after Step 7.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const componentPath = resolve(process.cwd(), 'src/components/CompactBio.astro');
const component = readFileSync(componentPath, 'utf-8');

describe('CompactBio component structure', () => {
  it('accepts required props: summary', () => {
    expect(component).toContain('summary');
    // Component uses a button to open an about modal instead of aboutUrl prop
    expect(component).toContain('about-modal-btn');
  });

  it('renders summary text from prop', () => {
    expect(component).toContain('{summary}');
  });

  it('renders "Read more" button with about-modal-btn', () => {
    expect(component).toContain('id="about-modal-btn"');
    expect(component).toContain('Read more');
  });

  it('accepts child content via default slot', () => {
    expect(component).toContain('<slot />');
  });

  it('renders bio paragraph with text-lg font size', () => {
    expect(component).toContain('text-lg');
    // Ensure the old text-base was removed from the paragraph
    expect(component).not.toContain('class="text-base leading-relaxed');
  });
});
