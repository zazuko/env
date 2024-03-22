import type { Quad } from '@rdfjs/types'
import type { Environment } from '@rdfjs/environment/Environment.js'
import { FormatsFactory } from '@rdfjs/formats/Factory.js'
import DatasetCore from '@rdfjs/dataset/DatasetCore.js'
import type { DatasetCtor } from './Dataset.js'

export interface FactoryMethod<D extends DatasetCore> {
  (quads?: Iterable<Quad>): D
  Class: DatasetCtor<D>
}

export default <D extends DatasetCore>(createConstructor: (env: Environment<FormatsFactory>) => DatasetCtor<D>) => class DatasetFactory {
  public dataset!: FactoryMethod<D>

  init(this: Environment<FormatsFactory | DatasetFactory>) {
    const Dataset = createConstructor(this)

    this.dataset = ((quads: Iterable<Quad> = []) => {
      return new Dataset([...quads])
    }) as FactoryMethod<D>

    this.dataset.Class = Dataset
  }
}
