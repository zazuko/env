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

export function ThisReturningMethods<D extends DatasetCore>(Base: DatasetCtor<D>) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return class extends Base {
    filter(filter: (quad: Rdf.Quad, dataset: typeof this) => boolean): D {
      return new (this.constructor as any)([...this].filter(quad => filter(quad, this)))
    }

    map(callback: (quad: Rdf.Quad, dataset: typeof this) => Rdf.Quad): D {
      return new (this.constructor as any)([...this].map(quad => callback(quad, this)))
    }

    match(...args: Parameters<DatasetCore['match']>): D {
      return super.match(...args) as any
    }

    merge(...[other]: Rest<Parameters<typeof addAll>>): D {
      return addAll(new (this.constructor as any)([...this]), other)
    }
  }
}

export class Dataset extends ThisReturningMethods(DatasetCore) {
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
}
