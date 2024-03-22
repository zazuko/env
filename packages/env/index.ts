import Environment from './Environment.js'
import DatasetFactory from './lib/DatasetFactory.js'
import parent from './web.js'

export type { DerivedEnvironment } from '@zazuko/env-core/lib/extend.js'

export function create() {
  return new Environment([DatasetFactory], { parent })
}

export default create()

export type DefaultEnv = ReturnType<typeof create>
