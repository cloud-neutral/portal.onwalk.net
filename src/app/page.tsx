export const dynamic = 'error'
export const revalidate = false

import { onwalkSeoDescription, onwalkSeoTitle } from '@/lib/seo'

export const metadata = {
  title: 'Onwalk — Walking with a Camera',
  description:
    '一个关于行走与摄影的个人长期项目。记录城市、户外与被忽略的空间细节。 A long-term personal project on walking and photography. Cities, outdoors, and overlooked details.',
}

import ImageCarousel from '@/components/ImageCarousel'
import MasonryGrid from '@/components/MasonryGrid'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import VideoGrid from '@/components/VideoGrid'
import HomeHero from '@/components/onwalk/HomeHero'
import HomeSectionHeader from '@/components/onwalk/HomeSectionHeader'
import { getContent } from '@/lib/content'

export default async function HomePage() {
  const [walk, image, video] = await Promise.all([
    getContent('walk'),
    getContent('image'),
    getContent('video'),
  ])

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#1f1f1f]">
      <SiteHeader />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24">
        <HomeHero />

        <section className="space-y-6">
          <HomeSectionHeader section="blog" />
          <div className="rounded-3xl border border-[#efefef] bg-white p-6 shadow-[0_4px_8px_rgba(0,0,0,0.04)]">
            <MasonryGrid posts={walk} />
          </div>
        </section>

        <section className="space-y-6">
          <HomeSectionHeader section="image" />
          <div className="rounded-3xl border border-[#efefef] bg-white p-6 shadow-[0_4px_8px_rgba(0,0,0,0.04)]">
            <ImageCarousel items={image} />
          </div>
        </section>

        <section className="space-y-6">
          <HomeSectionHeader section="video" />
          <div className="rounded-3xl border border-[#efefef] bg-white p-6 shadow-[0_4px_8px_rgba(0,0,0,0.04)]">
            <VideoGrid items={video} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
