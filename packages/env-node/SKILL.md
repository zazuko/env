---
name: zazuko-env-node
description: Use @zazuko/env-node to read and write RDF files, fetch RDF in Node.js, and serialize datasets with bundled formats. Use for Node.js RDF I/O; use @zazuko/env/web.js for browser code.
---

# RDF I/O in Node.js

Import the default environment from `@zazuko/env-node`. It extends `@zazuko/env` with filesystem utilities from `@zazuko/rdf-utils-fs`, fetch from `@zazuko/rdf-fetch`, and the default parsers and serializers from `@rdfjs/formats`.

## Read and write files

Filesystem methods work with quad streams. Convert to or from datasets explicitly:

```js
import rdf from '@zazuko/env-node'

const dataset = await rdf.dataset.fromStream(rdf.fromFile('input.ttl'))
await rdf.toFile(dataset.toStream(), 'output.ttl')
```

Use a recognized RDF extension such as `.ttl` when relying on format detection. `await rdf.dataset().import(rdf.fromFile(path))` is also supported. Await dataset import and file writing so parsing and serialization failures propagate to the caller.

## Fetch RDF

Use the environment's `rdf.fetch` method, supplied by `@zazuko/rdf-fetch`, for RDF-aware HTTP requests. Its response adds asynchronous `dataset()` and `quadStream()` methods:

```js
const response = await rdf.fetch('https://example.com/data.ttl')
if (!response.ok) {
  throw new Error(`RDF request failed: ${response.status}`)
}
const remoteDataset = await response.dataset()
```

Parsing selects a registered parser using the response's `Content-Type`. Consult the dependency's installed API and types for request bodies, headers, and additional options.

## Formats and datasets

The extended dataset API from `@zazuko/env` is available, including instance `import`, `toStream`, `toCanonical`, and `serialize`, plus factory utilities such as `rdf.dataset.fromStream` and `rdf.dataset.toCanonical`.

Unlike `@zazuko/env`, this package registers default formats automatically:

```js
const turtle = await dataset.serialize({ format: 'text/turtle' })
```

For pretty-printed output, add `@rdfjs-elements/formats-pretty` as a dependency of the consuming application and import it after the bundled formats to replace or supplement serializers:

```js
import formats from '@rdfjs-elements/formats-pretty'

rdf.formats.import(formats)
```

Serialization uses MIME types. If a serializer is missing, dataset serialization falls back to canonical N-Quads. Do not infer the output syntax solely from the requested format.

## Environment lifetime and extension

The package exports `create()`, the `NodeEnv` type, and a named `Environment` constructor. Extend it with `new Environment([MyFactory], { parent: rdf })`.

`create()` adds filesystem and fetch factories over the shared base environment and imports formats into its inherited registry. It does not create a fully isolated environment; registry changes can affect other instances. Account for that when configuring formats in tests or applications.

See [README.md](README.md) for format customization. When changing this package in the repository, run `npm test --workspace=@zazuko/env-node` and `npm run prepack --workspace=@zazuko/env-node` from the repository root. The existing test demonstrates a temporary Turtle file round trip.
