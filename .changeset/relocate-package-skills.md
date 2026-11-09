---
"@zazuko/env-core": patch
"@zazuko/env": patch
"@zazuko/env-node": patch
---

Move packaged skills into dedicated `skills/<name>/` directories and update package file lists so `skills experimental_sync` discovers them. Add references from the env and env-node skills to dependency skills for shared RDF operations and environment composition.
