# Require

Require utilities

------

## Table of Contents

  * [lookup()](#lookup)
  * [resolve()](#resolve)

------

<a name="lookup"></a>
## lookup(file_path) : String

Return the module a file belong to.

```javascript
const lookup = require('nyks/require/lookup');

lookup('./require.md'); // return nyks !
```

------

<a name="resolve"></a>
## resolve(module_name) : String

Simple / portable alternative to require.resolve.

```javascript
const resolve = require('nyks/require/resolve');

resolve("mout"); // return path.join(__dirname, "..", "node_modules", "mout")
```
