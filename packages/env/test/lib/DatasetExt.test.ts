import FormatsFactory from '@rdfjs/formats/Factory.js'
import { expect } from 'chai'
import DataFactory from '@rdfjs/data-model/Factory.js'
import { rdf, rdfs } from '@tpluscode/rdf-ns-builders'
import TermMapFactory from '@rdfjs/term-map/Factory.js'
import formats from '@rdfjs-elements/formats-pretty'
import { createConstructor } from '../../lib/DatasetExt.js'
import Environment from '../../Environment.js'
import type { Dataset } from '../../lib/DatasetExt.js'

describe('DatasetExt', () => {
  const env = new Environment([FormatsFactory, DataFactory, TermMapFactory])
  env.formats.import(formats)

  const Dataset = createConstructor(env)

  describe('.filter', () => {
    it('returns instance of its type', () => {
      // given
      const dataset = new Dataset()

      // when
      const filtered: Dataset = dataset.filter(() => true)

      // then
      expect(filtered).to.be.instanceOf(Dataset)
    })
  })

  describe('.match', () => {
    it('returns instance of its type', () => {
      // given
      const dataset = new Dataset()

      // when
      const matched: Dataset = dataset.match()

      // then
      expect(matched).to.be.instanceOf(Dataset)
    })
  })

  describe('.merge', () => {
    it('returns instance of its type', () => {
      // given
      const dataset = new Dataset()

      // when
      const merged: Dataset = dataset.merge([])

      // then
      expect(merged).to.be.instanceOf(Dataset)
    })
  })

  describe('.map', () => {
    it('returns instance of its type', () => {
      // given
      const dataset = new Dataset()

      // when
      const mapped: Dataset = dataset.map(quad => quad)

      // then
      expect(mapped).to.be.instanceOf(Dataset)
    })
  })

  describe('.serialize', () => {
    it('can rename blank nodes', async () => {
      // given
      const dataset = new Dataset()
      dataset.add(env.quad(env.blankNode(), rdf.type, rdfs.Resource))

      // when
      const turtle = await dataset.serialize({
        format: 'text/turtle',
        prefixes: ['rdf', 'rdfs'],
        renameBlankNodes: true,
      })

      // then
      expect(turtle).to.include('_:t0 a rdfs:Resource .')
    })
  })
})
