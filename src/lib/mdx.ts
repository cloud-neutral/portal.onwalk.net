import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { promises as fs } from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { Readable } from 'stream'

export type FrontMatterValue = string | string[]

export interface MdxFile {
  metadata: Record<string, FrontMatterValue>
  content: string
  raw: string
  slug: string
}

export type MdxSource =
  | { type: 'filesystem'; filePath: string }
  | { type: 'volume'; filePath: string }
  | { type: 'http'; url: string; headers?: Record<string, string> }
  | { type: 's3'; bucket: string; key: string; region?: string; client?: S3Client }

const DEFAULT_CONTENT_ROOT = path.join(process.cwd(), 'src', 'content')
const DEFAULT_EXTENSIONS = ['.mdx', '.md']

async function streamToString(stream: Readable): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf-8')
}

async function readableStreamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    if (value) {
      chunks.push(value)
    }
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString('utf-8')
}

async function objectBodyToString(body: unknown): Promise<string> {
  if (!body) {
    throw new Error('S3 object body is empty')
  }

  if (typeof body === 'string') {
    return body
  }

  if (body instanceof Uint8Array) {
    return Buffer.from(body).toString('utf-8')
  }

  if (body instanceof Readable) {
    return streamToString(body)
  }

  if (body instanceof Blob) {
    return body.text()
  }

  if (typeof (body as ReadableStream<Uint8Array>).getReader === 'function') {
    return readableStreamToString(body as ReadableStream<Uint8Array>)
  }

  throw new Error('Unsupported S3 body type')
}

function normalizeMetadata(data: Record<string, unknown>): Record<string, FrontMatterValue> {
  return Object.entries(data).reduce<Record<string, FrontMatterValue>>((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = value
    } else if (Array.isArray(value)) {
      const items = value.filter((item): item is string => typeof item === 'string')
      if (items.length) {
        acc[key] = items
      }
    } else if (value != null) {
      acc[key] = String(value)
    }
    return acc
  }, {})
}

export async function loadMdxSource(source: MdxSource): Promise<string> {
  switch (source.type) {
    case 'filesystem':
    case 'volume': {
      return fs.readFile(source.filePath, 'utf-8')
    }
    case 'http': {
      const response = await fetch(source.url, { headers: source.headers })
      if (!response.ok) {
        throw new Error(`Failed to fetch MDX from ${source.url}: ${response.status} ${response.statusText}`)
      }
      return response.text()
    }
    case 's3': {
      const client = source.client ?? new S3Client({ region: source.region })
      const result = await client.send(new GetObjectCommand({ Bucket: source.bucket, Key: source.key }))
      return objectBodyToString(result.Body)
    }
    default:
      throw new Error('Unsupported MDX source')
  }
}

async function resolveFilePath(relativePath: string, baseDir: string, extensions: string[]): Promise<string> {
  const targetPath = path.isAbsolute(relativePath) ? relativePath : path.join(baseDir, relativePath)
  const hasExtension = Boolean(path.extname(targetPath))
  const candidatePaths = hasExtension ? [targetPath] : extensions.map((ext) => `${targetPath}${ext}`)

  for (const candidate of candidatePaths) {
    try {
      await fs.access(candidate)
      return candidate
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error
      }
    }
  }

  throw new Error(`MDX file not found at ${relativePath}`)
}

export async function readMdxFile(
  relativePath: string,
  options?: { baseDir?: string; extensions?: string[] }
): Promise<MdxFile> {
  const baseDir = options?.baseDir ?? DEFAULT_CONTENT_ROOT
  const extensions = options?.extensions ?? DEFAULT_EXTENSIONS
  const absolutePath = await resolveFilePath(relativePath, baseDir, extensions)
  const raw = await loadMdxSource({ type: 'filesystem', filePath: absolutePath })
  const { data, content } = matter(raw)
  const normalizedPath = path.relative(baseDir, absolutePath)
  const withoutExtension = normalizedPath.replace(new RegExp(`${path.extname(normalizedPath)}$`), '')
  const slug = withoutExtension.split(path.sep).join('/')

  return {
    metadata: normalizeMetadata(data as Record<string, unknown>),
    content: content.trim(),
    raw,
    slug,
  }
}

export async function readMdxDirectory(
  relativeDir: string,
  options?: { baseDir?: string; recursive?: boolean; extensions?: string[] }
): Promise<MdxFile[]> {
  const baseDir = options?.baseDir ?? DEFAULT_CONTENT_ROOT
  const extensions = options?.extensions ?? DEFAULT_EXTENSIONS
  const dirPath = path.isAbsolute(relativeDir) ? relativeDir : path.join(baseDir, relativeDir)
  const entries = await fs.readdir(dirPath, { withFileTypes: true })

  const files = entries.filter(
    (entry) => entry.isFile() && extensions.includes(path.extname(entry.name).toLowerCase())
  )

  const results = await Promise.all(
    files.map((file) => readMdxFile(path.join(relativeDir, file.name), { baseDir, extensions }))
  )

  if (!options?.recursive) {
    return results
  }

  const nestedDirectories = entries.filter((entry) => entry.isDirectory())
  const nestedResults = await Promise.all(
    nestedDirectories.map((dir) =>
      readMdxDirectory(path.join(relativeDir, dir.name), { baseDir, recursive: true, extensions })
    )
  )

  return results.concat(...nestedResults)
}
