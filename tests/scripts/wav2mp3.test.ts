/**
 * Tests for the wav2mp3 CLI utility.
 *
 * Verifies:
 *   - Converting a single `.wav` file produces a `.mp3` file.
 *   - Converting a directory finds and converts all `.wav` files (including nested).
 *   - Existing `.mp3` that is newer than `.wav` is skipped.
 *   - Missing input path prints error and exits with code 1.
 *
 * Requires `ffmpeg` with `libmp3lame` on the system PATH.
 * The suite is skipped gracefully if ffmpeg is unavailable.
 */

import { describe, it, expect, afterAll, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

const SCRIPT_PATH = path.resolve(__dirname, '../../scripts/wav2mp3.cjs');

// Check ffmpeg availability synchronously at module level so describe.skipIf works
let ffmpegAvailable = false;
try {
  execSync('ffmpeg -version', { encoding: 'utf-8', timeout: 5000, stdio: 'pipe' });
  ffmpegAvailable = true;
} catch {
  ffmpegAvailable = false;
}

/**
 * Create a tiny .wav fixture using ffmpeg's null audio source.
 */
function createWavFixture(filePath: string): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  execSync(
    `ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 0.5 -f wav "${filePath}" -y -loglevel error`,
    { encoding: 'utf-8', timeout: 10000 },
  );
}

describe.skipIf(!ffmpegAvailable)('wav2mp3', () => {
  let tempDir: string;

  afterAll(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up temp dir between tests
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('converts a single .wav file to .mp3', () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wav2mp3-test-'));
    const wavPath = path.join(tempDir, 'single.wav');
    const mp3Path = path.join(tempDir, 'single.mp3');

    createWavFixture(wavPath);

    execSync(`node "${SCRIPT_PATH}" "${wavPath}"`, {
      encoding: 'utf-8',
      timeout: 30000,
    });

    expect(fs.existsSync(mp3Path)).toBe(true);
    // mp3 should be smaller than wav
    const wavSize = fs.statSync(wavPath).size;
    const mp3Size = fs.statSync(mp3Path).size;
    expect(mp3Size).toBeGreaterThan(0);
    expect(mp3Size).toBeLessThan(wavSize);
  });

  it('converts a directory of .wav files recursively', () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wav2mp3-test-'));
    const subDir = path.join(tempDir, 'nested', 'deep');
    createWavFixture(path.join(tempDir, 'top.wav'));
    createWavFixture(path.join(subDir, 'nested.wav'));

    execSync(`node "${SCRIPT_PATH}" "${tempDir}"`, {
      encoding: 'utf-8',
      timeout: 30000,
    });

    expect(fs.existsSync(path.join(tempDir, 'top.mp3'))).toBe(true);
    expect(fs.existsSync(path.join(subDir, 'nested.mp3'))).toBe(true);
  });

  it('skips conversion when .mp3 is newer than .wav', () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wav2mp3-test-'));
    const wavPath = path.join(tempDir, 'skip.wav');
    const mp3Path = path.join(tempDir, 'skip.mp3');

    createWavFixture(wavPath);

    // First conversion
    execSync(`node "${SCRIPT_PATH}" "${wavPath}"`, {
      encoding: 'utf-8',
      timeout: 30000,
    });

    expect(fs.existsSync(mp3Path)).toBe(true);
    const mp3MtimeBefore = fs.statSync(mp3Path).mtimeMs;

    // Touch wav to be older (set mtime to 2 seconds ago)
    const now = Date.now();
    fs.utimesSync(wavPath, new Date(now - 2000), new Date(now - 2000));

    // Second run — should skip
    const output = execSync(`node "${SCRIPT_PATH}" "${wavPath}"`, {
      encoding: 'utf-8',
      timeout: 30000,
    });

    const mp3MtimeAfter = fs.statSync(mp3Path).mtimeMs;
    expect(mp3MtimeAfter).toBe(mp3MtimeBefore);
    expect(output).toContain('up to date');
  });

  it('exits with code 1 for missing input path', () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wav2mp3-test-'));

    let exitCode = 0;
    let stderr = '';

    try {
      execSync(`node "${SCRIPT_PATH}" "/nonexistent/path.wav"`, {
        encoding: 'utf-8',
        timeout: 10000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (err) {
      const execErr = err as { status?: number; stderr?: string };
      exitCode = execErr.status ?? 1;
      stderr = execErr.stderr ?? '';
    }

    expect(exitCode).toBe(1);
    expect(stderr).toContain('does not exist');
  });

  it('exits with code 1 when no argument is provided', () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wav2mp3-test-'));

    let exitCode = 0;
    let stderr = '';

    try {
      execSync(`node "${SCRIPT_PATH}"`, {
        encoding: 'utf-8',
        timeout: 10000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (err) {
      const execErr = err as { status?: number; stderr?: string };
      exitCode = execErr.status ?? 1;
      stderr = execErr.stderr ?? '';
    }

    expect(exitCode).toBe(1);
    expect(stderr).toContain('Usage');
  });
});
