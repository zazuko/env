import FormatsFactory from '@rdfjs/formats/Factory.js'
import { expect } from 'chai'
import { createConstructor } from '../../lib/DatasetExt.js'
import Environment from '../../Environment.js'
import type { Dataset } from '../../lib/Dataset.js'

describe('DatasetExt', () => {
  const Dataset = createConstructor(new Environment([FormatsFactory]))

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
})
