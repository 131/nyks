# Promise

Promise utilities

------

## Table of Contents

  * [defer()](#defer)
  * [nodeify()](#nodeify)

------

<a name="defer"></a>
## defer() : Promise

Used to interface Asynchronous functions, callback-based (read [NodeJS q defer documentaiton](https://github.com/kriskowal/q#using-deferreds)).

```javascript
const defer = require('nyks/promise/defer');

// do something
```

------

<a name="nodeify"></a>
## nodeify(func) : Function

Callbackify a Promise...

```javascript
const nodeify = require('nyks/promise/nodeify');

// do something
```
