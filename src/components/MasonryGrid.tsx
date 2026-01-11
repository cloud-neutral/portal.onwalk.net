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
  const postItems =
    posts.length > 0
      ? posts
      : [
          {
            slug: 'intelligent-notes',
            title: '智性笔记：街区微光',
            date: '2024-06-20',
            content:
              '将步行路径拆解成可视化的纹理，记录街区的影子、风声与建筑交叠出的安静秩序。',
          },
          {
            slug: 'edge-of-city',
            title: '城市边缘的呼吸',
            date: '2024-05-28',
            content:
              '在被忽略的街角寻找光与结构的对比，让摄影成为一种温柔而克制的观察方式。',
          },
          {
            slug: 'quiet-morning',
            title: '清晨步行手记',
            date: '2024-05-12',
            content:
              '一段缓慢的步伐，记录光线在玻璃上的滑动，以及被时间留下的细节。',
          },
        ]

  return (
    <div className="space-y-4">
      {postItems.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="block rounded-xl border border-gray-100 bg-white p-4 transition hover:bg-[#f2f2f2]"
        >
          <div className="space-y-2">
            <span className="text-xs text-[#747775]">{post.date ?? '2024-06-01'}</span>
            <h3 className="text-base font-medium text-[#1f1f1f]">{post.title}</h3>
            {post.content && (
              <p className="line-clamp-2 text-sm leading-relaxed text-[#747775]">
                {buildExcerpt(post.content)}...
              </p>
            )}
          </div>
        </Link>
      ))}
      <Link
        href="/blog"
        className="flex w-full items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-[#1f1f1f] transition hover:border-gray-400"
      >
        Read More
      </Link>
    </div>
  )
}
