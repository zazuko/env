import type { Quad } from '@rdfjs/types'
import type { Environment } from '@rdfjs/environment/Environment.js'
import type { FormatsFactory } from '@rdfjs/formats/Factory.js'
import type DatasetCore from '@rdfjs/dataset/DatasetCore.js'
import addAll from 'rdf-dataset-ext/addAll.js'
import deleteMatch from 'rdf-dataset-ext/deleteMatch.js'
import equals from 'rdf-dataset-ext/equals.js'
import type { Dataset, DatasetCtor } from './Dataset.js'

export interface FactoryMethod<D extends DatasetCore> {
  addAll: typeof addAll<Quad, D>
  deleteMatch: typeof deleteMatch<D>
  equals: typeof equals
  (quads?: Iterable<Quad>): D
  Class: DatasetCtor<D>
}

export interface DatasetFactory<D extends DatasetCore = Dataset> {
  dataset: FactoryMethod<D>
}

export default <D extends DatasetCore>(createConstructor: (env: Environment<FormatsFactory>) => DatasetCtor<D>) => class implements DatasetFactory<D> {
  public dataset!: FactoryMethod<D>

  init(this: Environment<FormatsFactory | DatasetFactory<D>>) {
    const Dataset = createConstructor(this)

    this.dataset = ((quads: Iterable<Quad> = []) => {
      return new Dataset([...quads])
    }) as FactoryMethod<D>

    this.dataset.Class = Dataset
    this.dataset.addAll = addAll
    this.dataset.deleteMatch = deleteMatch
    this.dataset.equals = equals
  }
}
