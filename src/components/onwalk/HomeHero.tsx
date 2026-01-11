'use client'

import { useOnwalkCopy } from '@/i18n/useOnwalkCopy'

export default function HomeHero() {
  const copy = useOnwalkCopy()

  return (
    <section className="grid gap-8 rounded-3xl border border-[#efefef] bg-white p-10 shadow-[0_4px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#747775]">
        <span className="rounded-full border border-[#efefef] px-3 py-1">{copy.home.hero.badge}</span>
        <span>{copy.home.hero.tagline}</span>
      </div>
      <h1 className="text-3xl font-medium text-[#1f1f1f] md:text-4xl">{copy.home.hero.title}</h1>
      <p className="max-w-2xl text-sm leading-relaxed text-[#747775]">{copy.home.hero.description}</p>
      <div className="flex flex-wrap gap-3 text-xs text-[#747775]">
        <span className="rounded-full bg-[#1f1f1f] px-3 py-1 font-medium text-white">
          {copy.home.hero.chips.featured}
        </span>
        <span className="rounded-full border border-[#efefef] px-3 py-1">{copy.home.hero.chips.moments}</span>
        <span className="rounded-full border border-[#efefef] px-3 py-1">{copy.home.hero.chips.theater}</span>
        <span className="rounded-full border border-[#efefef] px-3 py-1">{copy.home.hero.chips.journal}</span>
      </div>
    </section>
  )
}
