---
name: core
description: Use when composing or extending RDF/JS environments with @zazuko/env-core, including custom factories and TypeScript environment types. Use @zazuko/env for a ready-made RDF environment.
---

# RDF/JS environment composition

Import the constructor from `@zazuko/env-core`. This package supplies environment composition, not a default set of RDF factories. Pass factory constructors, not factory instances.

```js
import Environment from '@zazuko/env-core'
import DataFactory from '@rdfjs/data-model/Factory.js'
import NamespaceFactory from '@rdfjs/namespace/Factory.js'

const base = new Environment([DataFactory])
const rdf = new Environment([NamespaceFactory], { parent: base })
const ex = rdf.namespace('https://example.com/')
const subject = ex('subject')
```

To combine existing environments, pass the extending environment as the first argument and the base as `{ parent }`. Environments from `@rdfjs/environment` are also supported.

## Custom factories

Expose prototype methods through a static `exports` array. Methods receive the composed environment as `this`, so they can call other factories' methods. Use `init()` to initialize per-environment state; it also runs with the composed environment as `this`.

```js
class ExampleFactory {
  static exports = ['example']

  example(localName) {
    return this.namedNode(`https://example.com/${localName}`)
  }
}

const extended = new Environment([ExampleFactory], { parent: base })
const node = extended.example('subject')
```

Methods are unbound by default. Keep calls on the environment, or use `{ parent: base, bind: true }` when exported methods must work as detached callbacks. This option binds methods exported by the newly supplied factories.

## Composition semantics and types

- Composition uses a proxy. Property reads use `child[prop] || parent[prop]`, so falsy child values fall back to the parent. It is not an object spread or a deep copy.
- Assignments through the composed environment go to the child. Objects obtained from the parent remain shared; mutating them can affect other environments.
- For TypeScript, let constructor inference combine factory capabilities. Import `DerivedEnvironment` or `CombinedEnvironment` as types from `@zazuko/env-core` when naming composed types. The base `Environment` type comes from `@rdfjs/environment/Environment.js`.

See [README.md](README.md) for basic construction and named type examples. When changing composition in this repository, keep `Environment.js`, `Environment.d.ts`, and `lib/extend.ts` consistent; run `npm test --workspace=@zazuko/env-core` and `npm run prepack --workspace=@zazuko/env-core` from the repository root.
