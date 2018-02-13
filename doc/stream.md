# Stream

Stream utilities

------

## Table of Contents

  * [drain()](#drain)
  * [fromBuffer()](#fromBuffer)
  * [pipe()](#pipe)

------

<a name="drain"></a>
## drain(stream) : Promise

Drain a stream, return the contents as a buffer.

```javascript
const fs = require('fs');

const drain   = require('nyks/stream/drain');
const tmppath = require('nyks/fs/tmppath');

let tmp_file = tmppath();

fs.writeFileSync(tmp_file, "dummy");

let stream = fs.createReadStream(tmp_file);

(async function() {
  await drain(stream); // return "dummy" as a Buffer
})();
```

------

<a name="fromBuffer"></a>
## fromBuffer(buffer) : Stream

Return a readable stream from a buffer.

```javascript
const fromBuffer = require('nyks/stream/fromBuffer');

let buffer = new Buffer('dummy');

let stream = fromBuffer(buffer); // return a readable stream
```

------

<a name="pipe"></a>
## pipe(src, dest) : Promise

Pipe a stream to another.

```javascript
const fs = require('fs');

const pipe    = require('nyks/stream/pipe');
const tmppath = require('nyks/fs/tmppath');

let tmp_path = tmppath("foo");
let dest     = fs.createWriteStream(tmp_path);
let buf      = new Buffer('dummy');
let input    = fromBuffer(buf);

(async function() {
  await pipe(input, dest);
  // now, tmp_path file content is 'dummy'
})();
```
