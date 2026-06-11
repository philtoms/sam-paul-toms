#!/usr/bin/env node

/**
 * Synthetic sample audio generator.
 *
 * Reads release content files from `src/content/releases/*.md`, extracts each
 * track's `audioFile` path and `duration` string, and generates a synthetic
 * MP3 file of the correct duration using ffmpeg's sine wave source.
 *
 * Each track gets a slightly different pair of frequencies derived from a
 * simple hash of the track title, producing varied ambient tones in the
 * 100–400 Hz range. The result is filtered through a lowpass at 800 Hz and
 * attenuated (volume 0.3) to produce a pleasant ambient sound that gives
 * waveform visualizations real data to work with.
 *
 * Features:
 *   - Reads frontmatter via gray-matter (already a dev dependency).
 *   - Idempotent: skips files whose actual duration (via ffprobe) matches
 *     the expected duration within ±1 second.
 *   - Per-file status logging with emoji prefixes (matching project style).
 *   - Summary line with totals.
 *   - Exit code 1 if any generation fails.
 *
 * Usage:
 *   node scripts/generate-sample-audio.cjs [content-dir] [output-dir]
 *   npm run generate:sample-audio
 *
 * Arguments:
 *   content-dir  — Directory containing release .md files (default: src/content/releases)
 *   output-dir   — Base directory for generated audio files (default: public/audio-samples)
 */

const fs = require('node:fs');
const path = require('node:path');
const child_process = require('node:child_process');
const matter = require('gray-matter');

// --- Configuration (defaults, overridable via CLI args) ---

const DEFAULT_CONTENT_DIR = 'src/content/releases';
const DEFAULT_OUTPUT_BASE = 'public/audio-samples';

// --- Helpers ---

/**
 * Parse a duration string "mm:ss" into total seconds.
 * @param {string} duration - Duration in "mm:ss" format.
 * @returns {number} Total seconds.
 */
function parseDuration(duration) {
  const parts = duration.split(':');
  if (parts.length !== 2) {
    throw new Error(`Invalid duration format: "${duration}"`);
  }
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  if (isNaN(minutes) || isNaN(seconds)) {
    throw new Error(`Invalid duration format: "${duration}"`);
  }
  return minutes * 60 + seconds;
}

/**
 * Simple string hash for generating varied frequencies.
 * Returns a number in the range [min, max].
 * @param {string} str - Input string.
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 * @returns {number} Hash-derived value in range.
 */
function hashToRange(str, min, max) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0x7fffffff;
  }
  return min + (hash % (max - min + 1));
}

/**
 * Get the actual duration of an audio file via ffprobe.
 * Returns 0 if the file doesn't exist or ffprobe fails.
 * @param {string} filePath - Absolute path to the audio file.
 * @returns {number} Duration in seconds (rounded).
 */
function probeDuration(filePath) {
  try {
    const result = child_process.execSync(
      `ffprobe -v quiet -print_format json -show_format "${filePath}"`,
      { encoding: 'utf-8', timeout: 10000 },
    );
    const data = JSON.parse(result);
    const dur = parseFloat(data.format?.duration || '0');
    return Math.round(dur);
  } catch {
    return 0;
  }
}

/**
 * Collect all track entries from release content files.
 * @param {string} contentDir - Relative or absolute path to content directory.
 * @returns {Array<{title: string, duration: string, audioFile: string, source: string}>}
 */
function collectTracks(contentDir) {
  const entries = [];
  const absDir = path.resolve(process.cwd(), contentDir);

  if (!fs.existsSync(absDir)) {
    console.error(`❌ Content directory not found: ${contentDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(absDir).filter((f) => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(absDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);

    if (data.tracks && Array.isArray(data.tracks)) {
      for (const track of data.tracks) {
        if (track.audioFile && track.duration) {
          entries.push({
            title: track.title,
            duration: track.duration,
            audioFile: track.audioFile,
            source: path.join(contentDir, file),
          });
        }
      }
    }
  }

  return entries;
}

/**
 * Generate a synthetic MP3 file for a track.
 * @param {object} track - Track entry with title, duration, audioFile.
 * @param {string} outputBase - Base directory for output files.
 * @returns {'generated' | 'skipped' | 'failed'} Result status.
 */
function generateTrack(track, outputBase) {
  const expectedSeconds = parseDuration(track.duration);
  const outputPath = path.resolve(process.cwd(), outputBase, track.audioFile);

  // Check if file already exists with correct duration
  if (fs.existsSync(outputPath)) {
    const actualSeconds = probeDuration(outputPath);
    if (Math.abs(actualSeconds - expectedSeconds) <= 1) {
      console.log(`  ⏭  ${track.audioFile} (already correct: ${actualSeconds}s)`);
      return 'skipped';
    }
  }

  // Create output directory
  const outputDir = path.dirname(outputPath);
  fs.mkdirSync(outputDir, { recursive: true });

  // Derive frequencies from track title for variety
  const freq1 = hashToRange(track.title, 100, 250);
  const freq2 = hashToRange(track.title + '_bass', 150, 400);

  console.log(
    `  🎶 ${track.audioFile} (${track.duration} = ${expectedSeconds}s, ${freq1}Hz + ${freq2}Hz)`,
  );

  try {
    child_process.execSync(
      [
        'ffmpeg',
        '-f lavfi',
        `-i "sine=frequency=${freq1}:duration=${expectedSeconds}"`,
        '-f lavfi',
        `-i "sine=frequency=${freq2}:duration=${expectedSeconds}"`,
        '-filter_complex',
        `"[0:a][1:a]amerge=inputs=2,lowpass=f=800,volume=0.3[a]"`,
        '-map "[a]"',
        '-codec:a libmp3lame',
        '-qscale:a 6',
        '-y',
        `-loglevel error`,
        `"${outputPath}"`,
      ].join(' '),
      { encoding: 'utf-8', timeout: 120000 },
    );

    // Verify the output
    const actualSeconds = probeDuration(outputPath);
    if (Math.abs(actualSeconds - expectedSeconds) > 1) {
      console.error(
        `     ❌ Duration mismatch: expected ${expectedSeconds}s, got ${actualSeconds}s`,
      );
      return 'failed';
    }

    const sizeKB = Math.round(fs.statSync(outputPath).size / 1024);
    console.log(`     ✅ Generated (${actualSeconds}s, ${sizeKB}KB)`);
    return 'generated';
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`     ❌ Failed: ${message}`);
    return 'failed';
  }
}

// --- Main ---

function main() {
  // Allow CLI overrides for content and output directories
  const contentDir = process.argv[2] || DEFAULT_CONTENT_DIR;
  const outputBase = process.argv[3] || DEFAULT_OUTPUT_BASE;

  console.log('🎵 Generating synthetic sample audio...\n');

  const tracks = collectTracks(contentDir);

  if (tracks.length === 0) {
    console.log('No tracks found in release content files.');
    process.exit(0);
  }

  console.log(`Found ${tracks.length} tracks across release files.\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const track of tracks) {
    const result = generateTrack(track, outputBase);
    if (result === 'generated') generated++;
    else if (result === 'skipped') skipped++;
    else failed++;
  }

  console.log(
    `\n✅ Done: ${generated} generated, ${skipped} skipped, ${failed} failed.`,
  );

  if (failed > 0) {
    process.exit(1);
  }
}

// Only run main when executed directly (not when required for testing)
if (require.main === module) {
  main();
}

// Export internals for testing
module.exports = { parseDuration, hashToRange, collectTracks, generateTrack };
