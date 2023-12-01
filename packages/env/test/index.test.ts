import { expect } from 'chai'
import $rdf from 'rdf-ext'
import prettyFormats from '@rdfjs-elements/formats-pretty'
import { create, DefaultEnv } from '../index.js'
import { Dataset } from '../lib/Dataset.js'

declare module '../formats.js' {
  interface RdfFormat {
    trix: 'application/trix'
  }
}

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

      context('serialize', () => {
        let rdf: DefaultEnv

        beforeEach(() => {
          rdf = create()
          rdf.formats.import(prettyFormats)
        })

        it('uses the selected formatter', async () => {
          const ex = rdf.namespace('http://example.com/')
          const dataset = rdf.dataset().add(env.quad(ex.john, rdf.ns.schema.name, env.literal('John')))

          // when
          const jsonLd = await dataset.serialize({ format: 'application/ld+json' })

          // then
          expect(JSON.parse(jsonLd)).to.deep.eq({
            '@id': 'http://example.com/john',
            'http://schema.org/name': 'John',
          })
        })

        it('supports prefixes', async () => {
          const dataset = rdf.dataset().add(env.quad(rdf.blankNode(), rdf.ns.sh.path, rdf.ns.schema.name))

          // when
          const turtle = await dataset.serialize({
            format: 'text/turtle',
            prefixes: [
              'sh',
              ['schema', 'http://schema.org/'],
            ],
          })

          // then
          expect(turtle).to.eq(`@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix schema: <http://schema.org/> .

_:b1 sh:path schema:name .

`)
        })

        it('outputs canonical quads when unsupported serializer is selected', async () => {
          const ex = rdf.namespace('http://example.com/')
          const dataset = rdf.dataset().add(env.quad(ex.john, rdf.ns.schema.name, env.literal('John')))

          // when
          const serialized = await dataset.serialize({ format: 'application/trix' })

          // then
          expect(serialized).to.eq(dataset.toCanonical())
        })
      })

      context('match', () => {
        it('return instance of self', () => {
          const dataset = env.dataset()

          expect(dataset.match()).to.be.instanceof(env.dataset.Class)
        })
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

        it('implements merge', () => {
          // given
          dataset.add(env.quad(env.blankNode(), env.namedNode('foo'), env.blankNode()))

          // when
          const merged = dataset.merge([
            env.quad(env.blankNode(), env.blankNode(), env.blankNode()),
          ])

          // then
          expect(merged.size).to.eq(2)
          expect(dataset.size).to.eq(1)
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

        it('implements deleteMatches graph removal', () => {
          // given
          const s = env.blankNode()
          const p = env.namedNode('bar')
          const o = env.blankNode()
          const g = env.namedNode('G')
          dataset.add(env.quad(s, p, o, g))

          // then
          expect(dataset.deleteMatches(s, p, o, env.defaultGraph()).size).to.eq(1)
          expect(dataset.deleteMatches(s, p, o, g).size).to.eq(0)
        })

        it('implements filter', () => {
          // given
          const s = env.namedNode('s')
          const o = env.namedNode('p')
          dataset.add(env.quad(s, env.namedNode('foo'), o))
          dataset.add(env.quad(s, env.namedNode('bar'), o))

          // when
          const filtered = dataset.filter(q => env.namedNode('foo').equals(q.predicate))

          // then
          expect(dataset.size).to.eq(2)
          expect(filtered.size).to.eq(1)
          expect([...filtered]).to.deep.contain.members([
            env.quad(s, env.namedNode('foo'), o),
          ])
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

        it('implements forEach', () => {
          // given
          const s = env.namedNode('foo')
          const p = env.namedNode('bar')
          const o = env.namedNode('baz')
          dataset.add(env.quad(s, p, o))

          // when
          let concat = ''
          dataset.forEach(({ subject, predicate, object }) => {
            concat += subject.value + predicate.value + object.value
          })

          // then
          expect(concat).to.eq('foobarbaz')
        })
      })
    }
  })
})
