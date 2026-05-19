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

  it('uses consistent icon sizing and hover styling', () => {
    expect(component).toContain('w-8 h-8');
    expect(component).toContain('hover:text-accent');
  });
});
