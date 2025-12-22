import React from 'react'

interface DocStepsProps {
  title?: string
  children: React.ReactNode
}

export default function DocSteps({ title, children }: DocStepsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {title && <p className="mb-2 text-sm font-semibold text-slate-800">{title}</p>}
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">{children}</ol>
    </div>
  )
}
