/**
 * SocialLinksBar component tests.
 *
 * Validates the SocialLinksBar component's structure and content.
 * Integration tests (Play All event dispatch) are covered by the
 * homepage test suite after Step 7.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const componentPath = resolve(process.cwd(), 'src/components/SocialLinksBar.astro');
const component = readFileSync(componentPath, 'utf-8');

describe('SocialLinksBar component structure', () => {
  it('renders Play All button with id="play-all-btn"', () => {
    expect(component).toContain('id="play-all-btn"');
    expect(component).toContain('Play All');
  });

  it('renders all 6 icon links (IMDB, Tidal, Spotify, Instagram, Apple Music, Contact)', () => {
    expect(component).toContain('aria-label="IMDB"');
    expect(component).toContain('aria-label="Tidal"');
    expect(component).toContain('aria-label="Spotify"');
    expect(component).toContain('aria-label="Instagram"');
    expect(component).toContain('aria-label="Apple Music"');
    expect(component).toContain('aria-label="Contact"');
  });

  it('renders Contact link pointing to /about', () => {
    expect(component).toContain('href="/about"');
  });

  it('has data-tracks attribute on wrapper element for track data', () => {
    expect(component).toContain('data-tracks={allTracksJson}');
  });

  it('includes client-side script for audio-player:play event dispatch', () => {
    expect(component).toContain('audio-player:play');
    expect(component).toContain('JSON.parse');
    expect(component).toContain('play-all-btn');
  });

  it('uses consistent icon sizing for social links', () => {
    // Social/streaming icons use w-4 h-4 SVGs inside w-5 h-5 containers
    expect(component).toContain('w-4 h-4');
    expect(component).toContain('hover:text-accent');
  });

  it('Play All button retains its original size', () => {
    // Play All button should still be w-10 h-10
    const playAllBtn = component.match(/id="play-all-btn"[\s\S]*?class="[^"]*w-10 h-10[^"]*"/);
    expect(playAllBtn).not.toBeNull();
  });

  it('each social link contains a span with the correct platform name', () => {
    // Only the 5 social/streaming links have hover-reveal spans (not Contact)
    const platformNames = ['IMDB', 'Tidal', 'Spotify', 'Instagram', 'Apple Music'];
    for (const name of platformNames) {
      // Find the span containing the platform name (after an SVG inside a link)
      const spanPattern = new RegExp(
        `aria-label="${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?<\\/svg>[\\s]*<span[^>]*>${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/span`,
      );
      expect(component).toMatch(spanPattern);
    }
  });

  it('spans have opacity transition and bordered-pill hover-reveal classes', () => {
    // Check that spans are hidden by default (opacity-0)
    expect(component).toContain('opacity-0');
    // Check that spans transition to visible on hover
    expect(component).toContain('group-hover:opacity-100');
    // Check transition properties (opacity-only, 200ms)
    expect(component).toContain('transition-opacity duration-200');
    // Check bordered pill styling
    expect(component).toContain('border-white/50');
    expect(component).toContain('rounded-sm');
    expect(component).toContain('text-xs');
    expect(component).toContain('font-bold');
  });

  it('social links have group class for hover state propagation', () => {
    const groupLinks = component.match(/<a[^>]*class="[^"]*group[^"]*"[^>]*>/g);
    expect(groupLinks).not.toBeNull();
    // 5 social/streaming links have the group class (Contact does not)
    expect(groupLinks!.length).toBe(5);
  });

  it('Contact link contains the text "Contact"', () => {
    // Contact link should display "Contact" as visible text content
    const contactPattern = /aria-label="Contact"[^>]*>\s*Contact\s*<\/a>/;
    expect(component).toMatch(contactPattern);
  });

  it('Contact link has pill-shaped outlined button styling', () => {
    // Find the Contact link and verify its classes
    const contactLink = component.match(
      /<a[^>]*aria-label="Contact"[^>]*class="([^"]*)"[^>]*>/,
    );
    expect(contactLink).not.toBeNull();
    const classes = contactLink![1];
    expect(classes).toContain('rounded-full');
    expect(classes).toContain('border-white/50');
    expect(classes).toContain('border');
  });
});
