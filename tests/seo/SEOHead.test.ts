import { describe, it, expect } from 'vitest';
import { generateSEOTags } from '../../src/scripts/seo-helpers';
import type { SEOProps } from '../../src/scripts/seo-helpers';

const siteUrl = 'https://sampaultoms.com';

describe('generateSEOTags', () => {
  const baseProps: SEOProps = {
    title: 'Sam Paul Toms',
    description: 'Official music portfolio of Sam Paul Toms.',
    canonicalUrl: 'https://sampaultoms.com/',
    siteUrl,
  };

  it('produces <title> with correct content', () => {
    const tags = generateSEOTags(baseProps);
    const titleTag = tags.find((t) => t.type === 'title');
    expect(titleTag).toBeDefined();
    expect(titleTag!.content).toBe('Sam Paul Toms');
  });

  it('produces <meta name="description"> with correct content', () => {
    const tags = generateSEOTags(baseProps);
    const meta = tags.find(
      (t) => t.type === 'meta' && t.attrs?.name === 'description',
    );
    expect(meta).toBeDefined();
    expect(meta!.attrs!.content).toBe(
      'Official music portfolio of Sam Paul Toms.',
    );
  });

  it('produces <link rel="canonical"> with correct href', () => {
    const tags = generateSEOTags(baseProps);
    const link = tags.find(
      (t) => t.type === 'link' && t.attrs?.rel === 'canonical',
    );
    expect(link).toBeDefined();
    expect(link!.attrs!.href).toBe('https://sampaultoms.com/');
  });

  it('renders OG tags with correct values', () => {
    const tags = generateSEOTags(baseProps);
    const ogTitle = tags.find((t) => t.attrs?.property === 'og:title');
    const ogDesc = tags.find((t) => t.attrs?.property === 'og:description');
    const ogType = tags.find((t) => t.attrs?.property === 'og:type');
    const ogSiteName = tags.find((t) => t.attrs?.property === 'og:site_name');

    expect(ogTitle!.attrs!.content).toBe('Sam Paul Toms');
    expect(ogDesc!.attrs!.content).toBe(
      'Official music portfolio of Sam Paul Toms.',
    );
    expect(ogType!.attrs!.content).toBe('website');
    expect(ogSiteName!.attrs!.content).toBe('Sam Paul Toms');
  });

  it('renders Twitter Card tags with summary_large_image', () => {
    const tags = generateSEOTags(baseProps);
    const twitterCard = tags.find((t) => t.attrs?.name === 'twitter:card');
    const twitterTitle = tags.find((t) => t.attrs?.name === 'twitter:title');
    const twitterDesc = tags.find(
      (t) => t.attrs?.name === 'twitter:description',
    );

    expect(twitterCard!.attrs!.content).toBe('summary_large_image');
    expect(twitterTitle!.attrs!.content).toBe('Sam Paul Toms');
    expect(twitterDesc!.attrs!.content).toBe(
      'Official music portfolio of Sam Paul Toms.',
    );
  });

  it('renders structured data as a JSON-LD script tag', () => {
    const schema = { '@type': 'MusicAlbum', name: 'Test Album' };
    const tags = generateSEOTags({
      ...baseProps,
      structuredData: schema,
    });
    const script = tags.find(
      (t) => t.type === 'script' && t.attrs?.type === 'application/ld+json',
    );
    expect(script).toBeDefined();
    expect(script!.content).toBe(JSON.stringify(schema));
  });

  it('renders multiple structured data items when given an array', () => {
    const schemas = [
      { '@type': 'MusicAlbum', name: 'Album 1' },
      { '@type': 'MusicRecording', name: 'Track 1' },
    ];
    const tags = generateSEOTags({
      ...baseProps,
      structuredData: schemas,
    });
    const scripts = tags.filter(
      (t) => t.type === 'script' && t.attrs?.type === 'application/ld+json',
    );
    expect(scripts).toHaveLength(2);
  });

  it('adds robots noindex meta tag when noindex is true', () => {
    const tags = generateSEOTags({ ...baseProps, noindex: true });
    const robots = tags.find(
      (t) => t.type === 'meta' && t.attrs?.name === 'robots',
    );
    expect(robots).toBeDefined();
    expect(robots!.attrs!.content).toBe('noindex, nofollow');
  });

  it('does not add robots meta tag when noindex is false', () => {
    const tags = generateSEOTags(baseProps);
    const robots = tags.find(
      (t) => t.type === 'meta' && t.attrs?.name === 'robots',
    );
    expect(robots).toBeUndefined();
  });

  it('resolves relative image URL to absolute', () => {
    const tags = generateSEOTags({
      ...baseProps,
      image: '/images/art.svg',
    });
    const ogImage = tags.find((t) => t.attrs?.property === 'og:image');
    const twitterImage = tags.find((t) => t.attrs?.name === 'twitter:image');
    expect(ogImage!.attrs!.content).toBe(
      'https://sampaultoms.com/images/art.svg',
    );
    expect(twitterImage!.attrs!.content).toBe(
      'https://sampaultoms.com/images/art.svg',
    );
  });

  it('leaves absolute image URLs unchanged', () => {
    const tags = generateSEOTags({
      ...baseProps,
      image: 'https://cdn.example.com/art.svg',
    });
    const ogImage = tags.find((t) => t.attrs?.property === 'og:image');
    expect(ogImage!.attrs!.content).toBe('https://cdn.example.com/art.svg');
  });

  it('includes og:image dimensions when image is provided', () => {
    const tags = generateSEOTags({
      ...baseProps,
      image: '/images/art.svg',
    });
    const width = tags.find((t) => t.attrs?.property === 'og:image:width');
    const height = tags.find((t) => t.attrs?.property === 'og:image:height');
    expect(width!.attrs!.content).toBe('1200');
    expect(height!.attrs!.content).toBe('630');
  });

  it('does not include og:image dimensions when no image is provided', () => {
    const tags = generateSEOTags(baseProps);
    const width = tags.find((t) => t.attrs?.property === 'og:image:width');
    const height = tags.find((t) => t.attrs?.property === 'og:image:height');
    expect(width).toBeUndefined();
    expect(height).toBeUndefined();
  });

  it('uses custom siteName when provided', () => {
    const tags = generateSEOTags({
      ...baseProps,
      siteName: 'Other Artist',
    });
    const ogSiteName = tags.find((t) => t.attrs?.property === 'og:site_name');
    expect(ogSiteName!.attrs!.content).toBe('Other Artist');
  });

  it('defaults siteName to DEFAULT_SITE_NAME', () => {
    const tags = generateSEOTags(baseProps);
    const ogSiteName = tags.find((t) => t.attrs?.property === 'og:site_name');
    expect(ogSiteName!.attrs!.content).toBe('Sam Paul Toms');
  });
});
