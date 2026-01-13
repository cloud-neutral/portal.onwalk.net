# Onwalk — Walking with a Camera

This repository hosts the website for **[www.onwalk.net](https://www.onwalk.net)**.

Onwalk is a long-term personal project focused on walking and photography,  
documenting cities, outdoor spaces, and overlooked details through images and text.

---

## About the Project

Onwalk is not a framework or a generic website template.  
It is the technical implementation behind a living photography and writing site.

The emphasis is on:

- Walking as a way of seeing  
- Photography as a form of slow observation  
- Cities, outdoors, and quiet spatial details  
- Long-term accumulation rather than short-term publishing

The code exists to support the content — not the other way around.

---

## Technical Overview

- **Framework**: Next.js (App Router)
- **Rendering**: Static-first, lightweight, SEO-oriented
- **Backend**: Optional / none by default
- **Content**:
  - Markdown-based
  - Local filesystem or S3-compatible object storage
- **Assets**:
  - Images and media stored outside the application runtime
  - CDN-friendly and portable

The site is designed to remain usable even without a traditional backend service.

---

## Development

`npm run dev` now boots the local MCP dependencies first (Chrome remote debugging
plus the chrome-devtools MCP bridge), then starts the Next.js dev server.

If you need a plain Next.js dev server without MCP, use `npm run dev:raw`.

---

## Content Philosophy

- Text and images are treated as long-term assets
- Content is portable (Markdown + object storage)
- No platform lock-in
- The site should be easy to migrate, archive, or rebuild years later

---

## Future Direction

The project plans to experiment with **AI-assisted content workflows**, including:

- MCP-style agents to assist with:
  - Content organization
  - Tagging and metadata generation
  - Writing support and summarization
- AI as an assistant, not a replacement for authorship or observation

These capabilities are optional and additive, and will not change the core nature of the site.

---

## Website

👉 https://www.onwalk.net

---

## License

This repository contains both code and content.

- Code: MIT (or your preferred license)
- Content: All rights reserved, unless stated otherwise
