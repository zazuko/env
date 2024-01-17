import Environment from '@rdfjs/environment'
import type { FactoryConstructor, Environment as IE } from '@rdfjs/environment/Environment.js'
import DataFactory from '@rdfjs/data-model/Factory.js'
import NamespaceFactory from '@rdfjs/namespace/Factory.js'
import FormatsFactory from '@rdfjs/formats/Factory.js'
import TermMapFactory from '@rdfjs/term-map/Factory.js'
import TermSetFactory from '@rdfjs/term-set/Factory.js'
import NsBuildersFactory from '@tpluscode/rdf-ns-builders'
import ClownfaceFactory from 'clownface/Factory.js'
import TraverserFactory from '@rdfjs/traverser/Factory.js'
import DatasetFactory from './lib/DatasetFactory.js'

export type DerivedEnvironment<Env, Ex> = Env extends IE<infer F> ? IE<Ex | F> : never

export function create<F extends FactoryConstructor>(...additionalFactories: F[]) {
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
    ...additionalFactories,
  ])
}

export default create()

export type DefaultEnv = ReturnType<typeof create>
