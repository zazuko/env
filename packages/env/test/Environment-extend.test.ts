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

  it('extending multiple times does not modify parent', () => {
    // given
    const parent = new Environment([])

    // when
    class FooFactory {
      static num = 1
      foo!: string

      init() {
        this.foo = 'bar' + FooFactory.num++
      }
    }

    const child1 = new Environment([FooFactory], { parent })
    const child2 = new Environment([FooFactory], { parent })

    // then
    expect(parent).not.to.have.property('foo')
    expect(child1.foo).to.eq('bar1')
    expect(child2.foo).to.eq('bar2')
  })

  it('should list all object keys', () => {
    // given
    const dataEnv = new Environment([DataFactory])
    const datasetEnv = new Environment([DatasetFactory], { parent: dataEnv })

    // when
    const env = new Environment([TestFactory], { parent: datasetEnv })

    // then
    const keys = [...Object.keys(env)]
    expect(keys).to.include.all.members([
      'namedNode',
      'dataset',
      'test',
    ])
  })
})
