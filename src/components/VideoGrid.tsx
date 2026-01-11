'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { useOnwalkCopy } from '@/i18n/useOnwalkCopy'
import type { ContentItem } from '@/lib/content'

const PAGE_SIZE = 12

type VideoGridVariant = 'overview' | 'full'

export default function VideoGrid({ items, variant = 'full' }: { items: ContentItem[]; variant?: VideoGridVariant }) {
  const copy = useOnwalkCopy()
  const [pageIndex, setPageIndex] = useState(0)
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const pagedItems = useMemo(() => {
    const start = pageIndex * PAGE_SIZE
    return items.slice(start, start + PAGE_SIZE)
  }, [items, pageIndex])

  const currentItems = variant === 'overview' ? items.slice(0, 4) : pagedItems
  const canGoBack = pageIndex > 0
  const canGoForward = pageIndex < totalPages - 1

  useEffect(() => {
    if (variant === 'full' && pageIndex > totalPages - 1) {
      setPageIndex(Math.max(0, totalPages - 1))
    }
  }, [pageIndex, totalPages, variant])

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {currentItems.map((item) => (
          <div key={item.slug} className="overflow-hidden rounded-2xl border border-[#efefef] bg-white shadow-sm">
            <div className="relative aspect-video">
              {item.poster || item.cover ? (
                <Image
                  src={item.poster ?? item.cover ?? ''}
                  alt={item.title ?? item.slug}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-[#747775]">
                  {copy.video.empty}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-md">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7-11-7z" fill="white" />
                  </svg>
                </div>
              </div>
              <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
                04:20
              </span>
            </div>
            <div className="space-y-1 p-4">
              <Link href="/video" className="text-sm font-medium text-[#1f1f1f] hover:underline">
                {item.title ?? item.slug}
              </Link>
              {item.location && <p className="text-xs text-[#747775]">{item.location}</p>}
            </div>
          </div>
        ))}
      </div>
      {variant === 'full' && (
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[#747775]">
          <span>
            {copy.video.pageLabel ?? 'Page'} {pageIndex + 1} / {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-[#efefef] px-4 py-2 text-[#1f1f1f] transition hover:border-[#e2e2e2] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={!canGoBack}
            >
              {copy.video.prev ?? '上一页'}
            </button>
            <button
              type="button"
              className="rounded-full border border-[#efefef] px-4 py-2 text-[#1f1f1f] transition hover:border-[#e2e2e2] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={!canGoForward}
            >
              {copy.video.next ?? '下一页'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
