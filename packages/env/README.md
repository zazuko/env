# Zazuko's [RDF/JS Environment](https://github.com/rdfjs-base/environment)

Like `rdf-ext`, with the addition of `@tpluscode/rdf-ns-builders`

```js
import env from '@zazuko/env'

// bind namespace to create named nodes
const tbbt = env.namespace('https://tbbt.tv/')

// use clownface for easy graph manipulation
const sheldonCooper = env.clownface()
  .namedNode(tbbt.sheldon)
  // use common vocabularies out-of-the box  
  .addOut(env.ns.rdf.type, env.ns.schema.Person)
  .addOut(env.ns.schema.knows, tbbt.leonard)
```

Also, provides TypeScript types for the default environment and a mapped type,
which helps declare derived environment type, which combines existing envirnment
with additional factories

```ts
import { create, DefaultEnv, DerivedEnvironment } from '@zazuko/env'

class MyFactory {}

const myEnv: DerivedEnvironment<MyFactory> = create(MyFactory)
```
