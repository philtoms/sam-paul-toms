import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const compactBioPath = resolve(__dirname, '../../src/components/CompactBio.astro');
const compactBio = readFileSync(compactBioPath, 'utf-8');

const socialLinksBarPath = resolve(__dirname, '../../src/components/SocialLinksBar.astro');
const socialLinksBar = readFileSync(socialLinksBarPath, 'utf-8');

const playerCssPath = resolve(__dirname, '../../src/components/AudioPlayer/Player.css');
const playerCss = readFileSync(playerCssPath, 'utf-8');

const globalCssPath = resolve(__dirname, '../../src/styles/global.css');
const globalCss = readFileSync(globalCssPath, 'utf-8');

describe('Mobile Layout (≤430px) — KB-083', () => {
  describe('Step 1: Bio text smaller on mobile', () => {
    it('CompactBio uses text-lg at default with max-[430px]:text-sm override', () => {
      // Should have text-lg as the base class
      expect(compactBio).toContain('text-lg');
      // Should have the mobile override to reduce size
      expect(compactBio).toContain('max-[430px]:text-sm');
    });

    it('the responsive class is on the same <p> element as text-lg', () => {
      // Find the <p> tag and verify both classes coexist
      const pMatch = compactBio.match(/<p[^>]*class="[^"]*text-lg[^"]*"[^>]*>/);
      expect(pMatch).not.toBeNull();
      expect(pMatch![0]).toContain('max-[430px]:text-sm');
    });
  });

  describe('Step 2: Contact button centered when wrapped', () => {
    it('contact button has max-[430px]:w-full for full-width on mobile', () => {
      // Find the contact button by its id
      const contactBtnMatch = socialLinksBar.match(/id="contact-btn"[\s\S]*?class="([^"]*)"/);
      expect(contactBtnMatch).not.toBeNull();
      const btnClass = contactBtnMatch![1];
      expect(btnClass).toContain('max-[430px]:w-full');
    });

    it('contact button has text-center and mt-2 for mobile', () => {
      const contactBtnMatch = socialLinksBar.match(/id="contact-btn"[\s\S]*?class="([^"]*)"/);
      expect(contactBtnMatch).not.toBeNull();
      const btnClass = contactBtnMatch![1];
      expect(btnClass).toContain('max-[430px]:text-center');
      expect(btnClass).toContain('max-[430px]:mt-2');
    });

    it('contact button removes left margin on mobile', () => {
      const contactBtnMatch = socialLinksBar.match(/id="contact-btn"[\s\S]*?class="([^"]*)"/);
      expect(contactBtnMatch).not.toBeNull();
      const btnClass = contactBtnMatch![1];
      expect(btnClass).toContain('max-[430px]:ml-0');
    });
  });

  describe('Step 3: Waveform visible on mobile', () => {
    it('waveform is NOT hidden with display:none in mobile breakpoint', () => {
      // Extract the mobile media query block
      const mobileMediaMatch = playerCss.match(
        /@media\s*\(\s*max-width:\s*639px\s*\)\s*\{([^}]*\{[^}]*\})*[^}]*\}/s,
      );

      // The mobile block should exist
      expect(mobileMediaMatch).not.toBeNull();

      // Check that .audio-player-waveform no longer has display: none in the mobile breakpoint
      const mobileBlock = mobileMediaMatch![0];

      // Should NOT contain the old rule that hid the waveform
      const waveformDisplayNone = /\.audio-player-waveform\s*\{[^}]*display:\s*none[^}]*\}/;
      expect(waveformDisplayNone.test(mobileBlock)).toBe(false);
    });

    it('waveform has a grid-area assignment for the second row', () => {
      // The mobile CSS should assign grid-area: waveform to the waveform element
      expect(playerCss).toMatch(/\.audio-player-waveform\s*\{[^}]*grid-area:\s*waveform[^}]*\}/s);
    });

    it('mobile grid includes waveform in template areas', () => {
      // Check that the grid-template-areas includes 'waveform'
      const mobileBlockMatch = playerCss.match(
        /@media\s*\(\s*max-width:\s*639px\s*\)[\s\S]*?grid-template-areas:\s*:?([\s\S]*?);/,
      );
      expect(mobileBlockMatch).not.toBeNull();
      expect(mobileBlockMatch![0]).toContain('waveform');
    });

    it('mobile grid has two rows', () => {
      // Should have grid-template-rows with two values
      const mobileBlockMatch = playerCss.match(
        /@media\s*\(\s*max-width:\s*639px\s*\)[\s\S]*?grid-template-rows:\s*([^;]+);/,
      );
      expect(mobileBlockMatch).not.toBeNull();
      const rows = mobileBlockMatch![1].trim().split(/\s+/);
      expect(rows.length).toBe(2);
    });
  });

  describe('Step 4: Section padding reduced on mobile', () => {
    it('global.css has a max-width: 430px media query for .section', () => {
      expect(globalCss).toMatch(/@media\s*\(\s*max-width:\s*430px\s*\)/);
    });

    it('mobile .section uses reduced padding (space-8)', () => {
      // Find the 430px media query block
      const mobileSectionMatch = globalCss.match(
        /@media\s*\(\s*max-width:\s*430px\s*\)\s*\{[^}]*\.section\s*\{[^}]*padding-top:\s*var\(--space-8\)[^}]*\}/s,
      );
      expect(mobileSectionMatch).not.toBeNull();
    });

    it('default .section still uses space-16 (desktop unchanged)', () => {
      // The default .section (not inside a media query) should still use space-16
      const defaultSectionMatch = globalCss.match(
        /^\.section\s*\{[^}]*padding-top:\s*var\(--space-16\)[^}]*padding-bottom:\s*var\(--space-16\)[^}]*\}/m,
      );
      expect(defaultSectionMatch).not.toBeNull();
    });
  });
});
