import { cookies } from 'next/headers'
import Link from 'next/link'

import { onwalkCopy, staticHeroContent } from '@/i18n/onwalk'
import type { Language } from '@/i18n/language'

export const metadata = {
  title: `Onwalk — ${staticHeroContent.titleEn}`,
  description: staticHeroContent.subtitleEn,
}

import ImageCarousel from '@/components/ImageCarousel'
import MasonryGrid from '@/components/MasonryGrid'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import VideoGrid from '@/components/VideoGrid'
import HeroSection from '@/components/HeroSection'
import HomeSectionHeader from '@/components/onwalk/HomeSectionHeader'
import { getContent, filterPostsByLanguage } from '@/lib/content'
import { getLatestPublicImages, getLatestPublicVideos } from '@/lib/publicMedia'

// Enable caching with revalidation
export const revalidate = 60

export default async function HomePage() {
  const cookieStore = await cookies()
  const language = (cookieStore.get('onwalk.language')?.value || 'zh') as Language
  const copy = onwalkCopy[language] || onwalkCopy.zh

  const [blogPosts, latestImages, latestVideos] = await Promise.all([
    getContent('blog'),
    getLatestPublicImages(5),
    getLatestPublicVideos(6),
  ])
  const latestBlogs = filterPostsByLanguage(blogPosts, language).slice(0, 3)

  return (
    <div className="relative min-h-screen bg-background text-text transition-colors duration-300">
      <SiteHeader />
      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 pb-24">

        {/* Dynamic Hero Section */}
        <HeroSection
          initialTitle={language === 'en' ? staticHeroContent.titleEn : staticHeroContent.title}
          initialSubtitle={language === 'en' ? staticHeroContent.subtitleEn : staticHeroContent.subtitle}
          badge={copy.home.hero.badge}
          tagline={copy.home.hero.tagline}
        />

        <section className="space-y-6">
          <HomeSectionHeader section="image" />
          <div className="rounded-large border border-border bg-surface p-6 shadow-sm">
            <ImageCarousel items={latestImages} />
          </div>
        </section>

        <section className="space-y-6">
          <HomeSectionHeader section="video" />
          <div className="rounded-large border border-border bg-surface p-6 shadow-sm">
            <VideoGrid items={latestVideos} columns={3} />
          </div>
          <div className="flex">
            <Link
              href="/videos"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text transition hover:border-text-secondary"
            >
              更多
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <HomeSectionHeader section="blog" />
          <div className="rounded-large border border-border bg-surface p-6 shadow-sm">
            <MasonryGrid posts={latestBlogs} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
