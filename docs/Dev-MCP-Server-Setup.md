# Dev MCP Server Setup Guide

This document describes how to set up a local MCP (Model Context Protocol) development environment that connects:

GitHub (repo & code context)

- Next.js runtime (application state)
Chrome DevTools (real browser, DOM, network, performance)
The goal is to provide AI agents with a full-stack, real-world execution context.

1. Architecture Overview

┌────────────┐
│  GitHub MCP│───► Repo / PR / Code context
└────────────┘
        │
┌────────────┐
│ Next MCP   │───► Next.js runtime (routes, errors, hydration)
└────────────┘
        │
┌────────────┐
│ Chrome MCP │───► Real browser (DOM, network, performance)
└────────────┘


Important:
MCP servers do not launch services for you.
They only attach to already-running processes.

2. Prerequisites
2.1 Node.js
node -v

Required: Node.js ≥ 20.19
Recommended: Node 20 LTS or newer

2.2 Chrome (Remote Debugging)

Chrome must be launched with a remote debugging port.

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-mcp-profile \
  --disable-extensions \
  --disable-background-networking


Verification (must succeed):

http://127.0.0.1:9222/json/version
npx -y chrome-devtools-mcp@latest --browser-url=http://127.0.0.1:9222

If this endpoint is unreachable, chrome-devtools MCP will never work.

3. Codex MCP Configuration

File location:

~/.codex/config.toml

3.1 GitHub MCP
[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"
bearer_token_env_var = "CODEX_GITHUB_PERSONAL_ACCESS_TOKEN"


Export token once per shell (or in .zshrc):

export CODEX_GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxx

3.2 Chrome DevTools MCP
[mcp_servers.chrome-devtools]
type = "stdio"
command = "npx"
args = [
  "-y",
  "chrome-devtools-mcp@latest",
  "--browser-url=http://127.0.0.1:9222"
]
startup_timeout_sec = 10


Why --browser-url?

Avoids env propagation issues

Works reliably in non-interactive shells

Matches Codex execution model

3.3 Next.js DevTools MCP
[mcp_servers.next-devtools]
type = "stdio"
command = "npx"
args = ["-y", "next-devtools-mcp@latest"]
startup_timeout_sec = 30

4. Project-level .mcp.json (Optional but Recommended)

Used by editors / local tooling:

{
  "mcpServers": {
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    },
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--browser-url=http://127.0.0.1:9222"
      ]
    }
  }
}

5. Startup Order (Critical)

Chrome (remote debugging enabled)

Next.js dev server

Codex / MCP client

If MCP starts before Chrome or Next.js, it will fail silently.

6. Validation Checklist
Check	Command
Chrome alive	curl http://127.0.0.1:9222/json/version
MCP list	codex mcp list
Next.js	http://localhost:3000
MCP attached	Codex shows chrome-devtools, next-devtools
7. Common Failures

initialize response connection closed
→ npx cache corruption → clear ~/.npm/_npx

Chrome opens but MCP fails
→ wrong port / wrong Chrome instance

Works in terminal, fails in Codex
→ missing -y or missing --browser-url

Summary

Treat Chrome and Next.js as local services, and MCP as a control plane that attaches to them.
