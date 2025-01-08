import type { Readable } from 'stream'
import { Transform } from 'stream'
import type { Prefixes } from '@zazuko/prefixes/prefixes'
import type { Environment } from '@rdfjs/environment/Environment.js'
import type { FormatsFactory } from '@rdfjs/formats/Factory.js'
import getStream from 'get-stream'
import knownPrefixes from '@zazuko/prefixes'
import type DatasetCore from '@rdfjs/dataset/DatasetCore.js'
import toCanonical from 'rdf-dataset-ext/toCanonical.js'
import toStream from 'rdf-dataset-ext/toStream.js'
import type { TermMapFactory } from '@rdfjs/term-map/Factory.js'
import type { BlankNode, Quad } from '@rdfjs/types'
import type DataFactory from '@rdfjs/data-model/Factory.js'
import type { MediaType } from '../formats.js'

export interface SerializeArgs {
  format: MediaType
  /**
   * Prefixes to be used in the serialization. Array values can be prefix known to `@zazuko/prefixes` or a custom prefix
   * pair
   */
  prefixes?: Array<keyof Prefixes | [string, string]>
  renameBlankNodes?: boolean
}

export async function serialize(env: Environment<DataFactory | FormatsFactory | TermMapFactory>, dataset: DatasetCore, { renameBlankNodes, format, prefixes = [] }: SerializeArgs): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializer: any = env.formats.serializers.get(format)
  if (!serializer) {
    return toCanonical(dataset)
  }

  let stream: Readable = toStream(dataset)
  if (renameBlankNodes) {
    stream = stream.pipe(new RenameBlankNodes(env))
  }

  return getStream(<Readable>serializer.import(stream, {
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

class RenameBlankNodes extends Transform {
  private readonly blankNodes: Map<BlankNode, BlankNode>

  constructor(private readonly env: Environment<DataFactory | TermMapFactory>) {
    super({ objectMode: true })

    this.blankNodes = env.termMap()
  }

  _transform(chunk: Quad, encoding: string, callback: (error?: Error | null, data?: Quad) => void): void {
    let replaced = false
    let { subject, predicate, object } = chunk

    if (subject && subject.termType === 'BlankNode') {
      subject = this.replaceBlankNode(subject)
      replaced = true
    }

    if (object && object.termType === 'BlankNode') {
      object = this.replaceBlankNode(object)
      replaced = true
    }

    if (!replaced) {
      callback(null, chunk)
    } else {
      callback(null, this.env.quad<Quad>(subject, predicate, object))
    }
  }

  replaceBlankNode(original: BlankNode): BlankNode {
    if (!this.blankNodes.has(original)) {
      const replacement = this.env.blankNode(`t${this.blankNodes.size}`)
      this.blankNodes.set(original, replacement)
    }

    return this.blankNodes.get(original)!
  }
}
