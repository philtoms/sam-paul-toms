#!/usr/bin/env node
/**
 * Build-time waveform peak generator.
 *
 * Reads content files from `src/content/works/*.md` and `src/content/releases/*.md`,
 * extracts audioFile paths, fetches the audio (from R2_PUBLIC_URL or local dev files),
 * decodes it via ffmpeg, and writes normalized peak data as JSON to `public/waveforms/`.
 *
 * Output format per file:
 *   { "peaks": [0.12, 0.45, 0.78, ...], "duration": 222 }
 *
 * Usage: node scripts/generate-waveforms.js
 *        npm run generate:waveforms
 */

const fs = require('node:fs');
const path = require('node:path');
const child_process = require('node:child_process');
const matter = require('gray-matter');

// --- Configuration ---

const CONTENT_DIRS = ['src/content/works', 'src/content/releases'];
const OUTPUT_DIR = 'public/waveforms';
const NUM_PEAKS = 200; // Number of peak values per track

// --- Helpers ---

function getR2PublicUrl() {
  // Environment variable takes precedence over .env file
  if (process.env.R2_PUBLIC_URL) return process.env.R2_PUBLIC_URL;

  // Fall back to .env file
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/^R2_PUBLIC_URL\s*=\s*(.+)$/m);
    if (match) return match[1].trim();
  }

  // Default for local dev
  return 'http://localhost:4321/r2';
}

function resolveAudioPath(audioFile, r2BaseUrl) {
  if (audioFile.startsWith('http://') || audioFile.startsWith('https://')) {
    return audioFile;
  }
  const base = r2BaseUrl.replace(/\/$/, '');
  const filePath = audioFile.replace(/^\//, '');
  // If r2BaseUrl is a local path (not http), resolve to filesystem
  if (!base.startsWith('http://') && !base.startsWith('https://')) {
    return path.resolve(process.cwd(), base, filePath);
  }
  return `${base}/${filePath}`;
}

function getOutputPath(audioFile) {
  // e.g., "works/documentary/01-the-weight-of-water.mp3"
  //    → "public/waveforms/works/documentary/01-the-weight-of-water.json"
  const relativePath = audioFile.replace(/^\//, '');
  const jsonPath = relativePath.replace(/\.mp3$/i, '.json');
  return path.join(OUTPUT_DIR, jsonPath);
}

function collectAudioFiles() {
  const entries = [];

  for (const dir of CONTENT_DIRS) {
    const absDir = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(absDir)) continue;

    const files = fs.readdirSync(absDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(absDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(content);

      if (data.tracks && Array.isArray(data.tracks)) {
        for (const track of data.tracks) {
          if (track.audioFile) {
            entries.push({
              audioFile: track.audioFile,
              source: path.join(dir, file),
            });
          }
        }
      }
    }
  }

  return entries;
}

/**
 * Decode audio via ffmpeg and compute normalized peaks.
 *
 * Strategy: Use ffmpeg to downsample to mono 16-bit PCM at a sample rate
 * that gives us roughly NUM_PEAKS windows across the duration. We compute
 * peaks by dividing the raw samples into NUM_PEAKS equal-sized windows and
 * taking the maximum absolute value in each window, then normalizing to 0–1.
 */
function computePeaks(audioUrl) {
  // First, get duration using ffprobe
  let duration;
  try {
    const probeResult = child_process.execSync(
      `ffprobe -v quiet -print_format json -show_format "${audioUrl}"`,
      { encoding: 'utf-8', timeout: 30000 },
    );
    const probeData = JSON.parse(probeResult);
    duration = parseFloat(probeData.format?.duration || '0');
  } catch {
    console.error(
      `  ffprobe failed for ${audioUrl}, using fallback duration detection`,
    );
    duration = 0;
  }

  // Decode to raw PCM (mono, f32le) via ffmpeg
  // We request a target sample rate that gives us enough resolution
  // Use a fixed reasonable sample rate for peak computation
  const sampleRate = 4000; // 4000 samples/sec → plenty for 200 peaks

  let rawBuffer;
  try {
    rawBuffer = child_process.execSync(
      `ffmpeg -i "${audioUrl}" -f f32le -ac 1 -ar ${sampleRate} -loglevel error pipe:1`,
      { encoding: 'buffer', timeout: 60000, maxBuffer: 50 * 1024 * 1024 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`ffmpeg decode failed for ${audioUrl}: ${message}`);
  }

  // Parse f32le samples (little-endian 32-bit float)
  const numSamples = rawBuffer.length / 4;
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    samples[i] = rawBuffer.readFloatLE(i * 4);
  }

  // If we didn't get duration from ffprobe, compute it from samples
  if (duration <= 0) {
    duration = numSamples / sampleRate;
  }

  // Divide samples into NUM_PEAKS windows and take max absolute value
  const peaks = [];
  const windowSize = Math.max(1, Math.floor(numSamples / NUM_PEAKS));

  for (let i = 0; i < NUM_PEAKS; i++) {
    const start = i * windowSize;
    const end = Math.min(start + windowSize, numSamples);
    let maxVal = 0;
    for (let j = start; j < end; j++) {
      const abs = Math.abs(samples[j]);
      if (abs > maxVal) maxVal = abs;
    }
    peaks.push(maxVal);
  }

  // Normalize peaks to 0–1 range
  const globalMax = Math.max(...peaks, 0.001); // Avoid division by zero
  const normalizedPeaks = peaks.map(
    (p) => Math.round((p / globalMax) * 1000) / 1000,
  );

  return {
    peaks: normalizedPeaks,
    duration: Math.round(duration * 10) / 10, // Round to 1 decimal
  };
}

// --- Main ---

function main() {
  console.log('🎵 Generating waveform peak data...\n');

  const r2BaseUrl = getR2PublicUrl();
  const audioFiles = collectAudioFiles();

  if (audioFiles.length === 0) {
    console.log('No audio files found in content.');
    process.exit(0);
  }

  console.log(`Found ${audioFiles.length} audio files across content files.\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of audioFiles) {
    const outputPath = getOutputPath(entry.audioFile);
    const outputAbsPath = path.resolve(process.cwd(), outputPath);

    // Skip if JSON already exists (incremental builds)
    if (fs.existsSync(outputAbsPath)) {
      console.log(`  ⏭  ${entry.audioFile} (already exists)`);
      skipped++;
      continue;
    }

    // Create output directory
    const outputDir = path.dirname(outputAbsPath);
    fs.mkdirSync(outputDir, { recursive: true });

    // Resolve audio URL
    const audioPath = resolveAudioPath(entry.audioFile, r2BaseUrl);

    console.log(`  🎶 ${entry.audioFile}`);
    console.log(`     Source: ${audioPath}`);

    try {
      const { peaks, duration } = computePeaks(audioPath);

      const jsonOutput = JSON.stringify({ peaks, duration }, null, 2);
      fs.writeFileSync(outputAbsPath, jsonOutput, 'utf-8');

      console.log(`     → ${outputPath} (${peaks.length} peaks, ${duration}s)`);
      generated++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`     ❌ Failed: ${message}`);
      failed++;
    }
  }

  console.log(
    `\n✅ Done: ${generated} generated, ${skipped} skipped, ${failed} failed.`,
  );

  if (failed > 0 && generated === 0) {
    console.error(
      '\n⚠️  No waveforms were generated. Ensure audio files are accessible.',
    );
    console.error(
      '   Set R2_PUBLIC_URL in .env or ensure local audio files are available.',
    );
    process.exit(1);
  }
}

main();
