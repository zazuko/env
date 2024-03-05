import NamespaceFactory from '@rdfjs/namespace/Factory.js'
import DataFactory from '@rdfjs/data-model/Factory.js'
import BaseEnvironment from '@rdfjs/environment'
import { expect } from 'chai'
import Environment from '../Environment.js'

describe('@zazuko/env-core', () => {
  describe('Environment', () => {
    it('can combine two environments', () => {
      // given
      const baseEnv = new Environment([DataFactory])
      const extendingEnv = new Environment([NamespaceFactory])

      // when
      const rdf = new Environment(extendingEnv, { parent: baseEnv })

      // then
      const ns = rdf.namespace('http://example.com/')
      expect(ns.foo).to.deep.equal(rdf.namedNode('http://example.com/foo'))
    })

    it('can combine two RDF/JS environments', () => {
      // given
      const baseEnv = new BaseEnvironment([DataFactory])
      const extendingEnv = new BaseEnvironment([NamespaceFactory])

      // when
      const rdf = new Environment(extendingEnv, { parent: baseEnv })

      // then
      const ns = rdf.namespace('http://example.com/')
      expect(ns.foo).to.deep.equal(rdf.namedNode('http://example.com/foo'))
    })
  })
})
