
# Asset Canonical Path

s3name/public/{type}/{country}/{province}/{city}/{scene}/{filename}

字段定义（不可变）
字段	含义	示例
type	资源类型	images | videos
country	国家	china
province	省 / 州	shanghai
city	城市 / 地区	jiading
scene	固定语义	drone | landscape | citywalk | architecture | night | panorama
filename	原始文件名	IMG_6875.JPG
Next.js Route 映射
/images/[...slug]
/videos/[...slug]


slug 必须展开为：

[country, province, city, scene, filename]

# Asset Routing & Storage Design

## 1. Purpose

This document defines the canonical structure and routing rules for
image and video assets used by the Onwalk / Portal system.

Goals:

- Stable, predictable URLs
- Geography-first organization
- Fixed semantic categories
- Compatible with S3 / CDN / Next.js
- Friendly to AI indexing and automation

This is an **archive system**, not a photo gallery.

---

## 2. Canonical Storage Path

All assets MUST follow this structure:

s3name/public/{type}/{country}/{province}/{city}/{scene}/{filename}

shell
复制代码

### Example

s3://onwalk-assets/public/images/china/shanghai/jiading/drone/IMG_6875.JPG

yaml
复制代码

---

## 3. Type Definition

| Type | Description |
|----|----|
| images | All image assets (jpg, png, webp, svg) |
| videos | All video assets (mp4, mov, webm) |

---

## 4. Geographic Hierarchy

### Level 1: country
- ISO-style lowercase
- Example: `china`

### Level 2: province
- Province / State / Region
- Example: `shanghai`, `xinjiang`, `zhejiang`

### Level 3: city
- City or well-known geographic area
- Can be natural landscape names
- Example: `jiading`, `sayram-lake`, `jiuzhaigou`

---

## 5. Scene (Semantic Layer)

Scene is a **fixed enum**.  
No new values are allowed without updating this document.

drone
landscape
citywalk
architecture
night
panorama

yaml
复制代码

Scene represents **how the image is seen**, not what it depicts.

---

## 6. Public URL Routing

Next.js exposes assets via catch-all routes:

/images/[...slug]
/videos/[...slug]

css
复制代码

Slug MUST resolve to:

[country, province, city, scene, filename]

yaml
复制代码

The route handler maps the slug directly to the canonical storage path.

---

## 7. Routing Invariants

- URLs are stable forever once published
- No time-based paths
- No camera / EXIF data in paths
- No language variants in asset paths
- All metadata lives outside the path

---

## 8. Error Handling Rules

- Invalid slug length → 404
- Invalid scene value → 404
- Unsupported file extension → 404
- Missing asset → 404

No redirects, no guessing.

---

## 9. Future Extensions (Non-breaking)

Allowed:
- CDN layer
- Signed URLs
- Image optimization (Next/Image)
- AI metadata sidecars (JSON)

Not allowed:
- Changing path depth
- Adding new scene types ad-hoc
- Mixing UI assets into this system

---

## 10. Philosophy

Geography is the skeleton.  
Scene is the muscle.  
Time is metadata.  

Paths must remain boring.

---

## 11. Vercel Compatibility

This project is designed to be fully compatible with Vercel deployments,
while keeping the canonical asset path independent of any specific hosting
provider.

Vercel is treated as an **edge router and compute layer**, not as the
source of truth for asset storage.

---

### 11.1 Canonical vs Runtime Paths

Canonical storage path (source of truth):

s3name/public/{type}/{country}/{province}/{city}/{scene}/{filename}

vbnet
复制代码

Public runtime URL on Vercel:

/images/{country}/{province}/{city}/{scene}/{filename}
/videos/{country}/{province}/{city}/{scene}/{filename}

yaml
复制代码

The runtime URL MUST map 1:1 to the canonical path.
No path rewriting logic is allowed beyond prefix mapping.

---

### 11.2 Why Not `/public/images/...` on Vercel

Vercel's `public/` directory is designed for **small, static, UI-bound assets**
and does not scale for:

- Large photo collections
- Video streaming
- Long-term archival growth
- S3-backed or CDN-backed storage

Therefore:

- `public/` is NOT used for photographic or video archives
- All media assets are served through route handlers

---

### 11.3 Route Handlers (App Router)

Vercel-compatible routes:

Vercel-compatible routes:

app/images/[...slug]/route.ts
app/videos/[...slug]/route.ts

yaml
复制代码

Each handler:

- Validates slug structure
- Validates scene enum
- Maps slug → canonical S3 path
- Responds with either:
  - Redirect (CDN-backed)
  - Proxy stream (Edge or Node runtime)

---

### 11.4 Runtime Selection

#### Images
- Prefer **Edge Runtime**
- Stateless
- Cacheable
- CDN-friendly

#### Videos
- Prefer **Node.js Runtime**
- Supports range requests
- Allows future streaming / chunking

Runtime choice MUST NOT affect the URL structure.

---

### 11.5 Caching Strategy

Handlers MUST emit cache headers compatible with Vercel Edge Cache:

Cache-Control: public, max-age=31536000, immutable

yaml
复制代码

Assets are assumed to be immutable once published.

---

### 11.6 Environment Configuration

All environment-specific configuration MUST be injected via environment variables.

Required variables:

ASSET_BUCKET_NAME
ASSET_PUBLIC_PREFIX=public
ASSET_BASE_URL # Optional CDN base

yaml
复制代码

The routing logic MUST NOT hardcode provider-specific values.

---

### 11.7 Vercel Limits & Design Decisions

This design intentionally avoids:

- Server-side filesystem access
- Runtime directory scanning
- Dynamic asset discovery
- Time-based path logic

This ensures compatibility with:

- Vercel Serverless
- Vercel Edge Functions
- Future multi-region deployments

---

### 11.8 Deployment Philosophy

Vercel is a **stateless delivery layer**.

Assets live elsewhere.
Paths never change.
Compute is disposable.

This guarantees:
- Zero vendor lock-in
- Easy migration
- Predictable URLs

---

## 12. Result Check (Integration / Deploy / Verify)

This section is a minimal checklist for confirming the routing design
works end-to-end without changing URL structure.

### 12.1 Integration Checklist

- Routes exist:
  - `app/images/[...slug]/route.ts` (Edge runtime)
  - `app/videos/[...slug]/route.ts` (Node.js runtime)
- Slug validation is strict:
  - `slug.length === 5`
  - `scene` is one of: `drone | landscape | citywalk | architecture | night | panorama`
  - file extension matches type (images: `jpg/jpeg/png/webp/svg`, videos: `mp4/mov/webm`)
- Canonical key mapping is exact:
  - `public/images/{country}/{province}/{city}/{scene}/{filename}`
  - `public/videos/{country}/{province}/{city}/{scene}/{filename}`
- Response behavior:
  - valid input → `302` redirect to R2 public URL
  - invalid input → `404`
  - `Cache-Control: public, max-age=31536000, immutable`
- `next/image` remotePatterns allow same-origin `/images/**`.

### 12.2 Deployment Checklist (Vercel)

- Set environment variable:
  - `R2_PUBLIC_BASE_URL` = `https://<your-r2-public-domain>`
- Deploy without adding new path aliases or moving files.
- Confirm the route handlers do not access the filesystem.

### 12.3 Verification Steps

Use the canonical URL shape in a page or API response:

tsx
复制代码
import Image from "next/image";

<Image
  src="/images/china/shanghai/jiading/drone/IMG_6875.JPG"
  width={1600}
  height={900}
  alt="Jiading Drone"
/>

Verify behavior:

- `/images/...` returns `302` with `Location: ${R2_PUBLIC_BASE_URL}/public/images/...`
- `/videos/...` returns `302` with `Location: ${R2_PUBLIC_BASE_URL}/public/videos/...`
- Invalid scene, wrong extension, or slug length != 5 → `404`
- `Cache-Control` is immutable as specified
