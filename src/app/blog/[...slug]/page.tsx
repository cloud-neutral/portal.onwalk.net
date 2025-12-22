export const dynamic = 'error'
export const revalidate = false

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'

import { getBlogPostBySlug, getBlogSlugs } from '@lib/blogContent'

type PageProps = {
  params: { slug: string | string[] }
}

function formatDate(dateStr: string, language: 'zh' | 'en'): string {
  const date = new Date(dateStr)

  if (language === 'zh') {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function generateStaticParams() {
  const slugs = await getBlogSlugs()
  return slugs.map((slug) => ({ slug: slug.split('/') }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slugParam = await params
  const slugPath = Array.isArray(slugParam.slug) ? slugParam.slug.join('/') : slugParam.slug
  const post = await getBlogPostBySlug(slugPath)

  if (!post) {
    return { title: 'Blog Post | Cloud-Neutral' }
  }

  return {
    title: `${post.title} | Cloud-Neutral Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const slugParam = await params
  const slugPath = Array.isArray(slugParam.slug) ? slugParam.slug.join('/') : slugParam.slug
  const post = await getBlogPostBySlug(slugPath)

  if (!post) {
    notFound()
  }

  const mdx = await compileMDX({
    source: post.content,
  })

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-16">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center text-sm font-semibold text-brand transition hover:text-brand-dark"
        >
          ← {post.date ? 'Back to Blog' : '返回博客'}
        </Link>

        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">{post.title}</h1>

          {post.author && <p className="mb-2 text-sm text-slate-600">{post.date ? 'By' : '作者'} {post.author}</p>}

          {post.date && (
            <time className="text-sm text-slate-500">{formatDate(post.date, 'en')}</time>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <article className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-a:text-brand prose-a:no-underline hover:prose-a:underline">
          {mdx.content}
        </article>

        <footer className="mt-16 border-t border-slate-200 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-brand transition hover:text-brand-dark"
          >
            ← Back to Blog
          </Link>
        </footer>
      </div>
    </main>
  )
}
