import type { Readable } from 'stream'
import type { Prefixes } from '@zazuko/prefixes/prefixes'
import { Environment } from '@rdfjs/environment/Environment.js'
import { FormatsFactory } from '@rdfjs/formats/Factory.js'
import getStream from 'get-stream'
import knownPrefixes from '@zazuko/prefixes'
import DatasetCore from '@rdfjs/dataset/DatasetCore.js'
import toCanonical from 'rdf-dataset-ext/toCanonical.js'
import toStream from 'rdf-dataset-ext/toStream.js'
import { MediaType } from '../formats.js'

export interface SerializeArgs {
  format: MediaType
  /**
   * Prefixes to be used in the serialization. Array values can be prefix known to `@zazuko/prefixes` or a custom prefix
   * pair
   */
  prefixes?: Array<keyof Prefixes | [string, string]>
}

export async function serialize(env: Environment<FormatsFactory>, dataset: DatasetCore, { format, prefixes = [] }: SerializeArgs): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializer: any = env.formats.serializers.get(format)
  if (!serializer) {
    return toCanonical(dataset)
  }

  return getStream(<Readable>serializer.import(toStream(dataset), {
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
