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
    <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
      {posts.map((post) => (
        <article key={post.slug} className="mb-8 break-inside-avoid rounded-2xl bg-white/5 p-4 text-slate-100">
          {post.cover && <img src={post.cover} alt={post.title ?? post.slug} className="mb-4 w-full rounded-xl object-cover" />}
          <h3 className="text-lg font-semibold">{post.title}</h3>
          {post.location && <p className="mt-1 text-xs text-slate-400">{post.location}</p>}
          {post.content && <p className="mt-3 text-sm text-slate-300">{buildExcerpt(post.content)}...</p>}
        </article>
      ))}
    </div>
  )
}
