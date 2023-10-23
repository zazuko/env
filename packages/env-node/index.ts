import formats from '@rdfjs/formats-common'
import type { FactoryConstructor } from '@rdfjs/environment/Environment.js'
import Environment from '@rdfjs/environment'
import DatasetFactory from '@rdfjs/environment/DataFactory.js'
import NamespaceFactory from '@rdfjs/environment/NamespaceFactory.js'
import FormatsFactory from '@rdfjs/environment/FormatsFactory.js'
import TermMapSetFactory from '@rdfjs/environment/TermMapSetFactory.js'
import NsBuildersFactory from '@tpluscode/rdf-ns-builders'
import ClownfaceFactory from 'clownface/Factory.js'
import TraverserFactory from '@rdfjs/traverser/Factory.js'
import DataFactory from '@zazuko/env/lib/DatasetFactory.js'
import FsUtilsFactory from '@zazuko/rdf-utils-fs/Factory.js'
import FetchFactory from '@rdfjs/fetch-lite/Factory.js'

export function create<F extends FactoryConstructor>(...additionalFactories: F[]) {
  // TODO: improve types so that it's not necessary to duplicate this from `@zazuko/env`
  const env = new Environment([
    DataFactory,
    DatasetFactory,
    FormatsFactory,
    NamespaceFactory,
    NsBuildersFactory,
    ClownfaceFactory,
    TermMapSetFactory,
    TraverserFactory,
    FsUtilsFactory,
    FetchFactory,
    ...additionalFactories,
  ])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(<any>env).formats.import(formats)
  return env
}

export default create()

export type NodeEnv = ReturnType<typeof create>
