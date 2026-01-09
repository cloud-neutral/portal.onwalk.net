export const dynamic = 'error'
export const revalidate = false

import ImageCarousel from '@/components/ImageCarousel'
import MasonryGrid from '@/components/MasonryGrid'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import VideoGrid from '@/components/VideoGrid'
import { getContent } from '@/lib/content'

export default async function HomePage() {
  const [walk, image, video] = await Promise.all([
    getContent('walk'),
    getContent('image'),
    getContent('video'),
  ])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20">
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">影像为入口 · 文字为结构</p>
          <h1 className="text-3xl font-semibold md:text-4xl">一个可长期生长的影像与思想档案</h1>
          <p className="max-w-2xl text-sm text-slate-300">
            记录城市与山野的影像实践，让每一段图像有清晰的文字骨架。
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold">行摄笔记</h2>
            <span className="text-xs text-slate-400">影像为入口，文字为结构</span>
          </div>
          <MasonryGrid posts={walk} />
        </section>

        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold">一图一文</h2>
            <span className="text-xs text-slate-400">胶片式浏览</span>
          </div>
          <ImageCarousel items={image} />
        </section>

        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold">一图一视频</h2>
            <span className="text-xs text-slate-400">剧场式观看</span>
          </div>
          <VideoGrid items={video} />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
