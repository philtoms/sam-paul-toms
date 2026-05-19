/**
 * Pure TypeScript helpers for generating SEO head tags.
 * These are used by SEOHead.astro and tested independently.
 */
import { resolveAbsoluteUrl } from '../scripts/structured-data';

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  type?: 'website' | 'music.song' | 'music.album' | 'music.playlist';
  structuredData?: object | object[];
  noindex?: boolean;
  siteUrl?: string;
}

/**
 * Generates an array of tag descriptors from SEO props.
 * Each descriptor has a `type` ('title', 'meta', 'link', 'script')
 * and associated attributes/content.
 */
export function generateSEOTags(props: SEOProps): Array<{
  type: 'title' | 'meta' | 'link' | 'script';
  attrs?: Record<string, string>;
  content?: string;
}> {
  const {
    title,
    description,
    image,
    canonicalUrl,
    type = 'website',
    structuredData,
    noindex,
    siteUrl = '',
  } = props;

  const tags: Array<{
    type: 'title' | 'meta' | 'link' | 'script';
    attrs?: Record<string, string>;
    content?: string;
  }> = [];

  // Title
  tags.push({ type: 'title', content: title });

  // Meta description
  tags.push({ type: 'meta', attrs: { name: 'description', content: description } });

  // Canonical URL
  const canonical = canonicalUrl || '';
  if (canonical) {
    tags.push({ type: 'link', attrs: { rel: 'canonical', href: canonical } });
  }

  // Open Graph tags
  tags.push({ type: 'meta', attrs: { property: 'og:title', content: title } });
  tags.push({ type: 'meta', attrs: { property: 'og:description', content: description } });
  if (canonical) {
    tags.push({ type: 'meta', attrs: { property: 'og:url', content: canonical } });
  }
  tags.push({ type: 'meta', attrs: { property: 'og:type', content: type } });
  tags.push({ type: 'meta', attrs: { property: 'og:site_name', content: 'Sam' } });

  if (image) {
    const absoluteImage = siteUrl ? resolveAbsoluteUrl(image, siteUrl) : image;
    tags.push({ type: 'meta', attrs: { property: 'og:image', content: absoluteImage } });
    tags.push({ type: 'meta', attrs: { property: 'og:image:width', content: '1200' } });
    tags.push({ type: 'meta', attrs: { property: 'og:image:height', content: '630' } });
  }

  // Twitter Card tags
  tags.push({ type: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } });
  tags.push({ type: 'meta', attrs: { name: 'twitter:title', content: title } });
  tags.push({ type: 'meta', attrs: { name: 'twitter:description', content: description } });

  if (image) {
    const absoluteImage = siteUrl ? resolveAbsoluteUrl(image, siteUrl) : image;
    tags.push({ type: 'meta', attrs: { name: 'twitter:image', content: absoluteImage } });
  }

  // Structured Data (JSON-LD)
  if (structuredData) {
    const items = Array.isArray(structuredData) ? structuredData : [structuredData];
    for (const item of items) {
      tags.push({
        type: 'script',
        attrs: { type: 'application/ld+json' },
        content: JSON.stringify(item),
      });
    }
  }

  // Noindex
  if (noindex) {
    tags.push({ type: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } });
  }

  return tags;
}
