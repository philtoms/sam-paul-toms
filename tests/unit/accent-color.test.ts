// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { getAccentColor, getAccentHoverColor } from '../../src/scripts/accent-color';

describe('accent-color', () => {
  beforeEach(() => {
    document.documentElement.style.removeProperty('--color-accent');
    document.documentElement.style.removeProperty('--color-accent-hover');
  });

  it('getAccentColor returns #eab308 when no CSS var is set', () => {
    expect(getAccentColor()).toBe('#eab308');
  });

  it('getAccentColor returns the CSS var value when set', () => {
    document.documentElement.style.setProperty('--color-accent', '#3b82f6');
    expect(getAccentColor()).toBe('#3b82f6');
  });

  it('getAccentHoverColor returns #facc15 when no CSS var is set', () => {
    expect(getAccentHoverColor()).toBe('#facc15');
  });

  it('getAccentHoverColor returns the CSS var value when set', () => {
    document.documentElement.style.setProperty('--color-accent-hover', '#60a5fa');
    expect(getAccentHoverColor()).toBe('#60a5fa');
  });
});
