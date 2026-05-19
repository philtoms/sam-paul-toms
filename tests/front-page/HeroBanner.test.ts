/**
 * HeroBanner component and homepage layout tests.
 *
 * Validates the fixed-position scroll-over parallax effect by checking
 * the hero component's structure and the homepage's <main> positioning.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const heroPath = resolve(process.cwd(), 'src/components/HeroBanner.astro');
const hero = readFileSync(heroPath, 'utf-8');

const indexPath = resolve(process.cwd(), 'src/pages/index.astro');
const index = readFileSync(indexPath, 'utf-8');

describe('HeroBanner fixed-position structure', () => {
  it('uses fixed positioning pinned to the top of the viewport', () => {
    expect(hero).toContain('fixed');
    expect(hero).toContain('top-0');
    expect(hero).toContain('left-0');
    expect(hero).toContain('right-0');
  });

  it('has z-index 0 to sit behind main content', () => {
    expect(hero).toContain('z-0');
  });

  it('retains responsive hero heights (40dvh mobile, 60dvh desktop)', () => {
    expect(hero).toContain('h-[40dvh]');
    expect(hero).toContain('md:h-[60dvh]');
  });

  it('retains the scroll-driven opacity/transform JS', () => {
    expect(hero).toContain('scrollY');
    expect(hero).toContain('opacity');
    expect(hero).toContain('scale');
  });

});

describe('Homepage scroll-over layout', () => {
  it('main element has higher z-index to render above the fixed hero', () => {
    expect(index).toMatch(/<main[^>]*z-10/);
  });

  it('main element has transparent background so hero shows through during scroll', () => {
    expect(index).not.toMatch(/<main[^>]*bg-bg/);
  });

  it('main element has margin-top matching hero height for scroll-over effect', () => {
    expect(index).toMatch(/<main[^>]*mt-\[40dvh\]/);
    expect(index).toMatch(/<main[^>]*md:mt-\[60dvh\]/);
  });
});
