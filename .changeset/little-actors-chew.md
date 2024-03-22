---
"@zazuko/env": minor
---

Added a `@zazuko/env/web.js` module which does not include dependencies on Node.js modules that are not available in the browser. This is useful for web applications that use the `@zazuko/env` and avoid bundling issues.
