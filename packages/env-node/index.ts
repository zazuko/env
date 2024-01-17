import formats from '@rdfjs/formats'
import baseEnv from '@zazuko/env'
import Environment from '@zazuko/env/Environment.js'
import FsUtilsFactory from '@zazuko/rdf-utils-fs/Factory.js'
import FetchFactory from '@rdfjs/fetch-lite/Factory.js'

export function create() {
  const env = new Environment([
    FsUtilsFactory,
    FetchFactory,
  ], { parent: baseEnv })
  env.formats.import(formats)
  return env
}

export default create()

export type NodeEnv = ReturnType<typeof create>
