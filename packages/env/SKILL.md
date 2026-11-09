---
name: env
description: Use when working with @zazuko/env for RDF/JS terms, datasets, namespaces, Clownface graph manipulation, or RDF serialization. Covers browser imports and extending the default environment; use @zazuko/env-node for filesystem and RDF fetch support.
---

# Working with @zazuko/env

Use the default export for the ready-made environment. It includes data and dataset factories, namespaces, vocabulary builders (`rdf.ns`), Clownface, term maps and sets, traversers, and a formats registry.

```js
import rdf from '@zazuko/env'

const ex = rdf.namespace('https://example.com/')
const dataset = rdf.dataset()
rdf.clownface({ dataset })
  .namedNode(ex('alice'))
  .addOut(rdf.ns.rdf.type, rdf.ns.schema.Person)
  .addOut(rdf.ns.schema.name, 'Alice')
```

Use RDF/JS terms for quad subjects, predicates, objects, and graphs. Clownface accepts strings as literal values in `addOut`, as above.

## Choose the entry point

- `@zazuko/env`: extended datasets with stream, canonicalization, and serialization helpers.
- `@zazuko/env/web.js`: browser entry point with a simpler dataset. Do not assume the extended stream, canonicalization, or serialization helpers exist there.
- `@zazuko/env/Environment.js`: environment constructor for adding factories to a parent. It re-exports the constructor from `@zazuko/env-core`.

The main entry point exports `create()` and the `DefaultEnv` type. `create()` builds a new dataset factory over a shared parent; it does not isolate all inherited state, including the formats registry.

## Dataset operations

Datasets support `addAll`, `deleteMatches`, `equals`, `forEach`, `filter`, `map`, and `merge` in addition to RDF/JS DatasetCore methods. `merge` creates a new dataset. Distinguish instance `dataset.deleteMatches(...)` from factory utility `rdf.dataset.deleteMatch(dataset, ...)`.

With the main entry point:

- `await rdf.dataset.fromStream(stream)` creates a dataset; `await dataset.import(stream)` adds to an existing one.
- `rdf.dataset.toStream(dataset)` and `dataset.toStream()` produce quad streams.
- `rdf.dataset.toCanonical(dataset)` and `dataset.toCanonical()` return canonical strings, useful for comparing datasets containing blank nodes.
- `await rdf.dataset.import(target, stream)` adds streamed quads to an arbitrary DatasetCore and returns that target.

## Serialization

The formats registry starts without parsers and serializers. Register formats before requesting a specific serialization:

```js
import formats from '@rdfjs/formats'

rdf.formats.import(formats)
const turtle = await dataset.serialize({
  format: 'text/turtle',
  prefixes: ['schema', ['ex', 'https://example.com/']],
})
```

Use a MIME type for `format`, not a file extension. `prefixes` accepts known prefix names or `[prefix, namespaceIRI]` pairs. The same options work with `rdf.dataset.serialize(dataset, options)`.

For pretty-printed output, register `@rdfjs-elements/formats-pretty` instead of, or after, the default formats collection:

```js
import prettyFormats from '@rdfjs-elements/formats-pretty'

rdf.formats.import(prettyFormats)
```

Add `@rdfjs-elements/formats-pretty` as a dependency of the consuming application when using it.

If the requested serializer is absent, serialization returns canonical N-Quads instead of throwing. Check registration when output does not match the requested format.

## Extension

Construct `new Environment([MyFactory], { parent: rdf })` to add capabilities. Factories expose prototype methods through static `exports` and can initialize state in `init()`. Both run with the composed environment as `this`. Inherited objects remain shared.

See [README.md](README.md) for more usage examples. When changing this package in the repository, check both main and browser behavior; run `npm test --workspace=@zazuko/env` and `npm run prepack --workspace=@zazuko/env` from the repository root.
