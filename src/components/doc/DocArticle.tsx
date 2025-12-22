import { compileMDX } from 'next-mdx-remote/rsc'

import DocCallout from './DocCallout'
import DocSteps from './DocSteps'

interface DocArticleProps {
  content: string
}

export default async function DocArticle({ content }: DocArticleProps) {
  const mdx = await compileMDX({
    source: content,
    components: {
      Callout: DocCallout,
      Steps: DocSteps,
    },
  })

  return (
    <article className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-a:text-brand prose-a:no-underline hover:prose-a:underline">
      {mdx.content}
    </article>
  )
}
