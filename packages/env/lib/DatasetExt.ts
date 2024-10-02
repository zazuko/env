import type { Readable } from 'stream'
import toCanonical from 'rdf-dataset-ext/toCanonical.js'
import toStream from 'rdf-dataset-ext/toStream.js'
import fromStream from 'rdf-dataset-ext/fromStream.js'
import type * as Rdf from '@rdfjs/types'
import type { Environment } from '@rdfjs/environment/Environment.js'
import { FormatsFactory } from '@rdfjs/formats/Factory.js'
import getStream from 'get-stream'
import knownPrefixes from '@zazuko/prefixes'
import type { Prefixes } from '@zazuko/prefixes/prefixes'
import { MediaType } from '../formats.js'
import { Dataset as SimplerDataset } from './Dataset.js'

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
  return class Dataset extends SimplerDataset {
    import(...[stream]: Rest<Parameters<typeof fromStream>>) {
      return fromStream(this, stream)
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
