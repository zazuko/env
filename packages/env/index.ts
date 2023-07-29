import Environment from '@rdfjs/environment'
import DatasetFactory from '@rdfjs/environment/DataFactory.js'
import DataFactory from '@rdfjs/environment/DatasetFactory.js'
import NamespaceFactory from '@rdfjs/environment/NamespaceFactory.js'
import FormatsFactory from '@rdfjs/environment/FormatsFactory.js'
import NsBuildersFactory from '@tpluscode/rdf-ns-builders'
import ClownfaceFactory from 'clownface/Factory.js'

interface FactoryConstructor<F = object> {
  new(...args: unknown[]): F
}

export function create<F extends FactoryConstructor>(...additionalFactories: F[]) {
  return new Environment([
    DataFactory,
    DatasetFactory,
    FormatsFactory,
    NamespaceFactory,
    NsBuildersFactory,
    ClownfaceFactory,
    ...additionalFactories,
  ])
}

export default create()
