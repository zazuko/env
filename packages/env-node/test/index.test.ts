import { temporaryFileTask } from 'tempy'
import { expect } from 'chai'
import rdf from '../index.js'

describe('@zazuko/env-node', function () {
  describe('env', function () {
    it('provides toFile and fromFile method', async function () {
      await temporaryFileTask(async (path) => {
        // given
        const dataset = rdf.dataset()

        // when
        await rdf.toFile(dataset.toStream(), path)
        const roundTripped = await rdf.dataset().import(rdf.fromFile(path))

        // then
        expect(roundTripped.toCanonical()).to.eq(dataset.toCanonical())
      }, { extension: 'ttl' })
    })

    it('provides dataset factory static methods', function () {
      expect(rdf.dataset).to.have.property('toCanonical').and.to.be.a('function')
      expect(rdf.dataset).to.have.property('toStream').and.to.be.a('function')
      expect(rdf.dataset).to.have.property('fromStream').and.to.be.a('function')
    })
  })
})
