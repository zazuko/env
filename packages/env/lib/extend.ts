/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Environment } from '@rdfjs/environment/Environment.js'

type Factories<E> = E extends Environment<infer F> ? F : never;
type Distribute<U> = U extends any ? Factories<U> : never;

type CombinedEnvironment<E extends ReadonlyArray<Environment<any>>> = Environment<Distribute<E[number]>>
export type DerivedEnvironment<Env extends Environment<unknown>, Ex extends Environment<unknown>> = CombinedEnvironment<[Env, Ex]>

export function extend<E extends Environment<any>, P extends Environment<any>>(self: E, parent: P) {
  const envs = [self, parent]

  return new Proxy({}, {
    get(target, prop) {
      const value = envs.find(env => prop in env)
      if (value) {
        return value[prop as keyof E]
      }
    },
    set(target, prop, value) {
      envs[0][prop as keyof E] = value

      return true
    },
    has(target, prop) {
      return envs.some(env => prop in env)
    },
  }) as any as DerivedEnvironment<P, E>
}
