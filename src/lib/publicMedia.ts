import fs from 'node:fs/promises'
import path from 'node:path'

import { unstable_cache } from 'next/cache'

import type { ContentItem } from '@/lib/content'

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const PUBLIC_VIDEOS_DIR = path.join(process.cwd(), 'public', 'videos')

type FileWithMtime = {
  name: string
  mtimeMs: number
}

const slugToTitle = (slug: string) => slug.replace(/[-_]+/g, ' ').trim()

async function listFilesByMtime(
  directory: string,
  filter: (name: string) => boolean,
): Promise<FileWithMtime[]> {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    const names = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter(filter)

    const files = await Promise.all(
      names.map(async (name) => {
        const stats = await fs.stat(path.join(directory, name))
        return { name, mtimeMs: stats.mtimeMs }
      }),
    )

    return files.sort((a, b) => {
      if (b.mtimeMs !== a.mtimeMs) return b.mtimeMs - a.mtimeMs
      return a.name.localeCompare(b.name, 'en')
    })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw error
  }
}

export const getLatestPublicImages = unstable_cache(
  async (limit: number): Promise<ContentItem[]> => {
    const files = await listFilesByMtime(PUBLIC_IMAGES_DIR, (name) =>
      IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()),
    )

    return files.slice(0, limit).map((file, index) => {
      const slug = file.name.replace(/\.[^.]+$/, '')
      const title = slugToTitle(slug)
      return {
        slug,
        title: title || `Image ${index + 1}`,
        cover: `/images/${file.name}`,
        content: '',
      }
    })
  },
  ['latest-public-images'],
)

export const getLatestPublicVideos = unstable_cache(
  async (limit: number): Promise<ContentItem[]> => {
    const files = await listFilesByMtime(PUBLIC_VIDEOS_DIR, (name) => name.toLowerCase().endsWith('.mp4'))

    return files.slice(0, limit).map((file, index) => {
      const slug = file.name.replace(/\.mp4$/i, '')
      const title = slugToTitle(slug)
      return {
        slug,
        title: title || `Video ${index + 1}`,
        src: `/videos/${file.name}`,
        content: '',
      }
    })
  },
  ['latest-public-videos'],
)
