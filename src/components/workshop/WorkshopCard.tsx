import Link from 'next/link'

import type { Workshop } from 'contentlayer/generated'

interface WorkshopCardProps {
  workshop: Workshop
}

export default function WorkshopCard({ workshop }: WorkshopCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-brand-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Workshop</p>
        <h2 className="text-lg font-semibold text-brand-heading">{workshop.title}</h2>
        <p className="text-sm text-brand-heading/80">{workshop.summary}</p>
        {workshop.tags?.length ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {workshop.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-brand-border bg-brand-surface px-3 py-1 text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-brand-heading/80">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-surface px-3 py-1 text-xs font-semibold text-brand-heading">{workshop.level}</span>
          {workshop.duration && <span>{workshop.duration}</span>}
        </div>
        <Link
          href={workshop.url}
          className="rounded-full border border-brand-border bg-brand-surface px-3 py-1 text-sm font-semibold text-brand transition hover:border-brand hover:bg-white"
        >
          View
        </Link>
      </div>
    </article>
  )
}
