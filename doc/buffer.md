# Buffer

Buffer utilities

------

## Table of Contents

  * [fromASCII()](#fromASCII)
  * [fromInt()](#fromInt)
  * [indexOf()](#indexOf)
  * [readUInt()](#readUInt)
  * [writeBits()](#writeBits)

------

<a name="fromASCII"></a>
## fromASCII(str) : Array

Return an Array of ASCII codes from a String.

```javascript
const fromASCII = require('nyks/buffer/fromASCII');

fromASCII("ABCD") // return [65, 66, 67, 68], ASCII codes for ABCD
```

------

<a name="fromInt"></a>
## fromInt(int[, length]) : Buffer

Convert Int to Buffer.

```javascript
const fromInt  = require('nyks/buffer/fromInt');
const readUInt = require('nyks/buffer/readUInt');

// Meta exemple
readUInt(fromInt(8)) // return ... 8 !
```

------

<a name="indexOf"></a>
## indexOf(buffer, search[, offset][, stop]) : Int

Binary search of byte. Return -1 if not found.

```javascript
const indexOf = require('nyks/buffer/indexOf');

var arr  = new Buffer([1, 2, 3, 4, 5]);

indexOf(arr, 1) // return 0
indexOf(arr, new Buffer([3,4])) // return 1
indexOf(arr, 9) // return -1

var str  = "cat eat mouses";
indexOf(str, "mouses") // return 8
```

------

<a name="readUInt"></a>
## readUInt(buffer[, offset][, length]) : Int

Convert Buffer to Int.

```javascript
const fromInt  = require('nyks/buffer/fromInt');
const readUInt = require('nyks/buffer/readUInt');

// Meta exemple
readUInt(fromInt(8)) // return ... 8 !
```

------

<a name="writeBits"></a>
## writeBits(target, source, bitoffset[, sourcebitLength])

PLACEHOLDER_DESC

```javascript
const writeBits = require('nyks/buffer/writeBits');

// do something
```
