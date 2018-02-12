# String

Stream utilities

------

## Table of Contents

  * [capitalize()](#capitalize)
  * [chunk()](#chunk)
  * [crc32()](#crc32)
  * [format()](#format)
  * [hexToRgb()](#hexToRgb)
  * [prettyFileSize()](#prettyFileSize)
  * [repeat()](#repeat)
  * [replaces()](#replaces)
  * [rot13()](#rot13)
  * [rreplaces()](#rreplaces)
  * [sprintf()](#sprintf)
  * [stripEnd()](#stripEnd)
  * [stripStart()](#stripStart)
  * [truncate()](#truncate)

------

<a name="capitalize"></a>
## capitalize(str) : String

Capitalize the first letter of a string.

```javascript
const capitalize = require('nyks/string/capitalize');

// do something
```

------

<a name="chunk"></a>
## chunk(str, size) : Array

Split a string into chunk of specified size.

```javascript
const chunk = require('nyks/string/chunk');

// do something
```

------

<a name="crc32"></a>
## crc32(str) : Int

Crc32 of current string.

```javascript
const crc32 = require('nyks/string/crc32');

// do something
```

------

<a name="format"></a>
## format(str[, arg1][, arg2][...]) : String

Lite equivalent for util.format/sprintf (from util.format).

```javascript
const format = require('nyks/string/format');

// do something
```

------

<a name="hexToRgb"></a>
## hexToRgb(str) : Array

Convert Hexadecimal color code to RGB array.

```javascript
const hexToRgb = require('nyks/string/hexToRgb');

// do something
```

------

<a name="prettyFileSize"></a>
## prettyFileSize(bytes) : String

Return a pretty format of Bytes.

```javascript
const prettyFileSize = require('nyks/string/prettyFileSize');

// do something
```

------

<a name="repeat"></a>
## repeat(str) : String

Nothing fancy, alternative to mout.

```javascript
const repeat = require('nyks/string/repeat');

// do something
```

------

<a name="replaces"></a>
## replaces(str, data) : String

Replace collection in current string.

```javascript
const replaces = require('nyks/string/replaces');

// do something
```

------

<a name="rot13"></a>
## rot13(str) : String

Rot13 of current string.

```javascript
const rot13 = require('nyks/string/rot13');

// do something
```

------

<a name="rreplaces"></a>
## rreplaces(str, data) : String

Recursive (iterative) replaces.

```javascript
const rreplaces = require('nyks/string/rreplaces');

// do something
```

------

<a name="sprintf"></a>
## sprintf(str[, arg1][, arg2][...]) : String

Sprintf as you think it is (like format, but more complete).

```javascript
const sprintf = require('nyks/string/sprintf');

// do something
```

------

<a name="stripEnd"></a>
## stripEnd(str, end) : String

Strip string pattern at end (complete mout/string/endsWith).

```javascript
const stripEnd = require('nyks/string/stripEnd');

// do something
```

------

<a name="stripStart"></a>
## stripStart(str, start) : String

Strip string pattern at beginning (complete mout/string/startsWith).

```javascript
const stripStart = require('nyks/string/stripStart');

// do something
```

------

<a name="truncate"></a>
## truncate(str[, pos][, concat) : String

Truncate string to fixed length.

```javascript
const truncate = require('nyks/string/truncate');

// do something
```
