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
  it('accepts required props: title, photo, photoAlt, summary, aboutUrl', () => {
    for (const prop of ['title', 'photo', 'photoAlt', 'summary', 'aboutUrl']) {
      expect(component).toContain(prop);
    }
  });

  it('renders photo with src and alt from props', () => {
    expect(component).toContain('src={photo}');
    expect(component).toContain('alt={photoAlt}');
  });

  it('renders summary text from prop', () => {
    expect(component).toContain('{summary}');
  });

  it('renders "Read more" link pointing to aboutUrl', () => {
    expect(component).toContain('href={aboutUrl}');
    expect(component).toContain('Read more');
  });

  it('uses circular photo crop with responsive sizes', () => {
    expect(component).toContain('rounded-full');
    expect(component).toContain('w-12');
    expect(component).toContain('w-16');
  });
});
