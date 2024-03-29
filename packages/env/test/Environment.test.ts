/* eslint-disable @typescript-eslint/no-this-alias */
import { strictEqual, notStrictEqual, deepStrictEqual } from 'node:assert'
import Environment from '../Environment.js'

describe('Environment', () => {
  it('should copy the given factories array to ._factories', () => {
    class FactoryA {}
    class FactoryB {}
    const factories = [FactoryA, FactoryB]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = new Environment(factories) as any

    notStrictEqual(env._factories, factories)
    strictEqual(env._factories[0], FactoryA)
    strictEqual(env._factories[1], FactoryB)
  })

  it('should call the init function of each factory', () => {
    const called: unknown[] = []
    class FactoryA {
      init() {
        called.push('a')
      }
    }
    class FactoryB {
      init() {
        called.push('b')
      }
    }

    new Environment([FactoryA, FactoryB]) // eslint-disable-line no-new

    deepStrictEqual(called, ['a', 'b'])
  })

  it('should use the environment as this context for the init call', () => {
    let context = null
    class Factory {
      init() {
        context = this
      }
    }

    const env = new Environment([Factory])

    strictEqual(context, env)
  })

  it('should use the environment as this context for all methods if bind is true', () => {
    let context = null
    class Factory {
      a() {
        context = this
      }

      static get exports() {
        return ['a']
      }
    }

    const env = new Environment([Factory], { bind: true })
    const { a } = env

    a()

    strictEqual(context, env)
  })

  it('should attach all methods defined in exports', () => {
    class Factory {
      a() {}
      b() {}

      static get exports() {
        return ['a', 'b']
      }
    }

    const env = new Environment([Factory])

    strictEqual(env.a, Factory.prototype.a)
    strictEqual(env.b, Factory.prototype.b)
  })

  it('should not attach methods not contained in exports', () => {
    class Factory {
      a() {}
      b() {}

      static get exports() {
        return ['b']
      }
    }

    const env = new Environment([Factory])

    strictEqual(typeof env.a, 'undefined')
  })

  describe('.clone', () => {
    it('should be a method', () => {
      const env = new Environment([])

      strictEqual(typeof env.clone, 'function')
    })

    it('should return a new Environment instance', () => {
      const env = new Environment([])

      const result = env.clone()

      strictEqual(result instanceof Environment, true)
      notStrictEqual(result, env)
    })

    it('should call the clone function of each factory', () => {
      const called: unknown[] = []
      class FactoryA {
        clone() {
          called.push('a')
        }
      }
      class FactoryB {
        clone() {
          called.push('b')
        }
      }
      const env = new Environment([FactoryA, FactoryB])

      env.clone()

      deepStrictEqual(called, ['a', 'b'])
    })

    it('should use the environment as this context for the clone call', () => {
      let context = null
      class Factory {
        clone() {
          context = this
        }
      }
      const env = new Environment([Factory])

      const clone = env.clone()

      strictEqual(context, clone)
    })

    it('should use the environment as this context for the clone call', () => {
      let other = null
      class Factory {
        clone(original: unknown) {
          other = original
        }
      }
      const env = new Environment([Factory])

      env.clone()

      strictEqual(other, env)
    })
  })
})
