'use client'

import { useState } from 'react'

import { ContentItem } from '@/lib/content'
import ImageCarousel from '@/components/ImageCarousel'
import VideoGrid from '@/components/VideoGrid'
import HeroSection from '@/components/HeroSection'
import HomeSectionHeader from '@/components/onwalk/HomeSectionHeader'
import MasonryGrid from '@/components/MasonryGrid'
import Link from 'next/link'

type HomeInteractiveWrapperProps = {
    initialTitle: string
    initialSubtitle: string
    badge: string
    tagline: string
    initialImages: ContentItem[]
    initialVideos: ContentItem[]
    latestBlogs: ContentItem[]
}

export default function HomeInteractiveWrapper({
    initialTitle,
    initialSubtitle,
    badge,
    tagline,
    initialImages,
    initialVideos,
    latestBlogs,
}: HomeInteractiveWrapperProps) {
    const [heroContent, setHeroContent] = useState({
        title: initialTitle,
        subtitle: initialSubtitle,
    })
    const [images, setImages] = useState(initialImages)
    const [videos, setVideos] = useState(initialVideos)
    const [isLoading, setIsLoading] = useState(false)
    const [isBlurring, setIsBlurring] = useState(false)

    const handleDevelopClick = async () => {
        if (isLoading) return

        setIsLoading(true)
        setIsBlurring(true) // Start blur out content

        // Also blur sections? Maybe subtle opacity change?
        // Let's keep it simple focused on Hero for now, or blur everything slightly?
        // Let's stick to Hero blur as per original request, but update data.

        try {
            const response = await fetch('/api/inspiration')
            await new Promise(resolve => setTimeout(resolve, 800)) // Min wait

            if (response.ok) {
                const data = await response.json()
                setHeroContent({
                    title: data.title_cn, // Assuming API returns logic based on language? API currently returns mixed keys.
                    // The API returns title_cn/sub_cn/title_en/sub_en.
                    // Ideally we should respect user language here.
                    // But this wrapper is client side, how do we know language?
                    // We could pass current Lang or just use CN for now (default).
                    // Let's assume we want to update based on what initial was.
                    // If initial was English, we might want English keys.
                    // BUT, the API returns a fixed JSON. We should pick based on prop.
                    // Let's update `HeroSection` to handle Lang or pass it here.
                    subtitle: data.sub_cn,
                })

                // Update Media
                if (data.images && data.images.length > 0) {
                    setImages(data.images)
                }
                if (data.videos && data.videos.length > 0) {
                    setVideos(data.videos)
                }
            }
        } catch (error) {
            console.error('Failed to develop new content', error)
        } finally {
            setIsLoading(false)
            setIsBlurring(false)
        }
    }

    return (
        <>
            <HeroSection
                title={heroContent.title}
                subtitle={heroContent.subtitle}
                badge={badge}
                tagline={tagline}
                isLoading={isLoading}
                isBlurring={isBlurring}
                onDevelop={handleDevelopClick}
            />

            <section className={`space-y-6 transition-opacity duration-700 ${isBlurring ? 'opacity-80' : 'opacity-100'}`}>
                <HomeSectionHeader section="image" />
                <div className="rounded-large border border-border bg-surface p-6 shadow-sm min-h-[400px]">
                    {/* min-h to prevent layout shift during load if empty */}
                    <ImageCarousel items={images} />
                </div>
            </section>

            <section className={`space-y-6 transition-opacity duration-700 ${isBlurring ? 'opacity-80' : 'opacity-100'}`}>
                <HomeSectionHeader section="video" />
                <div className="rounded-large border border-border bg-surface p-6 shadow-sm min-h-[400px]">
                    <VideoGrid items={videos} columns={3} />
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
        </>
    )
}
