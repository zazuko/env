---
"@zazuko/env": patch
---

When extending a parent environment multiple times, properties were set on the parent instead of child, causing it to be overwritten
