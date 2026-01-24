'use client'

import { useState } from 'react'

type HeroSectionProps = {
    initialTitle: string
    initialSubtitle: string
    badge: string
    tagline: string
}

export default function HeroSection({
    initialTitle,
    initialSubtitle,
    badge,
    tagline,
}: HeroSectionProps) {
    const [content, setContent] = useState({
        title: initialTitle,
        subtitle: initialSubtitle,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isBlurring, setIsBlurring] = useState(false)

    const handleDevelopClick = async () => {
        if (isLoading) return

        setIsLoading(true)
        setIsBlurring(true) // Start blur out

        try {
            // Simulate "developing" process + API call
            const response = await fetch('/api/inspiration')

            // Wait a minimum time for the animation to feel noticeable (camera focus effect)
            // and ensure API has returned
            await new Promise(resolve => setTimeout(resolve, 800))

            if (response.ok) {
                const data = await response.json()
                setContent({
                    title: data.title_cn,
                    subtitle: data.sub_cn,
                })
            }
        } catch (error) {
            console.error('Failed to develop new content', error)
        } finally {
            setIsLoading(false)
            setIsBlurring(false) // Start blur in (clear)
        }
    }

    return (
        <section className="grid gap-8 rounded-large border border-border bg-surface p-10 shadow-sm transition-colors duration-300 relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-text-secondary">
                <span className="rounded-full border border-border px-3 py-1">
                    {badge}
                </span>
                <span>{tagline}</span>
            </div>

            <div className="space-y-4">
                <h1
                    className={`font-display text-4xl font-bold tracking-tight text-heading md:text-5xl transition-all duration-700 ease-in-out ${isBlurring ? 'blur-md opacity-60 grayscale' : 'blur-0 opacity-100 grayscale-0'
                        }`}
                >
                    {content.title}
                </h1>
                <p
                    className={`max-w-2xl text-lg leading-relaxed text-text-secondary transition-all duration-700 ease-in-out ${isBlurring ? 'blur-sm opacity-60' : 'blur-0 opacity-100'
                        }`}
                >
                    {content.subtitle}
                </p>
            </div>

            <div className="flex items-center gap-4 pt-2">
                <button
                    onClick={handleDevelopClick}
                    disabled={isLoading}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-text transition-all hover:border-text hover:bg-text hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span className={`relative flex h-2 w-2`}>
                        <span className={`absolute inline-flex h-full w-full rounded-full bg-brand opacity-75 ${isLoading ? 'animate-ping' : ''}`}></span>
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${isLoading ? 'bg-orange-500' : 'bg-brand'}`}></span>
                    </span>
                    <span className="relative">
                        {isLoading ? 'Developing... (显影中)' : '📷 按下快门 (Press Shutter)'}
                    </span>

                    {/* Subtle shine effect on hover */}
                    <div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
                </button>
            </div>
        </section>
    )
}
