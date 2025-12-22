import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Workshop = defineDocumentType(() => ({
  name: 'Workshop',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    level: { type: 'string', default: 'Intro' },
    duration: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    updatedAt: { type: 'date', required: false },
  },
  computedFields: {
    slug: { type: 'string', resolve: (doc) => doc._raw.flattenedPath },
    url: { type: 'string', resolve: (doc) => `/workshop/${doc._raw.flattenedPath}` },
  },
}))

export default makeSource({
  contentDirPath: 'src/content/workshop',
  documentTypes: [Workshop],
})
