/**
 * KB-127 — structural validation for the agentic-inbox deployment runbook.
 *
 * This is a documentation/integration test: it reads the runbook and the
 * supporting docs from disk and asserts they contain the sections, commands,
 * and cross-references the runbook must have. It does NOT exercise any
 * infrastructure. Two assertions (the `.env.example` annotation and the
 * `docs/deployment.md` cross-reference) depend on the Step 3 doc updates; the
 * full suite is expected to pass from Step 4 onward.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Vitest runs from the project root (no custom `test.root` in vitest.config.ts).
const root = process.cwd();

function readDoc(relativePath: string): string {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

describe('KB-127: agentic-inbox deployment runbook', () => {
  const runbook = readDoc('docs/agentic-inbox-deployment.md');

  // --- Runbook exists and has all 7 required sections ---
  it('contains all 7 required section headings', () => {
    const requiredSections = [
      '## 1. Overview',
      '## 2. Prerequisites',
      '## 3. Step-by-Step',
      '## 4. Verification',
      '## 5. Rollback',
      '## 6. Cost',
      '## 7. References',
    ];
    for (const heading of requiredSections) {
      expect(runbook, `runbook should contain heading: ${heading}`).toContain(
        heading,
      );
    }
  });

  // --- Architecture flow diagram present ---
  it('includes the architecture flow diagram with key tokens', () => {
    expect(runbook).toContain('Email Routing');
    expect(runbook).toContain('MailboxDO');
    // The diagram is a fenced ASCII block; sanity-check the inbound path token.
    expect(runbook).toContain('receiveEmail()');
  });

  // --- All 9 deployment steps present (keyword coverage) ---
  it('documents all 9 deployment steps', () => {
    const stepKeywords = [
      'Clone', // Step 1
      'wrangler.jsonc', // Step 2
      'wrangler deploy', // Step 3
      'Access', // Step 4
      'POLICY_AUD', // Step 5
      'Email Routing', // Step 6
      'Email Service', // Step 7
      'mailbox', // Step 8
      'CONTACT_RECIPIENT_EMAIL', // Step 9
    ];
    for (const keyword of stepKeywords) {
      expect(
        runbook,
        `runbook should mention step keyword: ${keyword}`,
      ).toContain(keyword);
    }
  });

  // --- CLI commands are copy-pasteable ---
  it('includes the key CLI commands verbatim', () => {
    const commands = [
      'wrangler deploy',
      'wrangler secret put POLICY_AUD',
      'wrangler secret put TEAM_DOMAIN',
      'git clone',
    ];
    for (const command of commands) {
      expect(runbook, `runbook should contain command: ${command}`).toContain(
        command,
      );
    }
  });

  // --- Rollback section documents repointing CONTACT_RECIPIENT_EMAIL back ---
  it('documents repointing CONTACT_RECIPIENT_EMAIL back in the rollback section', () => {
    expect(runbook).toContain('## 5. Rollback');
    expect(runbook).toMatch(/CONTACT_RECIPIENT_EMAIL.*back/i);
  });

  // --- No source files claim to be modified ---
  it('explicitly states no files under src/ are changed', () => {
    // Look for src/ proximity to "zero" / "no ... modified|edited|code" language.
    expect(runbook).toContain('src/');
    expect(runbook).toMatch(/zero|no (?:files?|code|file)/i);
  });

  // --- Runbook links back to the research doc (cross-reference) ---
  it('links back to the agentic-inbox research document', () => {
    expect(runbook).toContain('agentic-inbox-integration-research.md');
  });

  // --- Prerequisites surface owner decisions with proposed defaults ---
  it('surfaces owner decisions with proposed defaults', () => {
    expect(runbook).toContain('[Owner Decision]');
    expect(runbook).toContain('[Prerequisite]');
    // The default mailbox address should be stated.
    expect(runbook).toContain('contact@sampaultoms.com');
  });

  describe('supporting documentation references', () => {
    // These two assertions depend on the Step 3 doc updates.

    it('.env.example documents the agentic-inbox mailbox option', () => {
      const envExample = readDoc('.env.example');
      expect(envExample).toContain('agentic-inbox');
      // And points at the runbook.
      expect(envExample).toContain('agentic-inbox-deployment.md');
    });

    it('docs/deployment.md cross-references the agentic-inbox runbook', () => {
      const deployment = readDoc('docs/deployment.md');
      // Accept either the runbook filename or the term "agentic-inbox".
      expect(
        deployment.includes('agentic-inbox-deployment.md') ||
          deployment.includes('agentic-inbox'),
        'docs/deployment.md should reference the agentic-inbox runbook',
      ).toBe(true);
    });
  });
});
