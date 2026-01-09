import Link from 'next/link'

type SubNavItem = {
  label: string
  href: string
}

export default function SubNav({ items, activeHref }: { items: SubNavItem[]; activeHref?: string }) {
  return (
    <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
      {items.map((item) => {
        const isActive = activeHref === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-2 transition ${
              isActive ? 'bg-white/15 text-white' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
