/**
 * Tests for the `renderMarkdown` server-side utility.
 *
 * These lock in the rendering contract that `ProjectGrid.astro` relies on:
 * which markdown features are supported, the `breaks: true` / `gfm: true`
 * options, the plain-text equivalence guarantee, and the `<`-escaping
 * round-trip that hardens the serialised JSON payload against
 * `</script>` injection.
 */
import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../../src/scripts/markdown';

describe('renderMarkdown', () => {
  it('renders bold (**text**) as <strong>', () => {
    const html = renderMarkdown('**bold**');
    expect(html).toContain('<strong>bold</strong>');
  });

  it('renders italic (*text*) as <em>', () => {
    const html = renderMarkdown('*italic*');
    expect(html).toContain('<em>italic</em>');
  });

  it('renders a markdown link as an <a> tag with the correct href', () => {
    const html = renderMarkdown('[Sam](https://example.com)');
    // marked normalises URLs, so allow an optional trailing slash.
    expect(html).toMatch(/href="https:\/\/example\.com\/?"/);
    expect(html).toContain('<a');
  });

  it('converts single newlines to <br> (breaks: true is active)', () => {
    const html = renderMarkdown('line one\nline two');
    expect(html).toContain('<br>');
  });

  it('renders double-newline-separated blocks as separate <p> tags', () => {
    const html = renderMarkdown('first\n\nsecond');
    expect(html).toContain('<p>first</p>');
    expect(html).toContain('<p>second</p>');
  });

  it('wraps plain text in a single <p> (plain-text equivalence)', () => {
    // This is the guarantee that makes plain-text summaries render visually
    // equivalent after this change: marked wraps them in a single <p>.
    const html = renderMarkdown('just plain text');
    expect(html).toContain('<p>just plain text</p>');
  });

  it('passes through raw HTML such as </script> unchanged (no sanitisation)', () => {
    // Markdown + GFM raw-HTML passthrough means a literal </script> survives
    // into the rendered HTML. This is intentional (first-party, trusted
    // content) and is why Step 5's < -escaping is required.
    const html = renderMarkdown('text with </script> tag');
    expect(html).toContain('</script>');
  });

  it('the JSON serialisation escaping round-trips < safely (Step 5 contract)', () => {
    // Simulate exactly what ProjectGrid.astro does when serialising the
    // summaryHtml field into the <script type="application/json"> payload.
    const html = renderMarkdown('text with </script> tag');
    const escaped = JSON.stringify({ summaryHtml: html }).replace(/</g, '\\u003c');

    // The escaped payload must NOT contain a literal </script> that would
    // prematurely terminate the script tag in the browser.
    expect(escaped).not.toContain('</script>');
    expect(escaped).not.toContain('<');

    // JSON.parse decodes \u003c back to <, so the round-trip is lossless.
    expect(JSON.parse(escaped).summaryHtml).toBe(html);
  });
});
