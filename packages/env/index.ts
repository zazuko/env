import DataFactory from '@rdfjs/data-model/Factory.js'
import NamespaceFactory from '@rdfjs/namespace/Factory.js'
import FormatsFactory from '@rdfjs/formats/Factory.js'
import TermMapFactory from '@rdfjs/term-map/Factory.js'
import TermSetFactory from '@rdfjs/term-set/Factory.js'
import NsBuildersFactory from '@tpluscode/rdf-ns-builders'
import ClownfaceFactory from 'clownface/Factory.js'
import TraverserFactory from '@rdfjs/traverser/Factory.js'
import Environment from './Environment.js'
import DatasetFactory from './lib/DatasetFactory.js'

export { DerivedEnvironment } from './lib/extend.js'

export function create() {
  return new Environment([
    DataFactory,
    DatasetFactory,
    FormatsFactory,
    NamespaceFactory,
    NsBuildersFactory,
    ClownfaceFactory,
    TermMapFactory,
    TermSetFactory,
    TraverserFactory,
  ])
}

export default create()

export type DefaultEnv = ReturnType<typeof create>
