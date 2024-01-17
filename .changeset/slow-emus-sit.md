---
"@zazuko/env": major
"@zazuko/env-node": major
---

Change the method of creating derived environments:

1. The additional factories have been removed from the `create` function.
2. To create a derived environment, use the constructor overload which takes a parent environment as the second argument in addition to the array of additional factories.

For example,

```js
import env from '@zazuko/env';
import Environment from '@zazuko/env/Environment.js';
import MyFactory from './my-factory.js';

const myEnv = new Environment([MyFactory], { parent: env });
```
