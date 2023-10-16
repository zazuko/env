import DatasetCore from '@rdfjs/dataset/DatasetCore.js'
import ext from 'rdf-dataset-ext'
import type { Quad } from '@rdfjs/types'

type Rest<A extends unknown[]> = A extends [unknown, ...infer U] ? U : never

export class Dataset extends DatasetCore {
  addAll(...[quads]: Rest<Parameters<typeof ext.addAll>>) {
    return ext.addAll(this, quads)
  }

  deleteMatches(...[subject, predicate, object]: Rest<Parameters<typeof ext.deleteMatch>>) {
    ext.deleteMatch(this, subject, predicate, object)
  }

  equals(...[other]: Rest<Parameters<typeof ext.equals>>) {
    return ext.equals(this, other)
  }

  import(...[stream]: Rest<Parameters<typeof ext.fromStream>>) {
    return ext.fromStream(this, stream)
  }

  filter(filter: (quad: Quad, dataset: typeof this) => boolean) {
    return new Dataset([...this].filter(quad => filter(quad, this)))
  }

  map(callback: (quad: Quad, dataset: typeof this) => Quad) {
    return new Dataset([...this].map(quad => callback(quad, this)))
  }

  match(...args: Parameters<DatasetCore['match']>): Dataset {
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
}
