'use client'

import { useRouter } from 'next/navigation'

interface DocVersionSwitcherProps {
  collectionSlug: string
  versions: { slug: string; label: string }[]
  activeSlug: string
}

export default function DocVersionSwitcher({ collectionSlug, versions, activeSlug }: DocVersionSwitcherProps) {
  const router = useRouter()

  return (
    <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-heading/70">
      <span>Version</span>
      <select
        value={activeSlug}
        onChange={(event) => {
          const next = event.target.value
          router.replace(`/docs/${collectionSlug}/${next}`)
        }}
        className="rounded-full border border-brand-border px-3 py-1 text-sm font-medium text-brand-heading focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
      >
        {versions.map((version) => (
          <option key={version.slug} value={version.slug}>
            {version.label}
          </option>
        ))}
      </select>
    </label>
  )
}
