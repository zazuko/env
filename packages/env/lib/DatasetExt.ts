import toCanonical from 'rdf-dataset-ext/toCanonical.js'
import toStream from 'rdf-dataset-ext/toStream.js'
import fromStream from 'rdf-dataset-ext/fromStream.js'
import type * as Rdf from '@rdfjs/types'
import type { Environment } from '@rdfjs/environment/Environment.js'
import { FormatsFactory } from '@rdfjs/formats/Factory.js'
import { Dataset as SimplerDataset } from './Dataset.js'
import { serialize, SerializeArgs } from './serialize.js'

type Rest<A extends unknown[]> = A extends [unknown, ...infer U] ? U : never

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
  return class extends SimplerDataset {
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
      return serialize(env, this, { format, prefixes })
    }
  }
}
