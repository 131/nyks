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
const drain = require('nyks/stream/drain');

// do something
```

------

<a name="fromBuffer"></a>
## fromBuffer(buffer) : Stream

Return a readable stream from a buffer.

```javascript
const fromBuffer = require('nyks/stream/fromBuffer');

// do something
```

------

<a name="pipe"></a>
## pipe(src, dest) : Promise

Pipe a stream to another.

```javascript
const pipe = require('nyks/stream/pipe');

// do something
```
