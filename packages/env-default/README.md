# @zazuko/env-default

Configure and retrieve the RDF/JS environment shared by an application:

```ts
import rdf from '@zazuko/env/web.js'
import { getDefaultEnvironment, setDefaultEnvironment } from '@zazuko/env-default'

setDefaultEnvironment(rdf)

const appEnvironment = getDefaultEnvironment()
```

Set the environment during application startup, before code that consumes the site-wide default runs. The getter returns `undefined` until an environment has been configured. Its type defaults to the RDF/JS `Environment` type which, in a TypeScript project` has to be customized through `EnvironmentConfig` module augmentation:

```ts
import type { Environment } from '@rdfjs/environment/Environment.js'

declare type Factory = unknown

type MyEnvironment = Environment<Factory>

declare module '@zazuko/env-default' {
  interface EnvironmentConfig {
    rdf: MyEnvironment
  }
}
```

This augmentation makes `getDefaultEnvironment()` return `MyEnvironment` (or `undefined` before configuration). Configure a matching environment at startup; the augmentation applies throughout the TypeScript project.
