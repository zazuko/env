/* eslint-disable @typescript-eslint/no-explicit-any */
import DatasetCore from '@rdfjs/dataset/DatasetCore.js'
import addAll from 'rdf-dataset-ext/addAll.js'
import deleteMatch from 'rdf-dataset-ext/deleteMatch.js'
import equals from 'rdf-dataset-ext/equals.js'
import type * as Rdf from '@rdfjs/types'

type Rest<A extends unknown[]> = A extends [unknown, ...infer U] ? U : never

export interface DatasetCtor<D extends Rdf.DatasetCore> {
  new(quads?: Rdf.Quad[]): D
}

export class Dataset extends DatasetCore {
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

  filter(filter: (quad: Rdf.Quad, dataset: typeof this) => boolean): this {
    return new (this.constructor as any)([...this].filter(quad => filter(quad, this))) as any
  }

  map(callback: (quad: Rdf.Quad, dataset: typeof this) => Rdf.Quad): this {
    return new (this.constructor as any)([...this].map(quad => callback(quad, this))) as any
  }

  merge(...[other]: Rest<Parameters<typeof addAll>>): this {
    return addAll(new (this.constructor as any)([...this]), other) as any
  }
}
