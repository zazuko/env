import type { Quad } from '@rdfjs/types'
import { Dataset } from './Dataset.js'

export default class {
  dataset(quads: Iterable<Quad> = []) {
    return new Dataset([...quads])
  }

  static get exports() {
    return ['dataset']
  }
}
