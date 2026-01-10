'use client'

import Link from 'next/link'

import { useOnwalkCopy } from '@/i18n/useOnwalkCopy'
import { useLanguage } from '@/i18n/LanguageProvider'

export default function SiteHeader() {
  const copy = useOnwalkCopy()
  const { language, setLanguage } = useLanguage()
  const navItems = [
    { label: copy.header.nav.home, href: '/' },
    { label: copy.header.nav.image, href: '/image' },
    { label: copy.header.nav.video, href: '/video' },
    { label: copy.header.nav.blog, href: '/blog' },
    { label: copy.header.nav.about, href: '/about' },
  ]

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-10">
      <Link href="/" className="text-lg font-semibold tracking-[0.18em] text-slate-900">
        {copy.header.title}
      </Link>
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
        <nav className="flex flex-wrap items-center gap-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
          className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          aria-label={language === 'zh' ? 'Switch to English' : '切换到中文'}
        >
          {language === 'zh' ? 'EN' : '中文'}
        </button>
      </div>
    </header>
  )
}
