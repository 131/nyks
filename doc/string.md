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

capitalize('john thegood'); // return 'John thegood'
```

------

<a name="chunk"></a>
## chunk(str, size) : Array

Split a string into chunk of specified size.

```javascript
const chunk = require('nyks/string/chunk');

chunk("abc");    // return ["a", "b", "c"]
chunk("abc", 2); // return ["ab", "c"]
chunk("abc", 0); // return ["abc"]
```

------

<a name="crc32"></a>
## crc32(str) : Int

Crc32 of current string.

```javascript
const crc32 = require('nyks/string/crc32');

crc32("foobar"); // return -1628037227
```

------

<a name="format"></a>
## format(str[, arg1][, arg2][...]) : String

Lite equivalent for util.format/sprintf (from util.format).

```javascript
const format = require('nyks/string/format');

let object = {go : 42};

format("%d %s %j", -2, 'dummy', o)).to.eql('-2 dummy {"go":42}');

/*
  The tolerated types are :

  * %s : convert into a String
  * %d : convert into a Number
  * %j : stringify an Object
*/
```

------

<a name="hexToRgb"></a>
## hexToRgb(str) : Array

Alias of [color/hexToRgb](./color.md#hexToRgb).

------

<a name="prettyFileSize"></a>
## prettyFileSize(bytes) : String

Return a pretty format of Bytes.

```javascript
const prettyFileSize = require('nyks/string/prettyFileSize');

prettyFileSize(0);    // return "0B"
prettyFileSize(1);    // return "1B"
prettyFileSize(1024); // return "1kB"
prettyFileSize(1023); // return "0.99kB"
```

------

<a name="repeat"></a>
## repeat(str) : String

Nothing fancy, alternative to mout.

```javascript
const repeat = require('nyks/string/repeat');

repeat("abc", 3); // return "abcabcabc"
```

------

<a name="replaces"></a>
## replaces(str, data) : String

Replace collection in current string.

```javascript
const replaces = require('nyks/string/replaces');

let str  = "You know &what;, &who;";
let data = {
  '&who;'  : 'John Snow',
  '&what;' : 'nothing'
};

replaces(str, data); // return "You know nothing, John Snow"
```

------

<a name="rot13"></a>
## rot13(str) : String

Rot13 of current string.

```javascript
const rot13 = require('nyks/string/rot13');

rot13("a"); // return "n"
rot13("n"); // return "a"
```

------

<a name="rreplaces"></a>
## rreplaces(str, data) : String

Recursive (iterative) replaces.

```javascript
const rreplaces = require('nyks/string/rreplaces');

let str  = "You know &&wh;at;, &&wh;o;";
let data = {
  '&who;'  : 'John Snow',
  '&what;' : 'nothing',
  '&wh;'   : 'wh'
};

rreplaces(str, data); // return "You know nothing, John Snow"
```

------

<a name="sprintf"></a>
## sprintf(str[, arg1][, arg2][...]) : String

Sprintf as you think it is (like format, but more complete).
For usage exemples, juste follow [this link](https://www.npmjs.com/package/sprintf)

------

<a name="stripEnd"></a>
## stripEnd(str, end) : String

Strip string pattern at end (complete mout/string/endsWith).

```javascript
const stripEnd = require('nyks/string/stripEnd');

let str = "This is a string (yes it is)";
stripEnd(str, "(yes it is)") // return "this is a string "
```

------

<a name="stripStart"></a>
## stripStart(str, start) : String

Strip string pattern at beginning (complete mout/string/startsWith).

```javascript
const stripStart = require('nyks/string/stripStart');

let str = "This is a string (yes it is)";
stripStart(str, "This is a string") // return " (yes it is)"
```

------

<a name="truncate"></a>
## truncate(str[, pos][, concat) : String

Truncate string to fixed length (default length is 10).

```javascript
const truncate = require('nyks/string/truncate');

truncate("123456789ABC");             // return "123456789…"
truncate("123456789ABC", 8);          // return "1234567…"
truncate("123456789ABC", 5, "...");   // return "12..."
truncate("123456789ABC", -6, "[..]"); // return "[..]78"
```
