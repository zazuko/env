import type { Readable } from 'stream'
import type { Stream } from '@rdfjs/types'
import type { Environment } from '@rdfjs/environment/Environment.js'
import type { FormatsFactory } from '@rdfjs/formats/Factory.js'
import type DatasetCore from '@rdfjs/dataset/DatasetCore.js'
import toStream from 'rdf-dataset-ext/toStream.js'
import fromStream from 'rdf-dataset-ext/fromStream.js'
import toCanonical from 'rdf-dataset-ext/toCanonical.js'
import type DataFactory from '@rdfjs/data-model/Factory.js'
import type { TermMapFactory } from '@rdfjs/term-map/Factory.js'
import addAll from 'rdf-dataset-ext/addAll.js'
import type { DatasetCtor } from './Dataset.js'
import type { Dataset } from './DatasetExt.js'
import type { FactoryMethod as BaseFactoryMethod } from './DatasetFactory.js'
import DatasetFactory from './DatasetFactory.js'
import type { SerializeArgs } from './serialize.js'
import { serialize } from './serialize.js'

export interface FactoryMethod<D extends DatasetCore> extends BaseFactoryMethod<D> {
  toCanonical: (quads: DatasetCore) => string
  toStream: (quads: DatasetCore) => Readable & Stream
  fromStream: (stream: Parameters<typeof fromStream>[1]) => Promise<D>
  serialize: (quads: DatasetCore, args: SerializeArgs) => Promise<string>
  import<X extends DatasetCore>(dataset: X, stream: Parameters<typeof fromStream>[1]): Promise<X>
}

export interface DatasetFactoryExt<D extends DatasetCore = Dataset> {
  dataset: FactoryMethod<D>
}

export default <D extends DatasetCore>(createConstructor: (env: Environment<FormatsFactory | DataFactory | TermMapFactory>) => DatasetCtor<D>) => class extends DatasetFactory(createConstructor) implements DatasetFactoryExt<D> {
  public declare dataset: FactoryMethod<D>

  init(this: Environment<FormatsFactory | DatasetFactoryExt<D> | DataFactory | TermMapFactory>) {
    super.init()

    this.dataset.toCanonical = toCanonical
    this.dataset.toStream = toStream
    this.dataset.fromStream = (stream) => {
      return fromStream(this.dataset(), stream)
    }
    this.dataset.serialize = serialize.bind(null, this)
    this.dataset.import = async (d, stream) => {
      return addAll(d, await this.dataset.fromStream(stream))
    }
  }
}
