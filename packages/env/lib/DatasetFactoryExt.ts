import type { Readable } from 'stream'
import type { Stream } from '@rdfjs/types'
import type { Environment } from '@rdfjs/environment/Environment.js'
import { FormatsFactory } from '@rdfjs/formats/Factory.js'
import DatasetCore from '@rdfjs/dataset/DatasetCore.js'
import toStream from 'rdf-dataset-ext/toStream.js'
import fromStream from 'rdf-dataset-ext/fromStream.js'
import toCanonical from 'rdf-dataset-ext/toCanonical.js'
import type { DatasetCtor } from './Dataset.js'
import DatasetFactory, { FactoryMethod as BaseFactoryMethod } from './DatasetFactory.js'

export interface FactoryMethod<D extends DatasetCore> extends BaseFactoryMethod<D> {
  toCanonical: (quads: DatasetCore) => string
  toStream: (quads: DatasetCore) => Readable & Stream
  fromStream: (stream: Readable) => Promise<D>
}

export default <D extends DatasetCore>(createConstructor: (env: Environment<FormatsFactory>) => DatasetCtor<D>) => class DatasetFactoryExt extends DatasetFactory(createConstructor) {
  public declare dataset: FactoryMethod<D>

  init(this: Environment<FormatsFactory | DatasetFactoryExt>) {
    super.init()

    this.dataset.toCanonical = toCanonical
    this.dataset.toStream = toStream
    this.dataset.fromStream = (stream) => {
      return fromStream(this.dataset(), stream)
    }
  }
}
