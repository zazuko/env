import { getDefaultEnvironment, setDefaultEnvironment } from '../index.js'

declare const appEnvironment: { greeting(): string }

declare module '../index.js' {
  interface EnvironmentConfig {
    rdf: typeof appEnvironment
  }
}

setDefaultEnvironment(appEnvironment)

const configuredEnvironment: typeof appEnvironment = getDefaultEnvironment()!

// @ts-expect-error The configured value must satisfy the augmented RDF environment type.
setDefaultEnvironment({})

void configuredEnvironment
