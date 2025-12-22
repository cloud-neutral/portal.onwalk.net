export const dynamic = 'error'
export const revalidate = false

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import Breadcrumbs, { type Crumb } from '../../../../components/download/Breadcrumbs'
import DocArticle from '@/components/doc/DocArticle'
import DocMetaPanel from '@/components/doc/DocMetaPanel'
import DocVersionSwitcher from '@/components/doc/DocVersionSwitcher'
import { getDocVersionParams, getDocVersion } from '../../resources.server'
import { isFeatureEnabled } from '@lib/featureToggles'

function buildBreadcrumbs(
  slug: string,
  docTitle: string,
  version?: { label: string; slug: string },
): Crumb[] {
  const crumbs: Crumb[] = [
    { label: 'Docs', href: '/docs' },
    { label: docTitle, href: `/docs/${slug}` },
  ]
  if (version) {
    const versionSlug = version.slug
    crumbs.push({ label: version.label, href: `/docs/${slug}/${versionSlug}` })
  }
  return crumbs
}

export const generateStaticParams = async () => {
  if (!isFeatureEnabled('appModules', '/docs')) {
    return []
  }

  return getDocVersionParams()
}

export const dynamicParams = false

export const metadata: Metadata = {
  title: 'Documentation',
}

export default async function DocVersionPage({
  params,
}: {
  params: { collection: string; version: string }
}) {
  if (!isFeatureEnabled('appModules', '/docs')) {
    notFound()
  }

  const doc = await getDocVersion(params.collection, params.version)
  if (!doc) {
    notFound()
  }

  const { collection, version } = doc
  const breadcrumbs = buildBreadcrumbs(collection.slug, collection.title, version)

  return (
    <main className="px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Breadcrumbs items={breadcrumbs} />
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">{collection.title}</p>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{version.title}</h1>
              <p className="mt-2 text-sm text-gray-600">{collection.description}</p>
            </div>
            <div className="flex flex-col items-start gap-3 text-sm text-gray-500 md:items-end">
              <DocVersionSwitcher
                collectionSlug={collection.slug}
                versions={collection.versions.map((item) => ({ slug: item.slug, label: item.label }))}
                activeSlug={version.slug}
              />
              {version.updatedAt && <span suppressHydrationWarning>Updated {version.updatedAt}</span>}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_1fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <DocMetaPanel description={version.description} updatedAt={version.updatedAt} tags={version.tags} />
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <DocArticle content={version.content} />
          </div>
        </div>
      </div>
    </main>
  )
}
