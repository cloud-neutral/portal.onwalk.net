#!/usr/bin/env bash
set -euo pipefail

MCP_PROFILE="/tmp/chrome-mcp-profile"
CHROME_PORT=9222
LOG_DIR=".dev-logs"

mkdir -p "$LOG_DIR"

echo "[MCP] Cleaning stale Chrome processes..."
pkill -f "$MCP_PROFILE" || true

echo "[MCP] Starting Chrome (remote debugging)..."
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=$CHROME_PORT \
  --user-data-dir=$MCP_PROFILE \
  --disable-extensions \
  --disable-background-networking \
  > "$LOG_DIR/chrome.log" 2>&1 &

echo "[MCP] Waiting for Chrome DevTools endpoint..."
for i in {1..20}; do
  if curl -sf "http://127.0.0.1:$CHROME_PORT/json/version" >/dev/null; then
    echo "[MCP] Chrome is ready."
    break
  fi
  sleep 0.5
done

echo "[MCP] Chrome DevTools ready on port $CHROME_PORT"

echo "[MCP] (Optional) Pre-warming chrome-devtools-mcp..."
npx -y chrome-devtools-mcp@latest \
  --browser-url="http://127.0.0.1:$CHROME_PORT" \
  > "$LOG_DIR/chrome-mcp.log" 2>&1 &

echo "[MCP] Done. You can now run: npm run dev"
