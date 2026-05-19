#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# setup-dev-audio.sh
#
# Generates placeholder MP3 files for every track listed in release frontmatter,
# so developers can run the site locally with playable audio without needing
# access to the Cloudflare R2 bucket.
#
# Usage:
#   bash scripts/setup-dev-audio.sh
#
# Prerequisites:
#   - ffmpeg (https://ffmpeg.org)
# =============================================================================

# --- Determine project root (works regardless of CWD) ---
PROJECT_ROOT="$(git rev-parse --show-toplevel)"

# --- Check for ffmpeg ---
if ! command -v ffmpeg &>/dev/null; then
  echo "❌  ffmpeg not found on PATH." >&2
  echo "   Install it with:  brew install ffmpeg  (macOS)" >&2
  echo "                     apt install ffmpeg   (Ubuntu/Debian)" >&2
  exit 1
fi

# --- Parse audioFile entries from release frontmatter ---
RELEASES_DIR="${PROJECT_ROOT}/src/content/releases"
OUTPUT_DIR="${PROJECT_ROOT}/public/audio-samples"

if [ ! -d "${RELEASES_DIR}" ]; then
  echo "❌  Releases directory not found: ${RELEASES_DIR}" >&2
  exit 1
fi

# Extract all audioFile values from YAML frontmatter.
# Lines look like:      audioFile: releases/echoes-ep/01-reverberations.mp3
audio_files=()
while IFS= read -r line; do
  # Trim leading whitespace, strip the key, keep the value
  path="$(echo "${line}" | sed 's/^[[:space:]]*audioFile:[[:space:]]*//' | xargs)"
  if [ -n "${path}" ]; then
    audio_files+=("${path}")
  fi
done < <(grep -h 'audioFile:' "${RELEASES_DIR}"/*.md)

if [ ${#audio_files[@]} -eq 0 ]; then
  echo "⚠️   No audioFile entries found in ${RELEASES_DIR}/*.md"
  exit 0
fi

# --- Count unique release slugs for summary ---
release_slugs=""
for f in "${audio_files[@]}"; do
  # Extract release slug: releases/<slug>/... → <slug>
  slug="$(echo "${f}" | sed 's|^releases/||' | cut -d'/' -f1)"
  # Append unique slugs (space-separated list)
  case " ${release_slugs} " in
    *" ${slug} "*) ;;
    *) release_slugs="${release_slugs:+${release_slugs} }${slug}" ;;
  esac
done
num_releases="$(echo "${release_slugs}" | wc -w | xargs)"
num_tracks=${#audio_files[@]}

# --- Generate placeholder MP3 files ---
generated=0
for audio_path in "${audio_files[@]}"; do
  target="${OUTPUT_DIR}/${audio_path}"
  target_dir="$(dirname "${target}")"

  mkdir -p "${target_dir}"

  ffmpeg \
    -loglevel error \
    -y \
    -f lavfi -i anullsrc=r=44100:cl=stereo \
    -t 3 \
    -q:a 9 \
    "${target}"

  generated=$((generated + 1))
done

# --- Summary ---
echo ""
echo "✅  Generated ${generated} placeholder audio file(s) for ${num_releases} release(s)."
echo ""
echo "⚠️   To hear audio in local dev, add this to your .env:"
echo "    R2_PUBLIC_URL=http://localhost:4321/audio-samples"
