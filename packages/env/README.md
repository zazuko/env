# Zazuko's [RDF/JS Environment](https://github.com/rdfjs-base/environment)

Like `rdf-ext`, with some additional features.

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

## Browser usage

The main export includes `rdf-dataset-ext` package to extend the dataset's functionality. 
This package may cause issues in the browser, so you can import `@zazuko/env/web.js` instead.

## Additional features

### Dataset

#### Static util functions

The dataset factory implemented by the main module environment provides some static utility functions
from the [rdf-dataset-ext](httos://npm.im/rdf-dataset-ext) package.

```ts
import { Stream, DatasetCore } from '@rdfjs/types'
import env from '@zazuko/env'

let stream: Stream

// shorthand for creating a dataset from a stream
const dataset: DatasetCore = await env.dataset.fromStream(stream)

// stream any DatasetCore
const streamFromCoreDataset: Stream = env.dataset.toStream(dataset)

// convert any DatasetCore to a canonical form
const canonicalQuads = env.dataset.toCanonical(dataset)
```

#### `rdf-ext` functionality

The provided `DatasetCore` implementation provides additional methods, matching the `rdf-ext` interface.

#### Serializing

It also includes a `serialize` method to easily get a string representation for supported formats.
Serializers are not added out of the box and the need to be imported first

```js
import rdf from '@zazuko/env'
import formats from '@rdfjs/formats'

rdf.formats.import(formats)

const dataset = rdf.dataset()

// create some data

const turtle = await dataset.serialize({ format: 'text/turtle' })
```

#### Extending environments

This package adds the ability to create environments on top of existing ones. To do that, pass the parent environment to the constructor options.

```js
import env from '@zazuko/env';
import Environment from '@zazuko/env/Environment.js';
import MyFactory from './my-factory.js';

const myEnv = new Environment([MyFactory], { parent: env });
```

The `myEnv` will have all the factories from `env` and `MyFactory`.
