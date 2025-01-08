import type { Environment } from '@rdfjs/environment/Environment.js'
import type DataFactory from '@rdfjs/data-model/Factory.js'
import type DatasetFactory from '@rdfjs/dataset/Factory.js'

export class TestFactory {
  test(this: Environment<DataFactory | DatasetFactory>) {
    return this.dataset([
      this.quad(this.blankNode(), this.namedNode('http://example.org/'), this.literal('test')),
    ])
  }

  static get exports() {
    return ['test']
  }
}
