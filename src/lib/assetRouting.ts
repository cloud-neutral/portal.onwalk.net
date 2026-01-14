export type AssetType = 'images' | 'videos'

type AssetParts = {
  country: string
  province: string
  city: string
  scene: string
  filename: string
}

const SCENES = new Set(['drone', 'landscape', 'citywalk', 'architecture', 'night', 'panorama'])
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg'])
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm'])
const ASSET_BUCKET_NAME = process.env.ASSET_BUCKET_NAME?.trim()
const ASSET_PUBLIC_PREFIX = process.env.ASSET_PUBLIC_PREFIX?.trim() || 'public'
const ASSET_BASE_URL = process.env.ASSET_BASE_URL?.trim()

function resolveAssetOrigin(): string | null {
  if (ASSET_BASE_URL) {
    return ASSET_BASE_URL
  }

  if (ASSET_BUCKET_NAME) {
    return `https://${ASSET_BUCKET_NAME}.r2.dev/`
  }

  return null
}

function hasValidExtension(type: AssetType, filename: string): boolean {
  const dotIndex = filename.lastIndexOf('.')
  if (dotIndex <= 0 || dotIndex === filename.length - 1) {
    return false
  }

  const extension = filename.slice(dotIndex).toLowerCase()
  const allowed = type === 'images' ? IMAGE_EXTENSIONS : VIDEO_EXTENSIONS
  return allowed.has(extension)
}

export function parseAssetSlug(slug?: string[] | string): AssetParts | null {
  if (!slug || !Array.isArray(slug) || slug.length !== 5) {
    return null
  }

  const [country, province, city, scene, filename] = slug
  if (!country || !province || !city || !scene || !filename) {
    return null
  }

  if (!SCENES.has(scene)) {
    return null
  }

  return { country, province, city, scene, filename }
}

export function isSupportedAsset(type: AssetType, parts: AssetParts): boolean {
  return hasValidExtension(type, parts.filename)
}

export function buildAssetPath(type: AssetType, parts: AssetParts): string {
  return `${ASSET_PUBLIC_PREFIX}/${type}/${parts.country}/${parts.province}/${parts.city}/${parts.scene}/${parts.filename}`
}

export function buildAssetUrl(type: AssetType, parts: AssetParts): string | null {
  const origin = resolveAssetOrigin()
  if (!origin) {
    return null
  }

  return new URL(buildAssetPath(type, parts), origin).toString()
}
