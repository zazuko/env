# @zazuko/env-node

## 3.0.0

### Major Changes

- 4617737: Updated vocabulary builders (breaking changes to QUDT and RiCO namespaces)

### Patch Changes

- Updated dependencies [4617737]
  - @zazuko/env@3.0.0

## 2.1.5

### Patch Changes

- a95c245: Updated all types packages to use `@rdfjs/types` v2
- Updated dependencies [a95c245]
  - @zazuko/env@2.5.3

## 2.1.4

### Patch Changes

- 738f98c: Missing `@types/rdfjs__formats` dependency caused derived anvs to be typed as `Environment<any>`

## 2.1.3

### Patch Changes

- d119491: Update generated types

## 2.1.2

### Patch Changes

- ca67860: Package built with `moduleResolution=NodeNext`
- Updated dependencies [ca67860]
  - @zazuko/env@2.1.1

## 2.1.1

### Patch Changes

- f3ded69: One more attempt at fixing `TermSetFactory` problem

## 2.1.0

### Minor Changes

- 16faf2f: Re-export `Environment` from `@zazuko/env`

### Patch Changes

- 1ddac0f: Fixes a weird build problem that generated types referenced `TermSetFactory` from rdf-ext, although it was not used at all. Had to remove `rdf-ext` from dev dependencies of `@zazuko/env` to fix it.
- Updated dependencies [1ddac0f]
  - @zazuko/env@2.0.2

## 2.0.0

### Major Changes

- 2aab3d0: Change the method of creating derived environments:

  1. The additional factories have been removed from the `create` function.
  2. To create a derived environment, use the constructor overload which takes a parent environment as the second argument in addition to the array of additional factories.

  For example,

  ```js
  import env from "@zazuko/env";
  import Environment from "@zazuko/env/Environment.js";
  import MyFactory from "./my-factory.js";

  const myEnv = new Environment([MyFactory], { parent: env });
  ```

### Patch Changes

- Updated dependencies [2aab3d0]
  - @zazuko/env@2.0.0

## 1.0.4

### Patch Changes

- bf2c9a1: Update to `@rdfjs/environment` v1 and its updated dependencies. Notably, `@rdfjs/formats` replaced `@rdfjs/formats-common`
- Updated dependencies [8cc7a4e]
- Updated dependencies [bf2c9a1]
  - @zazuko/env@1.11.1

## 1.0.3

### Patch Changes

- ac2a2f3: Update `@zazuko/rdf-utils-fs`
- Updated dependencies [5c592b1]
  - @zazuko/env@1.11.0

## 1.0.2

### Patch Changes

- b154b2d: Update `rdf-utils-fs`

## 1.0.1

### Patch Changes

- 29ffc05: Missing types of fetch-lite caused TS errors

## 1.0.0

### Major Changes

- 64611c4: First version

### Patch Changes

- Updated dependencies [38ca62c]
- Updated dependencies [b9b21f3]
  - @zazuko/env@1.9.0
