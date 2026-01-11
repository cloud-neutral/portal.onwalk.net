import Image from 'next/image'
import Link from 'next/link'
import type { ContentItem } from '@/lib/content'

const blurDataURL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMyM2I0YmUiLz48L3N2Zz4='

export default function ImageCarousel({ items }: { items: ContentItem[] }) {
  return (
    <div className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
      {items.map((item) => (
        <article key={item.slug} className="flex-shrink-0 snap-start">
          <div className="group relative h-[300px] w-[225px] overflow-hidden rounded-2xl border border-[#efefef] bg-white shadow-sm">
            {item.cover ? (
              <Image
                src={item.cover}
                alt={item.title ?? item.slug}
                width={900}
                height={1200}
                sizes="225px"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-[#747775]">暂无图片</div>
            )}
            {item.title && (
              <div className="absolute inset-x-3 bottom-3 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-[#1f1f1f] backdrop-blur">
                {item.title}
              </div>
            )}
          </div>
        </article>
      ))}
      <Link
        href="/images"
        className="flex h-[300px] w-[225px] flex-shrink-0 snap-start items-center justify-center rounded-2xl border border-[#efefef] bg-[#f0f2f5] text-sm font-medium text-[#1f1f1f] transition hover:bg-[#e8eaed]"
      >
        查看全部 →
      </Link>
    </div>
  )
}
