import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const cssPath = resolve(__dirname, '../../src/styles/global.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Design System — Color Palette', () => {
  const colorTokens = [
    '--color-bg',
    '--color-bg-elevated',
    '--color-bg-overlay',
    '--color-text',
    '--color-text-secondary',
    '--color-text-tertiary',
    '--color-accent',
    '--color-accent-hover',
    '--color-success',
    '--color-error',
    '--color-warning',
    '--color-border',
    '--color-border-subtle',
  ];

  it.each(colorTokens)('defines %s', (token) => {
    expect(css).toContain(token);
  });

  it('preserves original KB-002 color values', () => {
    expect(css).toContain('--color-bg: #0a0a0a');
    expect(css).toContain('--color-text: #f5f5f5');
    expect(css).toContain('--color-accent: #8b5cf6');
  });
});

describe('Design System — Typography', () => {
  it('defines font families', () => {
    expect(css).toContain('--font-display:');
    expect(css).toContain('--font-body:');
  });

  const fontSizeTokens = [
    '--text-xs',
    '--text-sm',
    '--text-base',
    '--text-lg',
    '--text-xl',
    '--text-2xl',
    '--text-3xl',
    '--text-4xl',
    '--text-5xl',
    '--text-6xl',
  ];

  it.each(fontSizeTokens)('defines font size token %s', (token) => {
    expect(css).toContain(token);
  });
});

describe('Design System — Spacing', () => {
  const spacingTokens = [
    '--space-1',
    '--space-2',
    '--space-3',
    '--space-4',
    '--space-5',
    '--space-6',
    '--space-8',
    '--space-10',
    '--space-12',
    '--space-16',
    '--space-20',
    '--space-24',
  ];

  it.each(spacingTokens)('defines spacing token %s', (token) => {
    expect(css).toContain(token);
  });
});

describe('Design System — Animations', () => {
  const keyframes = [
    'artwork-zoom',
    'play-pulse',
    'fade-in-up',
    'shimmer',
    'spin',
  ];

  it.each(keyframes)('defines @keyframes %s', (name) => {
    expect(css).toContain(`@keyframes ${name}`);
  });

  const animateTokens = [
    '--animate-artwork-zoom',
    '--animate-play-pulse',
    '--animate-fade-in-up',
    '--animate-shimmer',
    '--animate-spin',
  ];

  it.each(animateTokens)('defines animation token %s', (token) => {
    expect(css).toContain(token);
  });
});

describe('Design System — Utility Classes', () => {
  const classes = [
    '.card',
    '.artwork-container',
    '.pill',
    '.section',
    '.container',
    '.heading-1',
    '.heading-2',
    '.heading-3',
  ];

  it.each(classes)('defines utility class %s', (cls) => {
    expect(css).toContain(cls + ' {');
  });
});
