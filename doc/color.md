# Color

Color utilities

------

## Table of Contents

  * [Int2RGBA()](#Int2RGBA)
  * [RGB2HTML()](#RGB2HTML)
  * [RGBA2Int()](#RGBA2Int)

------

<a name="Int2RGBA"></a>
## Int2RGBA(int) : Object

Return an Object with Red Green Blue Alpha values from an Integer.

```javascript
const Int2RGBA = require('nyks/color/Int2RGBA');
const RGBA2Int = require('nyks/color/RGBA2Int');

// Meta exemple
var color = {r : 0, g : 0, b : 24, a : 12};
Int2RGBA(RGBA2Int(color)); // return ... color !
```

------

<a name="RGB2HTML"></a>
## RGB2HTML(arr) : String

Return an Hexadecimal code from an array of rgba values.

```javascript
const RGB2HTML = require('nyks/color/RGB2HTML');

var color = {r : 255, g : 0, b : 255, a : 12};
RGB2HTML(color); // return "#ff00ff"
```

------

<a name="RGBA2Int"></a>
## RGBA2Int(arr) : Integer

Return an Integer value from an array of rgba values.

```javascript
const Int2RGBA = require('nyks/color/Int2RGBA');
const RGBA2Int = require('nyks/color/RGBA2Int');

// Meta exemple
var color = {r : 0, g : 0, b : 24, a : 12};
Int2RGBA(RGBA2Int(color)); // return ... color !
```
