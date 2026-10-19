import { expect } from 'chai'
import { Dataset } from '../../lib/Dataset.js'

describe('Dataset', function () {
  describe('.filter', function () {
    it('returns instance of its type', function () {
      // given
      const dataset = new Dataset()

      // when
      const filtered: Dataset = dataset.filter(() => true)

      // then
      expect(filtered).to.be.instanceOf(Dataset)
    })
  })

  describe('.match', function () {
    it('returns instance of its type', function () {
      // given
      const dataset = new Dataset()

      // when
      const matched: Dataset = dataset.match()

      // then
      expect(matched).to.be.instanceOf(Dataset)
    })
  })

  describe('.merge', function () {
    it('returns instance of its type', function () {
      // given
      const dataset = new Dataset()

      // when
      const merged: Dataset = dataset.merge([])

      // then
      expect(merged).to.be.instanceOf(Dataset)
    })
  })

  describe('.map', function () {
    it('returns instance of its type', function () {
      // given
      const dataset = new Dataset()

      // when
      const mapped: Dataset = dataset.map(quad => quad)

      // then
      expect(mapped).to.be.instanceOf(Dataset)
    })
  })
})
