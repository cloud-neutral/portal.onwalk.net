'use client'

import { useMDXComponent } from 'next-contentlayer/hooks'

import WorkshopDemo from './WorkshopDemo'

interface WorkshopArticleProps {
  code: string
}

export default function WorkshopArticle({ code }: WorkshopArticleProps) {
  const MDXContent = useMDXComponent(code)
  return (
    <article className="prose prose-slate max-w-none prose-a:text-brand">
      <MDXContent components={{ WorkshopDemo }} />
    </article>
  )
}
