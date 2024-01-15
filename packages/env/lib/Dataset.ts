import type { Readable } from 'stream'
import DatasetCore from '@rdfjs/dataset/DatasetCore.js'
import ext from 'rdf-dataset-ext'
import type * as Rdf from '@rdfjs/types'
import { Environment } from '@rdfjs/environment/Environment.js'
import { FormatsFactory } from '@rdfjs/environment/FormatsFactory.js'
import getStream from 'get-stream'
import knownPrefixes from '@zazuko/prefixes'
import type { Prefixes } from '@zazuko/prefixes/prefixes'
import { MediaType } from '../formats.js'

type Rest<A extends unknown[]> = A extends [unknown, ...infer U] ? U : never

interface SerializeArgs {
  format: MediaType
  /**
   * Prefixes to be used in the serialization. Array values can be prefix known to `@zazuko/prefixes` or a custom prefix
   * pair
   */
  prefixes?: Array<keyof Prefixes | [string, string]>
}

export interface Dataset extends Rdf.DatasetCore {
  addAll(...[quads]: Rest<Parameters<typeof ext.addAll>>): Dataset
  deleteMatches(...args: Rest<Parameters<typeof ext.deleteMatch>>): Dataset
  equals(...[other]: Rest<Parameters<typeof ext.equals>>): boolean
  import(...[stream]: Rest<Parameters<typeof ext.fromStream>>): Promise<Dataset>
  filter(filter: (quad: Rdf.Quad, dataset: Dataset) => boolean): Dataset
  map(callback: (quad: Rdf.Quad, dataset: Dataset) => Rdf.Quad): Dataset
  forEach(callback: (quad: Rdf.Quad, dataset: Dataset) => void): void
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
  serialize(args: SerializeArgs): Promise<string>
}

export interface DatasetCtor {
  new(quads?: Rdf.Quad[]): Dataset
}

export function createConstructor(env: Environment<FormatsFactory>): DatasetCtor {
  return class Dataset extends DatasetCore {
    addAll(...[quads]: Rest<Parameters<typeof ext.addAll>>) {
      return ext.addAll(this, quads)
    }

    deleteMatches(...args: Rest<Parameters<typeof ext.deleteMatch>>) {
      return ext.deleteMatch(this, ...args)
    }

    equals(...[other]: Rest<Parameters<typeof ext.equals>>) {
      return ext.equals(this, other)
    }

    forEach(callback:(quad: Rdf.Quad, dataset: typeof this) => void) {
      Array.from(this).forEach(quad => callback(quad, this))
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

    async serialize({ format, prefixes = [] }: SerializeArgs): Promise<string> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serializer: any = env.formats.serializers.get(format)
      if (!serializer) {
        return this.toCanonical()
      }

      return getStream(<Readable>serializer.import(this.toStream(), {
        prefixes: prefixes.reduce((map, prefix) => {
          if (Array.isArray(prefix)) {
            return { ...map, [prefix[0]]: prefix[1] }
          }

          if (prefix in knownPrefixes) {
            return { ...map, [prefix]: knownPrefixes[prefix] }
          }

          return map
        }, {}),
      }))
    }
  }
}
