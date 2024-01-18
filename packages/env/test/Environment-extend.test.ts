import DataFactory from '@rdfjs/data-model/Factory.js'
import DatasetFactory from '@rdfjs/dataset/Factory.js'
import { expect } from 'chai'
import { schema } from '@tpluscode/rdf-ns-builders'
import Environment from '../Environment.js'
import { TestFactory } from './TestFactory.js'

describe('Environment with parent', () => {
  it('merges all factories', () => {
    // given
    const dataEnv = new Environment([DataFactory])

    // when
    const env = new Environment([DatasetFactory], { parent: dataEnv })

    // then
    expect(env).to.have.property('dataset')
    expect(env).to.have.property('namedNode')
    expect(env.namedNode('http://schema.org/Person')).to.deep.eq(schema.Person)
  })

  it('merge multiple levels', () => {
    // given
    const dataEnv = new Environment([DataFactory])
    const datasetEnv = new Environment([DatasetFactory], { parent: dataEnv })

    // when
    const env = new Environment([TestFactory], { parent: datasetEnv })

    // then
    const test = env.test()
    expect(test.size).to.eq(1)
  })
})
