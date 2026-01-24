import { cookies } from 'next/headers'
import Link from 'next/link'

import { onwalkCopy, staticHeroContent } from '@/i18n/onwalk'
import type { Language } from '@/i18n/language'

export const metadata = {
  title: `Onwalk — ${staticHeroContent.titleEn}`,
  description: staticHeroContent.subtitleEn,
}

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import HomeInteractiveWrapper from '@/components/HomeInteractiveWrapper'
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

        <HomeInteractiveWrapper
          initialTitle={language === 'en' ? staticHeroContent.titleEn : staticHeroContent.title}
          initialSubtitle={language === 'en' ? staticHeroContent.subtitleEn : staticHeroContent.subtitle}
          badge={copy.home.hero.badge}
          tagline={copy.home.hero.tagline}
          initialImages={latestImages}
          initialVideos={latestVideos}
          latestBlogs={latestBlogs}
        />

      </main>
      <SiteFooter />
    </div>
  )
}
