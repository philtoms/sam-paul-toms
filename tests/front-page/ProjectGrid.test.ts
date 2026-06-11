/**
 * ProjectGrid component structure tests.
 *
 * Validates the ProjectGrid.astro component source for correct
 * grid layout, card elements, and event dispatch wiring.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const componentPath = resolve(process.cwd(), 'src/components/ProjectGrid.astro');
const component = readFileSync(componentPath, 'utf-8');

describe('ProjectGrid component structure', () => {
  it('contains a grid container with responsive classes', () => {
    expect(component).toContain('grid-cols-1');
    expect(component).toContain('md:grid-cols-2');
    expect(component).toContain('lg:grid-cols-3');
  });

  it('contains project card elements with the card class', () => {
    expect(component).toContain('project-card');
    expect(component).toContain('class="card');
  });

  it('uses artwork-container class for images', () => {
    expect(component).toContain('artwork-container');
  });

  it('references openProjectModal dispatch', () => {
    expect(component).toContain('openProjectModal');
  });

  it('uses data-project-index attribute on cards', () => {
    expect(component).toContain('data-project-index');
  });

  it('includes a delegated event listener on the grid container', () => {
    expect(component).toContain('project-grid');
    expect(component).toContain('addEventListener');
  });

  it('sorts projects by publishDate descending', () => {
    expect(component).toContain('publishDate');
    expect(component).toContain('sort');
  });

  it('renders project titles', () => {
    expect(component).toContain('project.title');
  });

  it('renders formatted dates', () => {
    expect(component).toContain('toLocaleDateString');
  });
});
