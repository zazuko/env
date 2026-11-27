import { strictEqual } from 'node:assert'
import $rdf from '@zazuko/env/web.js'
import { getDefaultEnvironment, setDefaultEnvironment } from '../index.js'

describe('site-wide default environment', function () {
  afterEach(function () {
    setDefaultEnvironment(undefined)
  })

  it('is undefined until configured', function () {
    strictEqual(getDefaultEnvironment(), undefined)
  })

  it('returns the configured environment', function () {
    const environment = new Proxy($rdf, {})

    setDefaultEnvironment(environment)

    strictEqual(getDefaultEnvironment(), environment)
  })

  it('replaces the previously configured environment', function () {
    const first = new Proxy($rdf, {})
    const second = new Proxy($rdf, {})

    setDefaultEnvironment(first)
    setDefaultEnvironment(second)

    strictEqual(getDefaultEnvironment(), second)
  })
})
