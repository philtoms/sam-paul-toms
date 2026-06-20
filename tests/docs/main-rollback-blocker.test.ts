/**
 * Structural validation for `docs/main-rollback-blocker.md`.
 *
 * KB-266 produced a forensic blocker record whose PURPOSE is to (a) fix every
 * verified fact about the `main`/`origin/main` force-reset, (b) state the
 * do-no-harm invariant (no refs moved), and (c) escalate a binary board/human
 * decision. This test locks that *structure* so a future edit cannot silently
 * drop the decision request, the do-no-harm invariant, or the rollback
 * endpoints. It asserts on substring/heading presence only — never on exact git
 * SHAs beyond the two documented rollback endpoints (KB-253 `076b0b4` and
 * KB-145 `77002915`) — so the test stays robust to git evolution.
 *
 * Pure filesystem read (mirrors the `tests/scripts/*` test discipline: no
 * `// @vitest-environment` pragma, `node` environment by default).
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const DOC_PATH = resolve(__dirname, '../../docs/main-rollback-blocker.md');

function readDoc(): string {
  return readFileSync(DOC_PATH, 'utf8');
}

describe('docs/main-rollback-blocker.md (KB-266 forensic record)', () => {
  it('exists and is non-empty', () => {
    const content = readFileSync(DOC_PATH, 'utf8');
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it('declares that KB-266 records/escalates but does NOT resolve the blocker', () => {
    const doc = readDoc();
    expect(doc).toMatch(/records and escalates/i);
    expect(doc).toMatch(/does not resolve/i);
  });

  it('contains every required section heading', () => {
    const doc = readDoc();
    // Headings are matched as substrings so wording after the heading
    // (e.g. "Do-no-harm rationale", "Decision required from board/human")
    // may evolve without breaking this gate.
    for (const heading of [
      'Summary',
      'Verified facts',
      'Causal chain',
      'No data lost',
      'Do-no-harm',
      'Decision required',
    ]) {
      expect(doc, `expected section heading "${heading}"`).toMatch(
        new RegExp(`^#{1,6}\\s+.*${heading}`, 'm'),
      );
    }
  });

  it('records BOTH rollback endpoints (KB-253 / 076b0b4 and KB-145 / 77002915)', () => {
    const doc = readDoc();
    expect(doc, 'rolled-back tip KB-253 short SHA').toContain('076b0b4');
    expect(doc, 'current main KB-145 short SHA').toContain('77002915');
  });

  it('states the do-no-harm invariant: no commits to main, no ref changes', () => {
    const doc = readDoc();
    expect(doc).toMatch(/no commits to/i);
    expect(doc).toMatch(/no git refs/i);
  });

  it('renders BOTH decision branches as an explicit either/or', () => {
    const doc = readDoc();
    expect(doc).toMatch(/INTENTIONAL abandon/i);
    expect(doc).toMatch(/UNINTENDED defect/i);
  });

  it('references the blocked task KB-263 and the compounding defect KB-265', () => {
    const doc = readDoc();
    expect(doc).toContain('KB-263');
    expect(doc).toContain('KB-265');
  });

  it('records that the registry is absent on current main (the causal root)', () => {
    const doc = readDoc();
    // The causal chain hinges on KB-158's registry being absent on HEAD.
    expect(doc).toContain('KB-158');
    expect(doc).toMatch(/src\/data\/name-links\.ts/);
  });
});
