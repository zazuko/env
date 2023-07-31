import Environment from '@rdfjs/environment'
import type { FactoryConstructor } from '@rdfjs/environment/Environment.js'
import DatasetFactory from '@rdfjs/environment/DataFactory.js'
import DataFactory from '@rdfjs/environment/DatasetFactory.js'
import NamespaceFactory from '@rdfjs/environment/NamespaceFactory.js'
import FormatsFactory from '@rdfjs/environment/FormatsFactory.js'
import TermMapSetFactory from '@rdfjs/environment/TermMapSetFactory.js'
import NsBuildersFactory from '@tpluscode/rdf-ns-builders'
import ClownfaceFactory from 'clownface/Factory.js'

export function create<F extends FactoryConstructor>(...additionalFactories: F[]) {
  return new Environment([
    DataFactory,
    DatasetFactory,
    FormatsFactory,
    NamespaceFactory,
    NsBuildersFactory,
    ClownfaceFactory,
    TermMapSetFactory,
    ...additionalFactories,
  ])
}

export default create()
