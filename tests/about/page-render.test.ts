import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist/about/index.html');

describe.skipIf(!existsSync(distPath))('About page render', () => {
  let html: string;

  beforeAll(() => {
    html = readFileSync(distPath, 'utf-8');
  });

  it('contains an h1 element (bio section heading)', () => {
    expect(html).toContain('<h1');
    expect(html).toContain('About Sam');
  });

  it('contains genre tags matching frontmatter', () => {
    expect(html).toContain('Electronic');
    expect(html).toContain('Ambient');
    expect(html).toContain('Indie');
    expect(html).toContain('Experimental');
  });

  it('contains blockquote elements (press quotes)', () => {
    expect(html).toContain('<blockquote');
  });

  it('contains a form with aria-label="Contact form"', () => {
    expect(html).toContain('aria-label="Contact form"');
  });

  it('contains contact form input fields', () => {
    expect(html).toContain('type="text"');
    expect(html).toContain('type="email"');
    expect(html).toContain('<textarea');
  });

  it('contains a bio photo img element with correct alt text', () => {
    expect(html).toContain('<img');
    expect(html).toContain('alt="Sam performing live"');
  });

  it('contains press quote sources', () => {
    expect(html).toContain('The Wire');
    expect(html).toContain('Pitchfork');
    expect(html).toContain('Resident Advisor');
    expect(html).toContain('Bandcamp Daily');
  });

  it('contains section headings', () => {
    expect(html).toContain('Press');
    expect(html).toContain('Get In Touch');
  });
});
