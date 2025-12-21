export const dynamic = 'force-dynamic'

import Link from 'next/link'
import SearchComponent from '@components/search'
import { getHomepagePosts } from '@lib/marketingContent'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Blog | Cloud-Neutral',
  description: 'Latest updates, releases, and insights from the Cloud-Neutral community.',
}

function formatDate(dateStr: string | undefined, language: 'zh' | 'en'): string {
  if (!dateStr) return ''

  const date = new Date(dateStr)

  if (language === 'zh') {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
}

type PageProps = {
  searchParams?: { page?: string; category?: string } | Promise<{ page?: string; category?: string }>
}

const CATEGORY_TABS: { key: string; label: string }[] = [
  { key: 'infra-cloud', label: 'Infra & Cloud' },
  { key: 'observability', label: 'Observability' },
  { key: 'identity', label: 'ID & Security' },
  { key: 'iac-devops', label: 'IaC & DevOps' },
  { key: 'data-ai', label: 'Data & AI' },
  { key: 'insight', label: '资讯' },
  { key: 'essays', label: '随笔&观察' },
]

function buildCategoryCounts(posts: Awaited<ReturnType<typeof getHomepagePosts>>) {
  return posts.reduce<Record<string, number>>((acc, post) => {
    if (post.category?.key) {
      acc[post.category.key] = (acc[post.category.key] || 0) + 1
    }
    return acc
  }, {})
}

export default async function BlogPage({ searchParams }: PageProps) {
  const posts = await getHomepagePosts()
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {})
  const { page, category } = resolvedSearchParams ?? {}
  const categoryCounts = buildCategoryCounts(posts)
  const selectedCategory = CATEGORY_TABS.find((tab) => tab.key === category)?.key
  const filteredPosts = selectedCategory ? posts.filter((post) => post.category?.key === selectedCategory) : posts
  const postsPerPage = 10
  const currentPage = parseInt(page || '1', 10)
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage))

  if ((filteredPosts.length > 0 && currentPage > totalPages) || currentPage < 1) {
    notFound()
  }

  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  return (
    <div className="bg-white text-slate-900">
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <span className="text-slate-500">SVC.plus</span>
            <span className="text-slate-400">/</span>
            <span className="text-brand-dark">blog</span>
          </Link>
          <div className="flex items-center gap-3">
            <SearchComponent className="relative w-full max-w-xs" />
          </div>
        </div>
      </header>

      <main className="flex min-h-screen flex-col bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Blog</h1>
            <p className="text-lg text-slate-600">
              Latest updates, releases, and insights from the Cloud-Neutral community.
            </p>
          </div>

          <div className="mb-10 flex flex-wrap items-center gap-3">
            {CATEGORY_TABS.map((tab) => {
              const isActive = tab.key === selectedCategory
              const labelWithCount = categoryCounts[tab.key]

              return (
                <Link
                  key={tab.key}
                  href={`/blog${isActive ? '' : `?category=${tab.key}`}`}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'border-brand bg-brand text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-brand/60 hover:text-brand'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{tab.label}</span>
                  {labelWithCount ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {labelWithCount}
                    </span>
                  ) : null}
                </Link>
              )
            })}
            <Link
              href="/blog"
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                !selectedCategory
                  ? 'border-brand bg-brand text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand/60 hover:text-brand'
              }`}
            >
              全部
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  !selectedCategory ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {posts.length}
              </span>
            </Link>
          </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">暂无博客文章</p>
          </div>
        ) : (
          <>
            <div className="grid gap-8">
              {paginatedPosts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand">Blog</span>
                    {post.date && (
                      <time className="text-sm text-slate-500">
                        {formatDate(post.date, 'en')}
                      </time>
                    )}
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-slate-900">{post.title}</h2>
                  {post.author && (
                    <p className="mb-4 text-sm text-slate-500">By {post.author}</p>
                  )}
                  <p className="mb-6 text-slate-600">{post.excerpt}</p>
                  <div className="flex items-center gap-4">
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="ml-auto text-sm font-semibold text-brand transition hover:text-brand-dark"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-2">
                <Link
                  href={`/blog?page=${currentPage - 1}${selectedCategory ? `&category=${selectedCategory}` : ''}`}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                    currentPage === 1
                      ? 'cursor-not-allowed text-slate-400'
                      : 'text-brand hover:bg-slate-100'
                  }`}
                  aria-disabled={currentPage === 1}
                >
                  Previous
                </Link>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Link
                    key={page}
                    href={`/blog?page=${page}${selectedCategory ? `&category=${selectedCategory}` : ''}`}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                      page === currentPage
                        ? 'bg-brand text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </Link>
                ))}

                <Link
                  href={`/blog?page=${currentPage + 1}${selectedCategory ? `&category=${selectedCategory}` : ''}`}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                    currentPage === totalPages
                      ? 'cursor-not-allowed text-slate-400'
                      : 'text-brand hover:bg-slate-100'
                  }`}
                  aria-disabled={currentPage === totalPages}
                >
                  Next
                </Link>
              </nav>
            )}
          </>
        )}
        </div>
      </main>
    </div>
  )
}
