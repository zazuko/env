---
name: env-default
description: Use when configuring an application-wide RDF/JS environment with @zazuko/env-default and typing it with TypeScript module augmentation.
---

# Configure a site-wide RDF/JS environment

Use `@zazuko/env-default` to set and retrieve one RDF/JS environment shared by an application. Configure it during startup, before code that reads the default environment runs. The getter returns `undefined` until an environment has been set.

```ts
import $rdf from '@zazuko/env/web.js'
import { getDefaultEnvironment, setDefaultEnvironment } from '@zazuko/env-default'

setDefaultEnvironment($rdf)

const environment = getDefaultEnvironment()
```

The getter's type defaults to the web environment. For a custom environment, augment `EnvironmentConfig` with its type so calls to the setter and getter agree:

```ts
import $rdf from '@zazuko/env/web.js'
import RdfEnvironment from '@zazuko/env/Environment.js'
import { getDefaultEnvironment, setDefaultEnvironment } from '@zazuko/env-default'

class CatalogFactory {
  static exports = ['catalogName']

  catalogName() {
    return 'RDF catalog'
  }
}

const appEnvironment = new RdfEnvironment([CatalogFactory], { parent: $rdf })

declare module '@zazuko/env-default' {
  interface EnvironmentConfig {
    rdf: typeof appEnvironment
  }
}

setDefaultEnvironment(appEnvironment)

const configuredEnvironment = getDefaultEnvironment()
configuredEnvironment?.catalogName()
```

Module augmentation applies throughout the TypeScript project. Keep the augmentation and runtime configuration in startup code so the declared type and configured value stay aligned. Consumers should handle the `undefined` result when configuration may not have run yet.
