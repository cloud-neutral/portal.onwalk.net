import React from 'react'

interface DocCalloutProps {
  title?: string
  children: React.ReactNode
  tone?: 'info' | 'warning' | 'success'
}

const toneStyles: Record<NonNullable<DocCalloutProps['tone']>, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
}

export default function DocCallout({ title, children, tone = 'info' }: DocCalloutProps) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${toneStyles[tone]}`}>
      {title && <p className="mb-1 text-xs font-semibold uppercase tracking-wide">{title}</p>}
      <div className="space-y-2 leading-relaxed">{children}</div>
    </div>
  )
}
