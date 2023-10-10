import { expect } from 'chai'
import $rdf from 'rdf-ext'
import { create } from '../index.js'
import { Dataset } from '../lib/Dataset.js'

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

      context('dataset-ext methods', () => {
        let dataset: Dataset

        beforeEach(() => {
          dataset = env.dataset()
        })

        it('implements addAll', () => {
          // when
          dataset.addAll([
            env.quad(env.blankNode(), env.blankNode(), env.blankNode()),
          ]).addAll([
            env.quad(env.blankNode(), env.blankNode(), env.blankNode()),
          ])

          // then
          expect(dataset.size).to.eq(2)
        })

        it('implements equals', () => {
          expect(dataset.equals(env.dataset())).to.be.true
        })

        it('implements deleteMatches', () => {
          // given
          const s = env.blankNode()
          const p = env.namedNode('bar')
          const o = env.blankNode()
          dataset.add(env.quad(s, p, o))

          // when
          dataset.deleteMatches(s, p, o)

          // then
          expect(dataset.size).to.eq(0)
        })

        it('implements to/fromStream', async () => {
          // given
          const s = env.blankNode()
          const p = env.namedNode('bar')
          const o = env.blankNode()
          dataset.add(env.quad(s, p, o))

          const fromStream = await env.dataset().import(dataset.toStream())

          // then
          expect(fromStream.equals(dataset)).to.be.true
        })

        it('implements toCanonical', () => {
          // given
          const s = env.namedNode('foo')
          const p = env.namedNode('bar')
          const o = env.namedNode('baz')
          dataset.add(env.quad(s, p, o))

          // then
          expect(dataset.toCanonical()).to.eq('<foo> <bar> <baz> .\n')
        })

        it('implements map', () => {
          // given
          const s = env.namedNode('foo')
          const p = env.namedNode('bar')
          const o = env.namedNode('baz')
          const g = env.namedNode('G')
          dataset.add(env.quad(s, p, o))

          // when
          dataset = dataset.map(({ subject, predicate, object }) => {
            return env.quad(subject, predicate, object, g)
          })

          // then
          const expected = env.dataset([env.quad(s, p, o, g)])
          expect(dataset.equals(expected)).to.be.true
        })
      })
    }
  })
})
