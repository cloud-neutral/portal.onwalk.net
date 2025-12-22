export const dynamic = 'error'
export const revalidate = false

import type { Metadata } from 'next'

import BlogList from '@components/blog/BlogList'
import { getBlogPosts } from '@lib/blogContent'

export const metadata: Metadata = {
  title: 'Blog | Cloud-Neutral',
  description: 'Latest updates, releases, and insights from the Cloud-Neutral community.',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return <BlogList posts={posts} />
}
