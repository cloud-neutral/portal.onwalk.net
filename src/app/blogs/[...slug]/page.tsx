export const dynamic = 'force-dynamic'

import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import BlogBackLink from '@/components/onwalk/BlogBackLink'
import { getContentBySlug, getContentSlugs } from '@/lib/content'
import { renderMarkdownContent } from '@/server/render-markdown'

type PageProps = {
  params: { slug: string | string[] }
}

function normalizeSlug(slugParam: string | string[]) {
  return Array.isArray(slugParam) ? slugParam.join('/') : slugParam
}

export async function generateStaticParams() {
  const slugs = await getContentSlugs('blog')
  return slugs.map((slug) => ({ slug: slug.split('/') }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slugPath = normalizeSlug(params.slug)
  const post = await getContentBySlug('blog', slugPath)

  if (!post) {
    return { title: '行摄笔记' }
  }

  return {
    title: post.title ?? '行摄笔记',
    description: post.content?.slice(0, 120),
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const slugPath = normalizeSlug(params.slug)
  const post = await getContentBySlug('blog', slugPath)

  if (!post) {
    notFound()
  }

  const baseUrl = 'https://www.onwalk.net'
  const canonicalUrl = `${baseUrl}/blogs/${slugPath}`
  const imageUrl = post.cover ? `${baseUrl}${post.cover}` : undefined
  const description = post.content?.slice(0, 160)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title ?? '行摄笔记',
    datePublished: post.date,
    dateModified: post.date,
    description,
    image: imageUrl ? [imageUrl] : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    url: canonicalUrl,
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BlogBackLink />
        <header className="mt-6 space-y-3">
          <h1 className="text-3xl font-semibold">{post.title}</h1>
          {post.date && <p className="text-xs text-slate-500">{post.date}</p>}
          {post.cover && (
            <Image
              src={post.cover}
              alt={post.title ?? post.slug}
              width={1200}
              height={800}
              sizes="100vw"
              className="mt-6 h-auto w-full rounded-2xl"
            />
          )}
        </header>
        <article
          className="prose mt-8 max-w-none text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderMarkdownContent(post.content) }}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
