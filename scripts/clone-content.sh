#!/usr/bin/env bash
set -euo pipefail

CONTENT_DIR="src/content"
REPO_URL="https://github.com/photo-workspace/content.onwalk.net.git"

if [ -d "${CONTENT_DIR}/.git" ]; then
  git -C "${CONTENT_DIR}" fetch --depth=1 origin main
  git -C "${CONTENT_DIR}" reset --hard origin/main
  exit 0
fi

if [ -d "${CONTENT_DIR}" ]; then
  if [ -z "$(ls -A "${CONTENT_DIR}" 2>/dev/null)" ]; then
    rmdir "${CONTENT_DIR}"
  else
    echo "Content directory exists without git; skipping clone."
    exit 0
  fi
fi

git clone --depth=1 "${REPO_URL}" "${CONTENT_DIR}"
