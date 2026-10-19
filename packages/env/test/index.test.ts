import { expect } from 'chai'
import $rdf from '@rdfjs/data-model'
import rdfDs from '@rdfjs/dataset'
import prettyFormats from '@rdfjs-elements/formats-pretty'
import toStream from 'rdf-dataset-ext/toStream.js'
import formats from '@rdfjs/formats'
import type { DefaultEnv } from '../index.js'
import env, { create } from '../index.js'
import type { Dataset } from '../lib/DatasetExt.js'

env.formats.import(formats)

declare module '../formats.js' {
  interface RdfFormat {
    trix: 'application/trix'
  }
}

describe('@zazuko/env', function () {
  describe('create', function () {
    let env: ReturnType<typeof create>

    context('without additional factories', function () {
      before(function () {
        env = create()
      })

      testStandardFactories()

      for (const func of ['addAll', 'deleteMatch', 'equals'] as const) {
        it(`has ${func} utility`, async function () {
          expect(env.dataset[func]).to.be.a('function')
        })
      }
    })

    function testStandardFactories() {
      it('includes include clownface factory', function () {
        expect(env.clownface().namedNode('http://example.com/foo').term).to.deep.eq($rdf.namedNode('http://example.com/foo'))
      })

      it('includes dataset factory', function () {
        expect(env.dataset().size).to.eq(0)
      })

      it('includes data factory', function () {
        expect(env.namedNode('http://example.com/foo')).to.deep.eq($rdf.namedNode('http://example.com/foo'))
      })

      it('includes namespace factory', function () {
        expect(env.namespace('http://example.com/').foo).to.deep.eq($rdf.namedNode('http://example.com/foo'))
      })

      it('includes formats factory', function () {
        expect(env.formats.serializers.import('text/turtle', toStream(rdfDs.dataset()))).to.be.ok
      })

      it('includes ns builders factory', function () {
        expect(env.ns.schema.Person).to.deep.eq($rdf.namedNode('http://schema.org/Person'))
      })

      it('includes term set factory', function () {
        expect(env.termSet()).to.be.ok
      })

      it('includes term map factory', function () {
        expect(env.termMap()).to.be.ok
      })

      context('serialize', function () {
        let rdf: DefaultEnv

        beforeEach(function () {
          rdf = create()
          rdf.formats.import(prettyFormats)
        })

        it('uses the selected formatter', async function () {
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

        it('supports prefixes', async function () {
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

        it('outputs canonical quads when unsupported serializer is selected', async function () {
          const ex = rdf.namespace('http://example.com/')
          const dataset = rdf.dataset().add(env.quad(ex.john, rdf.ns.schema.name, env.literal('John')))

          // when
          const serialized = await dataset.serialize({ format: 'application/trix' })

          // then
          expect(serialized).to.eq(dataset.toCanonical())
        })
      })

      context('match', function () {
        it('return instance of self', function () {
          const dataset = env.dataset()

          expect(dataset.match()).to.be.instanceof(env.dataset.Class)
        })
      })

      context('dataset-ext methods', function () {
        let dataset: Dataset

        beforeEach(function () {
          dataset = env.dataset()
        })

        it('implements addAll', function () {
          // when
          dataset.addAll([
            env.quad(env.blankNode(), env.blankNode(), env.blankNode()),
          ]).addAll([
            env.quad(env.blankNode(), env.blankNode(), env.blankNode()),
          ])

          // then
          expect(dataset.size).to.eq(2)
        })

        it('implements merge', function () {
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

        it('implements equals', function () {
          expect(dataset.equals(env.dataset())).to.be.true
        })

        it('implements deleteMatches', function () {
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

        it('implements deleteMatches graph removal', function () {
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

        it('implements filter', function () {
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

        it('implements to/fromStream', async function () {
          // given
          const s = env.blankNode()
          const p = env.namedNode('bar')
          const o = env.blankNode()
          dataset.add(env.quad(s, p, o))

          const fromStream = await env.dataset().import(dataset.toStream())

          // then
          expect(fromStream.equals(dataset)).to.be.true
        })

        it('implements toCanonical', function () {
          // given
          const s = env.namedNode('foo')
          const p = env.namedNode('bar')
          const o = env.namedNode('baz')
          dataset.add(env.quad(s, p, o))

          // then
          expect(dataset.toCanonical()).to.eq('<foo> <bar> <baz> .\n')
        })

        it('implements map', function () {
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

        it('implements forEach', function () {
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

  describe('dataset factory ext', function () {
    it('has toStream utility', async function () {
      // given
      const quad = $rdf.quad($rdf.namedNode('foo'), $rdf.namedNode('bar'), $rdf.namedNode('baz'))
      const dataset = env.dataset([quad])

      // when
      const streamedQuads = await env.dataset.fromStream(env.dataset.toStream(dataset))

      // then
      expect(env.dataset.toCanonical(streamedQuads)).to.eq(env.dataset.toCanonical(dataset))
    })

    it('has fromStream utility', async function () {
      // given
      const quad = $rdf.quad($rdf.namedNode('foo'), $rdf.namedNode('bar'), $rdf.namedNode('baz'))
      const dataset = env.dataset([quad])

      // when
      const streamedQuads = await env.dataset.fromStream(dataset.toStream())

      // then
      expect(env.dataset.toCanonical(streamedQuads)).to.eq(env.dataset.toCanonical(dataset))
    })

    it('has serialize utility', async function () {
      // given
      const quad = $rdf.quad($rdf.namedNode('foo'), $rdf.namedNode('bar'), $rdf.namedNode('baz'))
      const dataset = env.dataset([quad])

      // when
      const serialized = await env.dataset.serialize(dataset, { format: 'text/turtle' })

      // then
      expect(serialized).to.include('<foo> <bar> <baz> .')
    })

    it('has import utility', async function () {
      // given
      const datasetCore = rdfDs.dataset()
      const quad = $rdf.quad($rdf.namedNode('foo'), $rdf.namedNode('bar'), $rdf.namedNode('baz'))
      const dataset = env.dataset([quad])

      // when
      await env.dataset.import(datasetCore, dataset.toStream())

      // then
      expect(env.dataset.toCanonical(datasetCore)).to.eq(dataset.toCanonical())
    })
  })
})
