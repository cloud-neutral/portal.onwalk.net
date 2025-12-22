import ClientTime from '@/app/components/ClientTime'

interface DocMetaPanelProps {
  description?: string
  updatedAt?: string
  tags?: string[]
}

export default function DocMetaPanel({ description, updatedAt, tags }: DocMetaPanelProps) {
  return (
    <div className="flex flex-col gap-3 text-sm text-brand-heading">
      {description && <p className="text-brand-heading/80">{description}</p>}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-brand-border bg-brand-surface px-3 py-1 text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}
      {updatedAt && (
        <p className="text-xs text-brand-heading/70" suppressHydrationWarning>
          Updated <ClientTime isoString={updatedAt} />
        </p>
      )}
    </div>
  )
}
