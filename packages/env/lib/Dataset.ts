import DatasetCore from '@rdfjs/dataset/DatasetCore.js'
import ext from 'rdf-dataset-ext'
import { Quad } from '@rdfjs/types'

type Rest<A extends unknown[]> = A extends [unknown, ...infer U] ? U : never

export class Dataset extends DatasetCore {
  addAll(...[quads]: Rest<Parameters<typeof ext.addAll>>) {
    ext.addAll(this, quads)
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

  map<T>(callback: (quad: Quad, dataset: Dataset) => Quad) {
    return new Dataset([...this].map(quad => callback(quad, this)))
  }

  toCanonical() {
    return ext.toCanonical(this)
  }

  toStream() {
    return ext.toStream(this)
  }
}
