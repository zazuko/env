/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Environment } from '@rdfjs/environment/Environment.js'

type Factories<E> = E extends Environment<infer F> ? F : never;
type Distribute<U> = U extends any ? Factories<U> : never;

export type CombinedEnvironment<E extends ReadonlyArray<Environment<any>>> = Environment<Distribute<E[number]>>
export type DerivedEnvironment<Env extends Environment<unknown>, Ex extends Environment<unknown>> = CombinedEnvironment<[Env, Ex]>

export function extend<E extends Environment<any>, P extends Environment<any>>({ parent, child }: {parent: P; child: E}) {
  const proxy = new Proxy({}, {
    get(target, prop) {
      return child[prop] || parent[prop]
    },
    set(target, prop, value) {
      child[prop as keyof E] = value

      return true
    },
    has(target, prop) {
      return prop in child || prop in parent
    },
    ownKeys() {
      const parentKeys = Object.getOwnPropertyNames(parent)
      const childKeys = Object.getOwnPropertyNames(child)
      return [...new Set([...parentKeys, ...childKeys]).values()]
    },
    getOwnPropertyDescriptor(target, prop) {
      return {
        enumerable: !prop.toString().startsWith('_'),
        configurable: true,
      }
    },
  })

  return proxy as any as DerivedEnvironment<P, E>
}
