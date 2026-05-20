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
  it('accepts required props: summary, aboutUrl', () => {
    for (const prop of ['summary', 'aboutUrl']) {
      expect(component).toContain(prop);
    }
  });

  it('renders summary text from prop', () => {
    expect(component).toContain('{summary}');
  });

  it('renders "Read more" link pointing to aboutUrl', () => {
    expect(component).toContain('href={aboutUrl}');
    expect(component).toContain('Read more');
  });

  it('accepts child content via default slot', () => {
    expect(component).toContain('<slot />');
  });
});
