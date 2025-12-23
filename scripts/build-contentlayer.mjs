import * as core from '@contentlayer/core'
import { OT, pipe, T } from '@contentlayer/utils/effect'

async function main() {
  const buildEffect = pipe(
    core.getConfig({ configPath: 'contentlayer.config.ts' }),
    T.tap((config) =>
      config.source?.options?.disableImportAliasWarning ? T.unit : T.fork(core.validateTsconfig)
    ),
    T.chain((config) => core.generateDotpkg({ config, verbose: false })),
    T.tap(core.logGenerateInfo),
    OT.withSpan('scripts/build-contentlayer')
  )

  await pipe(
    buildEffect,
    core.runMain({
      tracingServiceName: 'contentlayer-cli',
      verbose: false,
    })
  )
}

main().catch((error) => {
  console.error('Contentlayer build failed:', error)
  process.exit(1)
})
