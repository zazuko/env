import { expect } from 'chai'
import $rdf from 'rdf-ext'
import { create } from '../index.js'

describe('@zazuko/env', () => {
  describe('create', () => {
    let env: ReturnType<typeof create>

    context('without additional factories', () => {
      before(() => {
        env = create()
      })

      testStandardFactories()
    })

    context('with additional factory', () => {
      class Factory {
        get foo() {
          return 'bar'
        }

        static get exports() {
          return ['foo']
        }
      }

      before(() => {
        env = create(Factory)
      })

      it('adds that factory', () => {
        // when
        const env = create(Factory)

        // then
        expect(env.foo).to.eq('bar')
      })

      testStandardFactories()
    })

    function testStandardFactories() {
      it('includes include clownface factory', () => {
        expect(env.clownface().namedNode('http://example.com/foo').term).to.deep.eq($rdf.namedNode('http://example.com/foo'))
      })

      it('includes dataset factory', () => {
        expect(env.dataset().size).to.eq(0)
      })

      it('includes data factory', () => {
        expect(env.namedNode('http://example.com/foo')).to.deep.eq($rdf.namedNode('http://example.com/foo'))
      })

      it('includes namespace factory', () => {
        expect(env.namespace('http://example.com/').foo).to.deep.eq($rdf.namedNode('http://example.com/foo'))
      })

      it('includes formats factory', () => {
        expect(env.formats.serializers.import('text/turtle', $rdf.dataset().toStream())).to.be.null
      })

      it('includes ns builders factory', () => {
        expect(env.ns.schema.Person).to.deep.eq($rdf.namedNode('http://schema.org/Person'))
      })

      it('includes term set factory', () => {
        expect(env.termSet()).to.be.ok
      })

      it('includes term map factory', () => {
        expect(env.termMap()).to.be.ok
      })
    }
  })
})
