import fs from 'node:fs/promises'
import path from 'node:path'

import type { ContentItem } from '@/lib/content'

export type MediaKind = 'images' | 'videos'
export type MediaSort = 'latest' | 'name'

// Defined in scripts/generate-media-index.py
interface MediaIndexItem {
  path: string
  ext: string
  type: 'image' | 'video'
}

async function readMediaIndex(kind: MediaKind): Promise<MediaIndexItem[]> {
  try {
    const indexPath = path.join(process.cwd(), 'public', '_media', `${kind}.json`)
    const content = await fs.readFile(indexPath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Failed to read media index for ${kind}:`, error)
    return []
  }
}

export async function listMediaItems(
  kind: MediaKind,
  options?: { limit?: number; sort?: MediaSort },
): Promise<ContentItem[]> {
  const indexItems = await readMediaIndex(kind)

  // Transform to ContentItem
  const baseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
  if (!baseUrl) {
    console.warn('NEXT_PUBLIC_MEDIA_BASE_URL is not defined')
  }

  // Canonical URL rule: ${MEDIA_BASE_URL}images/${path}
  // The index 'path' is relative to /images/ (no public/ prefix)
  const items: ContentItem[] = indexItems.map((item) => {
    // Determine the base path segment based on kind
    // e.g. kind='images' -> url = .../images/...
    const url = `${baseUrl || '/'}${kind}/${item.path}`

    // Title from filename (simple heuristic)
    const filename = path.basename(item.path)
    const title = filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()

    return {
      slug: item.path,
      title,
      content: '', // No content for media items
      ...(kind === 'images' ? { cover: url } : { src: url }),
    }
  })

  // Sort
  const sort = options?.sort ?? 'name'

  if (sort === 'name') {
    items.sort((a, b) => a.slug.localeCompare(b.slug, 'en'))
  } else {
    // For 'latest' in the context of static files without mtime in JSON,
    // we can reverse sort by path as a proxy if files are named chronologically,
    // or just fallback to alpha. The index generation script sorts by path.
    // If we really need 'latest', we'd need date info in the JSON index.
    // For now, reverse alpha or just 'name' is the best we can do without metadata.
    // Reverting to alpha sort (or reverse alpha) based on legacy behavior approximation.
    // Legacy used mtime. We don't have it. Let's use reverse path for 'latest'.
    items.sort((a, b) => b.slug.localeCompare(a.slug, 'en'))
  }

  if (options?.limit) {
    return items.slice(0, options.limit)
  }

  return items
}
