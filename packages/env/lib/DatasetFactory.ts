import type { Quad } from '@rdfjs/types'
import { Environment } from '@rdfjs/environment/Environment.js'
import { FormatsFactory } from '@rdfjs/formats/Factory.js'
import { Dataset, DatasetCtor, createConstructor } from './Dataset.js'

interface FactoryMethod {
  (quads?: Iterable<Quad>): Dataset
  Class: DatasetCtor
}

export default class DatasetFactory {
  public dataset!: FactoryMethod

  init(this: Environment<FormatsFactory | DatasetFactory>) {
    const Dataset = createConstructor(this)

    this.dataset = ((quads: Iterable<Quad> = []) => {
      return new Dataset([...quads])
    }) as FactoryMethod

    this.dataset.Class = Dataset
  }
}
