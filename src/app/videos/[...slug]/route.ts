export const runtime = 'nodejs'

const SCENES = new Set(['drone', 'landscape', 'citywalk', 'architecture', 'night', 'panorama'])
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm'])
const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable'

function notFoundResponse(): Response {
  return new Response(null, {
    status: 404,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

function isValidExtension(filename: string): boolean {
  const dotIndex = filename.lastIndexOf('.')
  if (dotIndex <= 0 || dotIndex === filename.length - 1) {
    return false
  }

  return VIDEO_EXTENSIONS.has(filename.slice(dotIndex).toLowerCase())
}

function buildKey(slug: string[]): string | null {
  if (slug.length !== 5) {
    return null
  }

  const [country, province, city, scene, filename] = slug
  if (!country || !province || !city || !scene || !filename) {
    return null
  }

  if (!SCENES.has(scene)) {
    return null
  }

  if (!isValidExtension(filename)) {
    return null
  }

  return `public/videos/${country}/${province}/${city}/${scene}/${filename}`
}

function redirectResponse(url: string): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
      'Cache-Control': IMMUTABLE_CACHE,
    },
  })
}

function resolveRangeHeader(_request: Request): string | null {
  return null
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const key = buildKey(slug)
  if (!key) {
    return notFoundResponse()
  }

  const baseUrl = process.env.R2_PUBLIC_BASE_URL?.trim()
  if (!baseUrl) {
    return notFoundResponse()
  }

  resolveRangeHeader(request)
  const redirectUrl = `${baseUrl.replace(/\/+$/, '')}/${key}`
  return redirectResponse(redirectUrl)
}

export async function HEAD(request: Request, context: { params: Promise<{ slug: string[] }> }) {
  return GET(request, context)
}
