import type { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const baseUrl = 'https://www.onwalk.net'
const contentRoot = path.join(process.cwd(), 'content')

type ContentSection = {
  folder: string
  route: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

const sections: ContentSection[] = [
  {
    folder: 'blog',
    route: 'blog',
    changeFrequency: 'weekly',
    priority: 0.7,
  },
  {
    folder: 'images',
    route: 'images',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    folder: 'videos',
    route: 'videos',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
]

const indexEntries: MetadataRoute.Sitemap = [
  {
    url: `${baseUrl}/`,
    changeFrequency: 'weekly',
    priority: 1.0,
  },
  {
    url: `${baseUrl}/blog/`,
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: `${baseUrl}/images/`,
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${baseUrl}/videos/`,
    changeFrequency: 'monthly',
    priority: 0.8,
  },
]

const contentExtensions = new Set(['.md', '.mdx'])

const getContentEntries = (
  section: ContentSection,
): MetadataRoute.Sitemap => {
  const directory = path.join(contentRoot, section.folder)
  if (!fs.existsSync(directory)) {
    return []
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => contentExtensions.has(path.extname(name)))
    .map((name) => {
      const slug = path.basename(name, path.extname(name))
      const filePath = path.join(directory, name)
      const { mtime } = fs.statSync(filePath)

      return {
        url: `${baseUrl}/${section.route}/${slug}`,
        lastModified: mtime,
        changeFrequency: section.changeFrequency,
        priority: section.priority,
      }
    })
}

export default function sitemap(): MetadataRoute.Sitemap {
  const contentEntries = sections.flatMap((section) =>
    getContentEntries(section),
  )

  return [...indexEntries, ...contentEntries]
}
