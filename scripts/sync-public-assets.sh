#!/usr/bin/env bash
set -euo pipefail

# This script only supports R2 and minimal configuration from .env
# Required vars: ACCESS_KEY_ID, SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_ENDPOINT

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "${SCRIPT_DIR}/.." && pwd)
PUBLIC_DIR="${REPO_ROOT}/public"

usage() {
  cat <<USAGE
Usage: $(basename "$0") [--dry-run] [--apply] [--delete-extra]

Description:
  Sync public/images and public/videos to R2 using rclone.
  Reads configuration ONLY from .env file.

Options:
  --dry-run        Simulate the sync (default)
  --apply          Execute the sync
  --delete-extra   Delete files in destination not present in source (use with caution)

Required .env variables:
  ACCESS_KEY_ID
  SECRET_ACCESS_KEY
  R2_BUCKET_NAME
  R2_ENDPOINT
USAGE
}

DRY_RUN=1
DELETE_EXTRA=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      ;;
    --apply)
      DRY_RUN=0
      ;;
    --delete-extra)
      DELETE_EXTRA=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
  shift
done

# Load .env
if [[ -f "${REPO_ROOT}/.env" ]]; then
  set -a
  source "${REPO_ROOT}/.env"
  set +a
else
  echo "Error: .env file not found at ${REPO_ROOT}/.env" >&2
  exit 1
fi

# Check required variables
MISSING_VARS=0
for VAR in ACCESS_KEY_ID SECRET_ACCESS_KEY R2_BUCKET_NAME R2_ENDPOINT; do
  if [[ -z "${!VAR:-}" ]]; then
    echo "Error: ${VAR} is not set in .env" >&2
    MISSING_VARS=1
  fi
done

if [[ "${MISSING_VARS}" -eq 1 ]]; then
  exit 1
fi

if [[ ! -d "${PUBLIC_DIR}" ]]; then
  echo "public/ directory not found: ${PUBLIC_DIR}. Nothing to sync." >&2
  exit 0
fi

if ! command -v rclone >/dev/null 2>&1; then
  echo "rclone is required but not found in PATH" >&2
  exit 1
fi

# Configure Rclone environment variables directly
export RCLONE_CONFIG_R2_TYPE="s3"
export RCLONE_CONFIG_R2_PROVIDER="Cloudflare"
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="${ACCESS_KEY_ID}"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="${SECRET_ACCESS_KEY}"
# Normalize R2_ENDPOINT: specific bucket path should be removed for standard S3 config
echo "DEBUG: Raw R2_ENDPOINT: '${R2_ENDPOINT}'"
echo "DEBUG: Raw R2_BUCKET_NAME: '${R2_BUCKET_NAME}'"

# 1. Remove ALL trailing slashes using sed
CLEANED_ENDPOINT=$(echo "${R2_ENDPOINT}" | sed 's:/*$::')

# 2. If endpoint ends with /bucket-name, strip it
SUFFIX="/${R2_BUCKET_NAME}"
if [[ "${CLEANED_ENDPOINT}" == *"${SUFFIX}" ]]; then
  echo "Notice: R2_ENDPOINT includes bucket name. Stripping it for standard S3 configuration."
  CLEANED_ENDPOINT="${CLEANED_ENDPOINT%${SUFFIX}}"
fi

echo "DEBUG: Cleaned R2_ENDPOINT: '${CLEANED_ENDPOINT}'"

export RCLONE_CONFIG_R2_ENDPOINT="${CLEANED_ENDPOINT}"
export RCLONE_CONFIG_R2_REGION="auto"
export RCLONE_CONFIG_R2_FORCE_PATH_STYLE="true"

# Standard S3 destination: remote:bucket
DESTINATION="r2:${R2_BUCKET_NAME}"

COMMAND="copy"
if [[ "${DELETE_EXTRA}" -eq 1 ]]; then
  COMMAND="sync"
fi

RCLONE_ARGS=(
  "${COMMAND}"
  "--exclude" ".DS_Store"
  "--exclude" "**/.DS_Store"
)

if [[ "${DRY_RUN}" -eq 1 ]]; then
  RCLONE_ARGS+=("--dry-run")
fi

# Media index generation is decoupled. 
# Run 'python3 scripts/generate-media-index.py' manually if needed before syncing.

# Sync only images and videos directories
# This prevents polluting root and ensures we don't double-nest if we control the destination path manually
SYNC_DIRS=("images" "videos")

echo "Starting sync to ${DESTINATION}..."

for DIR in "${SYNC_DIRS[@]}"; do
  if [[ -d "${PUBLIC_DIR}/${DIR}" ]]; then
    # Full destination path: r2:bucket-name/images
    SUB_DEST="${DESTINATION}/${DIR}"
    
    echo "----------------------------------------------------------------"
    echo "Syncing ${DIR} -> ${SUB_DEST}"
    
    rclone "${RCLONE_ARGS[@]}" "${PUBLIC_DIR}/${DIR}/" "${SUB_DEST}"
  else
    echo "Warning: ${PUBLIC_DIR}/${DIR} does not exist, skipping."
  fi
done
