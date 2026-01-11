import Link from 'next/link'
import type { ContentItem } from '@/lib/content'

function buildExcerpt(content: string): string {
  const cleaned = content
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[`*_>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned.slice(0, 90)
}

export default function MasonryGrid({ posts }: { posts: ContentItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="rounded-xl border border-gray-100 bg-white p-5 transition hover:bg-[#f2f2f2]"
        >
          {post.date && <p className="text-xs text-[#747775]">{post.date}</p>}
          <h3 className="mt-2 text-lg font-medium text-[#1f1f1f]">{post.title ?? post.slug}</h3>
          {post.content && (
            <p className="mt-3 text-sm leading-relaxed text-[#747775] line-clamp-2">
              {buildExcerpt(post.content)}...
            </p>
          )}
        </Link>
      ))}
      <Link
        href="/blog"
        className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#1f1f1f] transition hover:bg-[#f2f2f2]"
      >
        Read More
      </Link>
    </div>
  )
}
