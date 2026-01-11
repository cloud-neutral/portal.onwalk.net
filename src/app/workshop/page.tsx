import type { Metadata } from 'next'

import WorkshopCard from '@/components/workshop/WorkshopCard'
import { onwalkSeoDescription, onwalkSeoTitle } from '@/lib/seo'
import { allWorkshops } from 'contentlayer/generated'

export const dynamic = 'error'
export const revalidate = false

export const metadata: Metadata = {
  title: onwalkSeoTitle,
  description: onwalkSeoDescription,
}

export default function WorkshopIndexPage() {
  const workshops = [...allWorkshops].sort((a, b) => {
    const aDate = a.updatedAt ? Date.parse(a.updatedAt) : 0
    const bDate = b.updatedAt ? Date.parse(b.updatedAt) : 0
    if (aDate && bDate && aDate !== bDate) return bDate - aDate
    return a.title.localeCompare(b.title)
  })

  return (
    <main className="bg-brand-surface px-6 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="space-y-4 text-brand-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">Workshop</p>
          <h1 className="text-[32px] font-bold text-brand md:text-[36px]">Interactive Workflows</h1>
          <p className="max-w-3xl text-sm text-brand-heading/80 md:text-base">
            Short-lived, high-interaction guides compiled with Contentlayer. Experiment with toggles and demos without changing the core UI.
          </p>
        </header>

        {workshops.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-border bg-white p-10 text-center text-sm text-brand-heading/70">
            Workshops will appear here once content is published.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {workshops.map((workshop) => (
              <WorkshopCard key={workshop.slug} workshop={workshop} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
