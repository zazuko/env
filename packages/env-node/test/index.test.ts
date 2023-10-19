import { temporaryFileTask } from 'tempy'
import { expect } from 'chai'
import rdf from '../index.js'

describe('@zazuko/env-node', () => {
  describe('env', () => {
    it('provides toFile and fromFile method', async () => {
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
  })
})
