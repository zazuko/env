import type { Readable } from 'stream'
import DatasetCore from '@rdfjs/dataset/DatasetCore.js'
import toCanonical from 'rdf-dataset-ext/toCanonical.js'
import toStream from 'rdf-dataset-ext/toStream.js'
import addAll from 'rdf-dataset-ext/addAll.js'
import deleteMatch from 'rdf-dataset-ext/deleteMatch.js'
import equals from 'rdf-dataset-ext/equals.js'
import fromStream from 'rdf-dataset-ext/fromStream.js'
import type * as Rdf from '@rdfjs/types'
import type { Environment } from '@rdfjs/environment/Environment.js'
import { FormatsFactory } from '@rdfjs/formats/Factory.js'
import getStream from 'get-stream'
import knownPrefixes from '@zazuko/prefixes'
import type { Prefixes } from '@zazuko/prefixes/prefixes'
import { MediaType } from '../formats.js'
import type { Dataset as SimplerDataset } from './Dataset.js'

type Rest<A extends unknown[]> = A extends [unknown, ...infer U] ? U : never

interface SerializeArgs {
  format: MediaType
  /**
   * Prefixes to be used in the serialization. Array values can be prefix known to `@zazuko/prefixes` or a custom prefix
   * pair
   */
  prefixes?: Array<keyof Prefixes | [string, string]>
}

export interface Dataset extends SimplerDataset {
  import(...[stream]: Rest<Parameters<typeof fromStream>>): Promise<Dataset>
  toCanonical(): string
  toStream(): ReturnType<typeof toStream>

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
    addAll(...[quads]: Rest<Parameters<typeof addAll>>) {
      return addAll(this, quads)
    }

    deleteMatches(...args: Rest<Parameters<typeof deleteMatch>>) {
      return deleteMatch(this, ...args)
    }

    equals(...[other]: Rest<Parameters<typeof equals>>) {
      return equals(this, other)
    }

    forEach(callback:(quad: Rdf.Quad, dataset: typeof this) => void) {
      Array.from(this).forEach(quad => callback(quad, this))
    }

    import(...[stream]: Rest<Parameters<typeof fromStream>>) {
      return fromStream(this, stream)
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

    merge(...[other]: Rest<Parameters<typeof addAll>>) {
      return addAll(new Dataset([...this]), other)
    }

    toCanonical() {
      return toCanonical(this)
    }

    toStream() {
      return toStream(this)
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
