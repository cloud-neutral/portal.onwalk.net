#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> [prebuild] Step 1: Sync content repository"
bash "${SCRIPT_DIR}/clone-content.sh"

echo "==> [prebuild] Step 2: Generate media index from local assets"
# bash "${SCRIPT_DIR}/generate-media-index.sh"
python3 "${SCRIPT_DIR}/generate-media-index.py"

echo "==> [prebuild] All prebuild steps completed"
