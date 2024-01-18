---
"@zazuko/env": patch
"@zazuko/env-node": patch
---

Fixes a weird build problem that generated types referenced `TermSetFactory` from rdf-ext, although it was not used at all. Had to remove `rdf-ext` from dev dependencies of `@zazuko/env` to fix it.
