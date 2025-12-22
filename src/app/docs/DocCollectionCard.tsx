'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { ArrowUpRight } from 'lucide-react'

import ClientTime from '../components/ClientTime'
import type { DocCollection } from './types'

interface DocCollectionCardProps {
  collection: DocCollection
  meta?: string
}

export default function DocCollectionCard({ collection, meta }: DocCollectionCardProps) {
  const { versions } = collection
  const defaultVersionSlug = collection.defaultVersionSlug ?? versions[0]?.slug ?? ''
  const [selectedVersionSlug, setSelectedVersionSlug] = useState(defaultVersionSlug)

  useEffect(() => {
    if (!defaultVersionSlug) {
      return
    }
    setSelectedVersionSlug(defaultVersionSlug)
  }, [defaultVersionSlug, collection.slug])

  useEffect(() => {
    if (!versions.length) {
      return
    }
    if (!versions.some((version) => version.slug === selectedVersionSlug)) {
      const fallback = versions.find((version) => version.slug === defaultVersionSlug) ?? versions[0]
      if (fallback) {
        setSelectedVersionSlug(fallback.slug)
      }
    }
  }, [versions, selectedVersionSlug, defaultVersionSlug])

  const activeVersion = useMemo(() => {
    if (!versions.length) return undefined
    return versions.find((version) => version.slug === selectedVersionSlug) ?? versions[0]
  }, [versions, selectedVersionSlug])

  const description = activeVersion?.description ?? collection.description
  const href = activeVersion ? `/docs/${collection.slug}/${activeVersion.slug}` : `/docs/${collection.slug}`
  const updatedAt = activeVersion?.updatedAt ?? collection.updatedAt
  const tags = activeVersion?.tags?.length ? activeVersion.tags : collection.tags

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-1 hover:border-brand hover:shadow-[0_8px_28px_rgba(51,102,255,0.18)]">
      <div className="relative h-28 w-full bg-brand/10">
        <div className="absolute inset-0 flex flex-col justify-between p-4 text-xs text-brand-heading/70">
          <div>
            {meta && (
              <span className="inline-flex items-center rounded-full border border-brand-border bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-brand">
                {meta}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            {updatedAt && (
              <span suppressHydrationWarning>
                Updated <ClientTime isoString={updatedAt} />
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 text-brand-heading">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-brand-navy transition group-hover:text-brand">{collection.title}</h2>
          <p className="text-sm text-brand-heading/80">{description}</p>
        </div>

        {versions.length > 0 && (
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-heading/70">
            <span>Version</span>
            <select
              value={selectedVersionSlug}
              onChange={(event) => setSelectedVersionSlug(event.target.value)}
              className="rounded-full border border-brand-border px-3 py-1 text-sm font-medium text-brand-heading focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
            >
              {versions.map((version) => (
                <option key={version.slug} value={version.slug}>
                  {version.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-brand-border bg-brand-surface px-3 py-1 text-xs font-medium text-brand-heading">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between text-sm font-medium text-brand">
          <div className="flex flex-col text-brand-heading">
            <span>Open reader</span>
            {activeVersion && (
              <span className="text-xs text-brand-heading/70">{activeVersion.label}</span>
            )}
          </div>
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-3 py-1 text-brand transition hover:border-brand hover:bg-white"
          >
            <span>Open</span>
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
