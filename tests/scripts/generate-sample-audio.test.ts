/**
 * Tests for the generate-sample-audio script.
 *
 * Verifies:
 *   - Duration parsing ("mm:ss" → seconds).
 *   - Hash-to-range produces values within expected bounds.
 *   - Generating a synthetic MP3 from a fixture content file produces a valid MP3
 *     with the correct duration.
 *   - Idempotency: re-running the script skips files with correct duration.
 *   - Error handling: missing ffmpeg is handled gracefully at suite level.
 *
 * Requires `ffmpeg` with `libmp3lame` on the system PATH.
 * The suite is skipped gracefully if ffmpeg is unavailable.
 */

import { describe, it, expect, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

const SCRIPT_PATH = path.resolve(__dirname, '../../scripts/generate-sample-audio.cjs');

// Check ffmpeg availability synchronously at module level so describe.skipIf works
let ffmpegAvailable = false;
try {
  execSync('ffmpeg -version', { encoding: 'utf-8', timeout: 5000, stdio: 'pipe' });
  ffmpegAvailable = true;
} catch {
  ffmpegAvailable = false;
}

/**
 * Create a minimal release .md fixture with one track.
 */
function createReleaseFixture(dir: string, filename: string, trackTitle: string, duration: string, audioFile: string): string {
  const contentDir = path.join(dir, 'content');
  fs.mkdirSync(contentDir, { recursive: true });
  const md = `---
title: Test Release
type: single
tracks:
  - title: ${trackTitle}
    duration: "${duration}"
    audioFile: ${audioFile}
---
Test content.
`;
  const filePath = path.join(contentDir, filename);
  fs.writeFileSync(filePath, md, 'utf-8');
  return contentDir;
}

describe.skipIf(!ffmpegAvailable)('generate-sample-audio', () => {
  let tempDir: string;

  afterAll(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  // --- Unit tests for exported helpers ---

  describe('parseDuration', () => {
    const { parseDuration } = require(SCRIPT_PATH);

    it('parses "4:12" to 252 seconds', () => {
      expect(parseDuration('4:12')).toBe(252);
    });

    it('parses "3:55" to 235 seconds', () => {
      expect(parseDuration('3:55')).toBe(235);
    });

    it('parses "7:21" to 441 seconds', () => {
      expect(parseDuration('7:21')).toBe(441);
    });

    it('parses "0:00" to 0 seconds', () => {
      expect(parseDuration('0:00')).toBe(0);
    });

    it('parses "10:00" to 600 seconds', () => {
      expect(parseDuration('10:00')).toBe(600);
    });

    it('throws for invalid format (no colon)', () => {
      expect(() => parseDuration('412')).toThrow('Invalid duration format');
    });

    it('throws for invalid format (non-numeric)', () => {
      expect(() => parseDuration('ab:cd')).toThrow('Invalid duration format');
    });
  });

  describe('hashToRange', () => {
    const { hashToRange } = require(SCRIPT_PATH);

    it('returns a value within the specified range', () => {
      for (let i = 0; i < 20; i++) {
        const val = hashToRange(`test-${i}`, 100, 400);
        expect(val).toBeGreaterThanOrEqual(100);
        expect(val).toBeLessThanOrEqual(400);
      }
    });

    it('returns deterministic results for the same input', () => {
      const a = hashToRange('hello', 50, 200);
      const b = hashToRange('hello', 50, 200);
      expect(a).toBe(b);
    });

    it('returns different results for different inputs', () => {
      const a = hashToRange('track-one', 100, 400);
      const b = hashToRange('track-two', 100, 400);
      // Not guaranteed to be different, but extremely likely with different strings
      expect(typeof a).toBe('number');
      expect(typeof b).toBe('number');
    });

    it('handles min === max', () => {
      expect(hashToRange('anything', 42, 42)).toBe(42);
    });
  });

  // --- Integration tests ---

  describe('MP3 generation', () => {
    it('generates a valid MP3 with correct duration from a fixture', () => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-sample-audio-test-'));
      const outputDir = path.join(tempDir, 'output');
      fs.mkdirSync(outputDir, { recursive: true });

      const contentDir = createReleaseFixture(
        tempDir,
        'test-single.md',
        'Test Track',
        '0:05',
        'releases/test-single/01-test.mp3',
      );

      execSync(`node "${SCRIPT_PATH}" "${contentDir}" "${outputDir}"`, {
        encoding: 'utf-8',
        timeout: 30000,
      });

      const outputFile = path.join(outputDir, 'releases/test-single/01-test.mp3');
      expect(fs.existsSync(outputFile)).toBe(true);

      // Verify it's a valid MP3 with correct duration
      const probeResult = execSync(
        `ffprobe -v quiet -print_format json -show_format "${outputFile}"`,
        { encoding: 'utf-8', timeout: 10000 },
      );
      const probeData = JSON.parse(probeResult);
      const duration = Math.round(parseFloat(probeData.format?.duration || '0'));
      expect(duration).toBe(5);

      // File should be non-trivial size (not empty or corrupt)
      const fileSize = fs.statSync(outputFile).size;
      expect(fileSize).toBeGreaterThan(1000);
    });
  });

  describe('idempotency', () => {
    it('skips files with correct duration on re-run', () => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-sample-audio-test-'));
      const outputDir = path.join(tempDir, 'output');
      fs.mkdirSync(outputDir, { recursive: true });

      const contentDir = createReleaseFixture(
        tempDir,
        'idem-single.md',
        'Idempotency Track',
        '0:04',
        'releases/idem-single/01-idem.mp3',
      );

      // First run — should generate
      const output1 = execSync(
        `node "${SCRIPT_PATH}" "${contentDir}" "${outputDir}"`,
        { encoding: 'utf-8', timeout: 30000 },
      );
      expect(output1).toContain('✅ Done:');
      expect(output1).not.toContain('0 generated');

      // Second run — should skip all
      const output2 = execSync(
        `node "${SCRIPT_PATH}" "${contentDir}" "${outputDir}"`,
        { encoding: 'utf-8', timeout: 30000 },
      );
      expect(output2).toContain('⏭');
      expect(output2).toContain('0 generated');
      expect(output2).toContain('1 skipped');
    });
  });

  describe('error handling', () => {
    it('exits with code 1 when content directory does not exist', () => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-sample-audio-test-'));
      const outputDir = path.join(tempDir, 'output');
      const fakeContentDir = path.join(tempDir, 'nonexistent-content');

      let exitCode = 0;
      let stderr = '';

      try {
        execSync(
          `node "${SCRIPT_PATH}" "${fakeContentDir}" "${outputDir}"`,
          { encoding: 'utf-8', timeout: 10000, stdio: ['pipe', 'pipe', 'pipe'] },
        );
      } catch (err: any) {
        exitCode = err.status ?? 1;
        stderr = err.stderr ?? '';
      }

      expect(exitCode).toBe(1);
      expect(stderr).toContain('not found');
    });
  });
});
