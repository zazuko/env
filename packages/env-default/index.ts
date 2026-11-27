import type { Environment as RdfEnvironment } from '@rdfjs/environment/Environment.js'

export interface EnvironmentConfig {
  [option: string]: unknown
}

export type Environment = EnvironmentConfig extends { rdf: infer Rdf }
  ? Rdf
  : RdfEnvironment<unknown>

let defaultEnvironment: Environment | undefined

export function setDefaultEnvironment(environment: Environment | undefined): void {
  defaultEnvironment = environment
}

export function getDefaultEnvironment(): Environment | undefined {
  return defaultEnvironment
}
