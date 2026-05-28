#!/usr/bin/env node

/**
 * WAV to MP3 converter.
 *
 * Converts `.wav` files to `.mp3` format using ffmpeg (libmp3lame).
 * Accepts a single `.wav` file or a directory path (recursively finding
 * all `.wav` files within). Writes `.mp3` files alongside the originals.
 *
 * Features:
 *   - Incremental: skips conversion if `.mp3` already exists and is newer
 *     than the `.wav` source.
 *   - Recursive directory scanning.
 *   - Per-file status logging with emoji prefixes.
 *   - Summary line with totals.
 *   - Exit code 1 if any conversions failed, 0 otherwise.
 *
 * Usage:
 *   node scripts/wav2mp3.cjs <file-or-folder>
 *   npm run wav2mp3 -- <file-or-folder>
 */

const fs = require('node:fs');
const path = require('node:path');
const child_process = require('node:child_process');

// --- Helpers ---

/**
 * Recursively collect all `.wav` files in a directory.
 * @param {string} dir - Absolute directory path.
 * @returns {string[]} Array of absolute `.wav` file paths.
 */
function collectWavFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectWavFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.wav')) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Get the mtime (modification time) of a file, or 0 if it doesn't exist.
 * @param {string} filePath - Absolute file path.
 * @returns {number} Timestamp in milliseconds.
 */
function getMtime(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return stat.mtimeMs;
  } catch {
    return 0;
  }
}

/**
 * Convert a single `.wav` file to `.mp3` using ffmpeg.
 * @param {string} wavPath - Absolute path to the `.wav` file.
 * @returns {'converted' | 'skipped' | 'failed'} Result status.
 */
function convertFile(wavPath) {
  const mp3Path = wavPath.replace(/\.wav$/i, '.mp3');

  // Skip if mp3 already exists and is newer than wav
  const wavMtime = getMtime(wavPath);
  const mp3Mtime = getMtime(mp3Path);

  if (mp3Mtime > 0 && mp3Mtime >= wavMtime) {
    console.log(`  ⏭  ${path.relative(process.cwd(), wavPath)} (up to date)`);
    return 'skipped';
  }

  const relativePath = path.relative(process.cwd(), wavPath);
  console.log(`  🎶 ${relativePath}`);

  try {
    child_process.execSync(
      `ffmpeg -i "${wavPath}" -codec:a libmp3lame -qscale:a 2 "${mp3Path}" -y -loglevel error`,
      { encoding: 'utf-8', timeout: 60000 },
    );
    console.log(`     ✅ ${path.relative(process.cwd(), mp3Path)}`);
    return 'converted';
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`     ❌ Failed: ${message}`);
    return 'failed';
  }
}

// --- Main ---

function main() {
  const inputArg = process.argv[2];

  if (!inputArg) {
    console.error('Usage: node scripts/wav2mp3.cjs <file-or-folder>');
    process.exit(1);
  }

  const inputPath = path.resolve(process.cwd(), inputArg);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Path does not exist: ${inputArg}`);
    process.exit(1);
  }

  const stat = fs.statSync(inputPath);
  let wavFiles;

  if (stat.isDirectory()) {
    wavFiles = collectWavFiles(inputPath);
  } else if (stat.isFile() && inputPath.toLowerCase().endsWith('.wav')) {
    wavFiles = [inputPath];
  } else {
    console.error(`❌ Not a .wav file or directory: ${inputArg}`);
    process.exit(1);
  }

  if (wavFiles.length === 0) {
    console.log('No .wav files found.');
    process.exit(0);
  }

  console.log(`🎵 Converting ${wavFiles.length} wav file(s)...\n`);

  let converted = 0;
  let skipped = 0;
  let failed = 0;

  for (const wavPath of wavFiles) {
    const result = convertFile(wavPath);
    if (result === 'converted') converted++;
    else if (result === 'skipped') skipped++;
    else failed++;
  }

  console.log(
    `\n✅ Done: ${converted} converted, ${skipped} skipped, ${failed} failed.`,
  );

  if (failed > 0) {
    process.exit(1);
  }
}

main();
