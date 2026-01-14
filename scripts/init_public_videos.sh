#!/usr/bin/env bash

set -euo pipefail

BASE="public/videos/china"

SCENES=(drone landscape citywalk architecture night panorama)

mkdir_city() {
  local province="$1"
  local city="$2"

  for scene in "${SCENES[@]}"; do
    mkdir -p "${BASE}/${province}/${city}/${scene}"
  done
}

# ===== Shanghai =====
mkdir_city shanghai jiading
mkdir_city shanghai huangpu
mkdir_city shanghai lingang
mkdir_city shanghai pudong
mkdir_city shanghai bund-north

# ===== Jiangsu =====
mkdir_city jiangsu dianshan-lake
mkdir_city jiangsu nanjing

# ===== Zhejiang =====
mkdir_city zhejiang kuocang-mountain
mkdir_city zhejiang zhoushan-islands

# ===== Fujian =====
mkdir_city fujian dayu-mountain-island
mkdir_city fujian xiawei-island

# ===== Xinjiang =====
mkdir_city xinjiang anjihai-canyon
mkdir_city xinjiang guozigou-bridge
mkdir_city xinjiang nalati-grassland
mkdir_city xinjiang sayram-lake
mkdir_city xinjiang tekes-bagua-city
mkdir_city xinjiang xiata

# ===== Yunnan =====
mkdir_city yunnan yulong-snow-mountain

# ===== Sichuan =====
mkdir_city sichuan jiuzhaigou

# ===== Jilin =====
mkdir_city jilin liaoyuan-yangmu-reservoir

# ===== Guangdong =====
mkdir_city guangdong shenzhen-meisha

echo "✅ public/videos initialized"

