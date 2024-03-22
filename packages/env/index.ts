import Environment from './Environment.js'
import DatasetFactory from './lib/DatasetFactory.js'
import parent from './lib/env-no-dataset.js'
import { createConstructor } from './lib/DatasetExt.js'

export type { DerivedEnvironment } from '@zazuko/env-core/lib/extend.js'

export function create() {
  return new Environment([DatasetFactory(createConstructor)], { parent })
}

export default create()

export type DefaultEnv = ReturnType<typeof create>
