import Link from 'next/link'
import { Fragment } from 'react'

export type BreadcrumbItem = {
    name: string
    path: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    // Filter out empty names to be safe
    const validItems = items.filter(i => i.name)

    return (
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-sm text-slate-500">
            {validItems.map((item, index) => {
                const isLast = index === validItems.length - 1

                return (
                    <Fragment key={item.path}>
                        {index > 0 && (
                            <svg
                                className="mx-2 h-4 w-4 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                        {isLast ? (
                            <span className="font-medium text-slate-800" aria-current="page">
                                {item.name}
                            </span>
                        ) : (
                            <Link
                                href={item.path}
                                className="hover:text-primary hover:underline transition-colors"
                            >
                                {item.name}
                            </Link>
                        )}
                    </Fragment>
                )
            })}
        </nav>
    )
}
