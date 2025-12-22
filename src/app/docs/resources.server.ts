import 'server-only'

import { cache } from 'react'

import { getDocCollection, getDocCollections as loadDocCollections, getDocParams } from '@lib/docContent'
import { isFeatureEnabled } from '@lib/featureToggles'
import type { DocCollection } from './types'

const isDocsModuleEnabled = () => isFeatureEnabled('appModules', '/docs')

export const getDocCollections = cache(async (): Promise<DocCollection[]> => {
  if (!isDocsModuleEnabled()) {
    return []
  }
  return loadDocCollections()
})

export const getDocCollectionsForBuildTime = getDocCollections

export async function getDocResources(): Promise<DocCollection[]> {
  return getDocCollections()
}

export async function getDocResource(slug: string): Promise<DocCollection | undefined> {
  if (!isDocsModuleEnabled()) {
    return undefined
  }

  const collections = await getDocCollections()
  return collections.find((doc) => doc.slug === slug)
}

export async function getDocVersionParams() {
  if (!isDocsModuleEnabled()) {
    return []
  }
  return getDocParams()
}

export async function getDocVersion(slug: string, version: string) {
  if (!isDocsModuleEnabled()) {
    return undefined
  }
  const collection = await getDocCollection(slug)
  if (!collection) return undefined
  const versionMatch = collection.versions.find((item) => item.slug === version)
  if (!versionMatch) return undefined
  return { collection, version: versionMatch }
}
