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

  it('uses aspect-ratio for responsive hero heights (16/9 mobile, 21/9 desktop)', () => {
    expect(hero).toContain('aspect-[16/9]');
    expect(hero).toContain('md:aspect-[21/9]');
  });

  it('retains the scroll-driven opacity/transform JS', () => {
    expect(hero).toContain('scrollY');
    expect(hero).toContain('opacity');
    expect(hero).toContain('scale');
  });

  it('uses a starting scale greater than 1.0 so image overflows and clips cleanly', () => {
    // Scale starts at 1.1, ensuring the image always fills the container
    expect(hero).toContain('1.1');
  });

  it('applies a cubic ease-out function to the scroll fraction', () => {
    // The ease-out formula 1 - (1 - t)³ is present
    expect(hero).toMatch(/1\s*-\s*Math\.pow\s*\(\s*1\s*-\s*t\s*,\s*3\s*\)/);
  });

  it('uses lerp-based inertia for post-scroll drift', () => {
    // Lerp factor 0.1 interpolates current towards target each frame
    expect(hero).toContain('0.1');
    expect(hero).toMatch(/current\s*\+=\s*\(target\s*-\s*current\)/);
  });

  it('drives animation via a requestAnimationFrame loop that self-terminates when settled', () => {
    // The loop re-schedules itself via rAF and clears rafId when converged
    expect(hero).toMatch(/rafId\s*=\s*requestAnimationFrame\(loop\)/);
    expect(hero).toContain('rafId = 0');
  });

  it('contains the banner cover image', () => {
    expect(hero).toContain('src="/images/banner/spt_low_res.png"');
    expect(hero).toContain('object-cover');
  });

  it('has a bottom fade gradient overlay blending into the page background', () => {
    expect(hero).toContain('hero-bottom-fade');
    expect(hero).toContain('bottom-0');
    expect(hero).toContain('left-0');
    expect(hero).toContain('right-0');
    // Gradient is defined in global.css via .hero-bottom-fade class
    // with explicit rgba() stops for mobile WebKit compatibility
  });

  it('clips children to the banner bounds with overflow-hidden', () => {
    expect(hero).toContain('overflow-hidden');
  });

  it('the hero image fills the container with h-full w-full object-cover', () => {
    const imgMatch = hero.match(/<img[^>]+>/);
    expect(imgMatch).not.toBeNull();
    const imgTag = imgMatch![0];
    expect(imgTag).toContain('h-full');
    expect(imgTag).toContain('w-full');
    expect(imgTag).toContain('object-cover');
  });
});

describe('Homepage scroll-over layout', () => {
  it('main element has higher z-index to render above the fixed hero', () => {
    expect(index).toMatch(/<main[^>]*z-10/);
  });

  it('main element has transparent background so hero shows through during scroll', () => {
    expect(index).not.toMatch(/<main[^>]*bg-bg/);
  });

  it('main element has margin-top matching hero aspect-ratio height minus section padding for scroll-over effect', () => {
    expect(index).toMatch(/<main[^>]*mt-\[calc\(100vw\*9\/16-4rem\)\]/);
    expect(index).toMatch(/<main[^>]*md:mt-\[calc\(100vw\*9\/21-4rem\)\]/);
  });
});
