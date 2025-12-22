import path from 'path'
import { cache } from 'react'

import { readMdxDirectory } from './mdx'

export interface DocVersion {
  slug: string
  label: string
  title: string
  description: string
  updatedAt?: string
  tags: string[]
  content: string
  isMdx: boolean
}

export interface DocCollection {
  slug: string
  title: string
  description: string
  updatedAt?: string
  tags: string[]
  versions: DocVersion[]
  defaultVersionSlug: string
  category?: string
}

const DOC_CONTENT_ROOT = path.join(process.cwd(), 'src', 'content', 'doc')
const DOC_EXTENSIONS = ['.md', '.mdx']

const readDocFiles = cache(async () =>
  readMdxDirectory('', {
    baseDir: DOC_CONTENT_ROOT,
    recursive: true,
    extensions: DOC_EXTENSIONS,
  }),
)

function humanize(value: string) {
  return value
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function buildExcerpt(markdown: string): string {
  const cleaned = markdown
    .replace(/^\s*import\s+.*$/gm, '')
    .replace(/^\s*export\s+const\s+.*$/gm, '')
    .trim()

  const blocks = cleaned.split(/\r?\n\s*\r?\n/)
  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) continue
    const withoutFormatting = trimmed
      .replace(/^#+\s*/g, '')
      .replace(/[`*_>\[\]]/g, '')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    if (withoutFormatting.trim()) {
      return withoutFormatting.trim()
    }
  }
  return ''
}

function normalizeDoc(file: Awaited<ReturnType<typeof readDocFiles>>[number]): DocVersion & {
  collection: string
  collectionLabel: string
} {
  const segments = file.slug.split('/')
  const collection = typeof file.metadata.collection === 'string' ? file.metadata.collection : segments[0] || 'docs'
  const collectionLabel =
    typeof file.metadata.collectionLabel === 'string'
      ? file.metadata.collectionLabel
      : humanize(collection)

  const versionSlug = typeof file.metadata.versionSlug === 'string' ? file.metadata.versionSlug : segments.at(-1) ?? 'latest'
  const label = typeof file.metadata.version === 'string' ? file.metadata.version : versionSlug
  const title = typeof file.metadata.title === 'string' ? file.metadata.title : label
  const description =
    typeof file.metadata.description === 'string' ? file.metadata.description : buildExcerpt(file.content)
  const updatedAt = typeof file.metadata.updatedAt === 'string' ? file.metadata.updatedAt : undefined
  const tags = Array.isArray(file.metadata.tags)
    ? file.metadata.tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
    : []
  const isMdx = String(file.metadata.format || '').toLowerCase() === 'mdx'

  return {
    slug: versionSlug,
    label,
    title,
    description,
    updatedAt,
    tags,
    content: file.content,
    isMdx,
    collection,
    collectionLabel,
  }
}

export const getDocCollections = cache(async (): Promise<DocCollection[]> => {
  try {
    const files = await readDocFiles()
    const docs = files.map(normalizeDoc)

    const collections = new Map<
      string,
      {
        collectionLabel: string
        versions: DocVersion[]
      }
    >()

    for (const doc of docs) {
      const existing = collections.get(doc.collection)
      const version: DocVersion = {
        slug: doc.slug,
        label: doc.label,
        title: doc.title,
        description: doc.description,
        updatedAt: doc.updatedAt,
        tags: doc.tags,
        content: doc.content,
        isMdx: doc.isMdx,
      }

      if (existing) {
        existing.versions.push(version)
        continue
      }
      collections.set(doc.collection, {
        collectionLabel: doc.collectionLabel,
        versions: [version],
      })
    }

    const result: DocCollection[] = []
    for (const [slug, data] of collections.entries()) {
      const versions = [...data.versions].sort((a, b) => {
        const aDate = a.updatedAt ? Date.parse(a.updatedAt) : 0
        const bDate = b.updatedAt ? Date.parse(b.updatedAt) : 0
        if (aDate && bDate && aDate !== bDate) {
          return bDate - aDate
        }
        return a.title.localeCompare(b.title)
      })

      const primary = versions[0]
      if (!primary) continue

      result.push({
        slug,
        title: data.collectionLabel,
        description: primary.description,
        updatedAt: primary.updatedAt,
        tags: versions.flatMap((item) => item.tags ?? []),
        versions,
        defaultVersionSlug: primary.slug,
      })
    }

    return result.sort((a, b) => {
      const aDate = a.updatedAt ? Date.parse(a.updatedAt) : 0
      const bDate = b.updatedAt ? Date.parse(b.updatedAt) : 0
      if (aDate && bDate && aDate !== bDate) {
        return bDate - aDate
      }
      return a.title.localeCompare(b.title)
    })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
    return []
  }
})

export async function getDocCollection(slug: string): Promise<DocCollection | undefined> {
  const collections = await getDocCollections()
  return collections.find((collection) => collection.slug === slug)
}

export async function getDocVersion(
  collectionSlug: string,
  versionSlug: string,
): Promise<{ collection: DocCollection; version: DocVersion } | undefined> {
  const collection = await getDocCollection(collectionSlug)
  if (!collection) return undefined
  const version = collection.versions.find((item) => item.slug === versionSlug)
  if (!version) return undefined
  return { collection, version }
}

export async function getDocParams() {
  const collections = await getDocCollections()
  return collections.flatMap((collection) =>
    collection.versions.map((version) => ({ collection: collection.slug, version: version.slug })),
  )
}
