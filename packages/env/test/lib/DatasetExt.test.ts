import FormatsFactory from '@rdfjs/formats/Factory.js'
import { expect } from 'chai'
import { createConstructor } from '../../lib/DatasetExt.js'
import Environment from '../../Environment.js'

describe('DatasetExt', () => {
  const Dataset = createConstructor(new Environment([FormatsFactory]))

  describe('.filter', () => {
    it('returns instance of its type', () => {
      // given
      const dataset = new Dataset()

      // when
      const filtered = dataset.filter(() => true)

      // then
      expect(filtered).to.be.instanceOf(Dataset)
    })
  })

  describe('.match', () => {
    it('returns instance of its type', () => {
      // given
      const dataset = new Dataset()

      // when
      const matched = dataset.match()

      // then
      expect(matched).to.be.instanceOf(Dataset)
    })
  })

  describe('.merge', () => {
    it('returns instance of its type', () => {
      // given
      const dataset = new Dataset()

      // when
      const merged = dataset.merge([])

      // then
      expect(merged).to.be.instanceOf(Dataset)
    })
  })

  describe('.map', () => {
    it('returns instance of its type', () => {
      // given
      const dataset = new Dataset()

      // when
      const mapped = dataset.map(quad => quad)

      // then
      expect(mapped).to.be.instanceOf(Dataset)
    })
  })
})
