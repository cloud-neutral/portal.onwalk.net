export const dynamic = 'error'
export const revalidate = false

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import WorkshopArticle from '@/components/workshop/WorkshopArticle'
import { allWorkshops } from 'contentlayer/generated'

export const generateStaticParams = async () => allWorkshops.map((workshop) => ({ slug: workshop.slug }))

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const workshop = allWorkshops.find((entry) => entry.slug === params.slug)
  if (!workshop) {
    return { title: 'Workshop | Cloud-Neutral' }
  }
  return {
    title: `${workshop.title} | Workshop`,
    description: workshop.summary,
  }
}

export default function WorkshopDetailPage({ params }: { params: { slug: string } }) {
  const workshop = allWorkshops.find((entry) => entry.slug === params.slug)
  if (!workshop) {
    notFound()
  }

  return (
    <main className="bg-brand-surface px-6 py-12 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-3 rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">Workshop</p>
          <h1 className="text-3xl font-bold text-brand-heading md:text-[36px]">{workshop.title}</h1>
          <p className="text-sm text-brand-heading/80">{workshop.summary}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-brand-heading/70">
            <span className="rounded-full bg-brand-surface px-3 py-1 font-semibold text-brand-heading">{workshop.level}</span>
            {workshop.duration && <span>{workshop.duration}</span>}
            {workshop.updatedAt && <span suppressHydrationWarning>Updated {workshop.updatedAt}</span>}
          </div>
        </header>

        <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
          <WorkshopArticle code={workshop.body.code} />
        </div>
      </div>
    </main>
  )
}
