import type { Readable } from 'stream'
import DatasetCore from '@rdfjs/dataset/DatasetCore.js'
import ext from 'rdf-dataset-ext'
import type * as Rdf from '@rdfjs/types'
import { Environment } from '@rdfjs/environment/Environment.js'
import { FormatsFactory } from '@rdfjs/environment/FormatsFactory.js'
import getStream from 'get-stream'
import RdfFormat from './RdfFormat.js'

type Rest<A extends unknown[]> = A extends [unknown, ...infer U] ? U : never

export interface Dataset extends Rdf.DatasetCore {
  addAll(...[quads]: Rest<Parameters<typeof ext.addAll>>): Dataset
  deleteMatches(...[subject, predicate, object]: Rest<Parameters<typeof ext.deleteMatch>>): Dataset
  equals(...[other]: Rest<Parameters<typeof ext.equals>>): boolean
  import(...[stream]: Rest<Parameters<typeof ext.fromStream>>): Promise<Dataset>
  filter(filter: (quad: Rdf.Quad, dataset: Dataset) => boolean): Dataset
  map(callback: (quad: Rdf.Quad, dataset: Dataset) => Rdf.Quad): Dataset
  match(...args: Parameters<DatasetCore['match']>): Dataset
  merge(...[other]: Rest<Parameters<typeof ext.addAll>>): Dataset
  merge(...[other]: Rest<Parameters<typeof ext.addAll>>): Dataset
  toCanonical(): string
  toStream(): ReturnType<typeof ext.toStream>

  /**
   * Returns the contents of this dataset in the selected RDF serialization.
   * This requires that the environment includes an appropriate serializer.
   * If it is not found, canonical n-quads are returned
   */
  serialize({ format }: { format: RdfFormat }): Promise<string>
}

export interface DatasetCtor {
  new(quads?: Rdf.Quad[]): Dataset
}

export function createConstructor(env: Environment<FormatsFactory>): DatasetCtor {
  return class Dataset extends DatasetCore {
    addAll(...[quads]: Rest<Parameters<typeof ext.addAll>>) {
      return ext.addAll(this, quads)
    }

    deleteMatches(...[subject, predicate, object]: Rest<Parameters<typeof ext.deleteMatch>>) {
      return ext.deleteMatch(this, subject, predicate, object)
    }

    equals(...[other]: Rest<Parameters<typeof ext.equals>>) {
      return ext.equals(this, other)
    }

    import(...[stream]: Rest<Parameters<typeof ext.fromStream>>) {
      return ext.fromStream(this, stream)
    }

    filter(filter: (quad: Rdf.Quad, dataset: typeof this) => boolean) {
      return new Dataset([...this].filter(quad => filter(quad, this)))
    }

    map(callback: (quad: Rdf.Quad, dataset: typeof this) => Rdf.Quad) {
      return new Dataset([...this].map(quad => callback(quad, this)))
    }

    match(...args: Parameters<DatasetCore['match']>) {
      return super.match(...args) as unknown as Dataset
    }

    merge(...[other]: Rest<Parameters<typeof ext.addAll>>) {
      return ext.addAll(new Dataset([...this]), other)
    }

    toCanonical() {
      return ext.toCanonical(this)
    }

    toStream() {
      return ext.toStream(this)
    }

    async serialize({ format }: { format: RdfFormat }): Promise<string> {
      const serializer = env.formats.serializers.get(format)
      if (!serializer) {
        return this.toCanonical()
      }

      return getStream(<Readable>serializer.import(this.toStream()))
    }
  }
}
