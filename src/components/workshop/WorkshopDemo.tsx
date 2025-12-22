'use client'

import { useState } from 'react'

export default function WorkshopDemo() {
  const [environment, setEnvironment] = useState<'staging' | 'production'>('staging')
  const [enabled, setEnabled] = useState(false)

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-brand">Live Toggle</p>
          <p className="text-sm text-brand-heading/80">Switch environments to preview workshop actions.</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-brand-heading">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
            className="h-4 w-4 rounded border-brand-border text-brand focus:ring-brand"
          />
          {enabled ? 'Enabled' : 'Disabled'}
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        {(['staging', 'production'] as const).map((item) => {
          const isActive = environment === item
          return (
            <button
              key={item}
              type="button"
              onClick={() => setEnvironment(item)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                isActive ? 'border-brand bg-brand text-white' : 'border-brand-border bg-brand-surface text-brand-heading'
              }`}
            >
              {item === 'staging' ? 'Staging' : 'Production'}
            </button>
          )
        })}
      </div>
      <div className="mt-4 rounded-xl bg-brand-surface p-3 text-sm text-brand-heading/80">
        <p className="font-semibold text-brand-heading">
          {enabled ? 'Automation ready' : 'Preview mode'} · {environment}
        </p>
        <p className="text-xs text-brand-heading/70">Stateful interactions stay inside workshop scope.</p>
      </div>
    </div>
  )
}
