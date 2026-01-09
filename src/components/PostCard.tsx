import type { ContentItem } from '@/lib/content'

function buildExcerpt(content: string): string {
  const cleaned = content
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[`*_>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned.slice(0, 120)
}

export default function PostCard({ post }: { post: ContentItem }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-100">
      <div className="flex flex-col gap-4">
        {post.cover && <img src={post.cover} alt={post.title ?? post.slug} className="h-48 w-full rounded-xl object-cover" />}
        <div>
          <h2 className="text-xl font-semibold">{post.title}</h2>
          {post.date && <p className="mt-1 text-xs text-slate-400">{post.date}</p>}
        </div>
        {post.content && <p className="text-sm text-slate-300">{buildExcerpt(post.content)}...</p>}
      </div>
    </article>
  )
}
